import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { updateJobStatusSchema } from '@/lib/validations/job.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barcode, action, overrideReason } = body;

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode is required' },
        { status: 400 }
      );
    }

    // Find job by job code (barcode)
    const job = await db.job.findUnique({
      where: { jobCode: barcode },
      include: {
        proofs: true,
        qcRecords: true,
        client: { select: { name: true } },
        csr: { select: { name: true } },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Determine next status based on current status and action
    let newStatus = job.status;
    
    if (action === 'advance') {
      switch (job.status) {
        case 'NEW':
          newStatus = 'WAITING_ARTWORK';
          break;
        case 'WAITING_ARTWORK':
          newStatus = 'READY_FOR_PRESS';
          break;
        case 'READY_FOR_PRESS':
          // Check if proof is approved before advancing to IN_PRESS
          const hasApprovedProof = job.proofs.some(p => p.status === 'APPROVED');
          if (!hasApprovedProof && !overrideReason) {
            return NextResponse.json(
              { 
                error: 'Approved proof required before advancing to In Press',
                requiresOverride: true,
                currentStatus: job.status,
                suggestedStatus: 'IN_PRESS'
              },
              { status: 400 }
            );
          }
          newStatus = 'IN_PRESS';
          break;
        case 'IN_PRESS':
          newStatus = 'QC';
          break;
        case 'QC':
          newStatus = 'PACKED';
          break;
        case 'PACKED':
          // Check if photo is required
          if (job.needPhoto) {
            const hasQCPhoto = job.qcRecords.some(qc => qc.photoUrl);
            if (!hasQCPhoto) {
              return NextResponse.json(
                { 
                  error: 'QC photo required before shipping',
                  requiresPhoto: true,
                  currentStatus: job.status
                },
                { status: 400 }
              );
            }
          }
          newStatus = 'SHIPPED';
          break;
        case 'SHIPPED':
          return NextResponse.json(
            { message: 'Job is already shipped', job },
            { status: 200 }
          );
        default:
          return NextResponse.json(
            { error: 'Cannot advance from current status' },
            { status: 400 }
          );
      }
    } else if (action === 'hold') {
      newStatus = 'HOLD';
    } else if (action === 'exception') {
      newStatus = 'EXCEPTION';
    } else {
      // Custom status provided
      const validation = updateJobStatusSchema.safeParse({ status: action, overrideReason });
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid status or missing override reason' },
          { status: 400 }
        );
      }
      newStatus = action;
    }

    // Update job status
    const updatedJob = await db.job.update({
      where: { id: job.id },
      data: { status: newStatus },
      include: {
        client: { select: { name: true } },
        csr: { select: { name: true } },
        locations: true,
        proofs: { select: { status: true } },
        qcRecords: true,
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        jobId: job.id,
        userId: job.csrId, // In production, get from auth context
        action: 'STATUS_CHANGED_VIA_SCAN',
        meta: {
          oldStatus: job.status,
          newStatus,
          barcode,
          overrideReason,
          scannedAt: new Date().toISOString(),
        },
      },
    });

    // Return success response with updated job
    return NextResponse.json({
      success: true,
      message: `Job ${job.jobCode} advanced from ${job.status} to ${newStatus}`,
      job: updatedJob,
      oldStatus: job.status,
      newStatus,
    });

  } catch (error) {
    console.error('Error processing barcode scan:', error);
    return NextResponse.json(
      { error: 'Failed to process barcode scan' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch job by barcode (for scan-to-view functionality)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('barcode');

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode parameter is required' },
        { status: 400 }
      );
    }

    const job = await db.job.findUnique({
      where: { jobCode: barcode },
      include: {
        client: true,
        csr: { select: { name: true, email: true } },
        locations: true,
        proofs: { orderBy: { version: 'desc' } },
        screens: true,
        inks: true,
        qcRecords: { orderBy: { createdAt: 'desc' } },
        shipments: { orderBy: { createdAt: 'desc' } },
        activities: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        pressSetup: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job by barcode:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}