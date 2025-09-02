import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { updateJobStatusSchema } from '@/lib/validations/job.schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const job = await db.job.findUnique({
      where: { id: params.jobId },
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
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const body = await request.json();
    
    // Handle status updates with validation
    if (body.status) {
      const validatedData = updateJobStatusSchema.parse(body);
      
      const job = await db.job.findUnique({
        where: { id: params.jobId },
        include: { proofs: true },
      });

      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      // Business rule validation
      if (job.status === 'READY_FOR_PRESS' && validatedData.status === 'IN_PRESS') {
        const hasApprovedProof = job.proofs.some(p => p.status === 'APPROVED');
        if (!hasApprovedProof && !validatedData.overrideReason) {
          return NextResponse.json(
            { error: 'Approved proof required or admin override reason needed' },
            { status: 400 }
          );
        }
      }

      const updatedJob = await db.job.update({
        where: { id: params.jobId },
        data: { status: validatedData.status },
        include: {
          client: { select: { name: true } },
          csr: { select: { name: true } },
          locations: true,
          proofs: { select: { status: true } },
        },
      });

      // Log activity
      await db.activity.create({
        data: {
          jobId: params.jobId,
          userId: job.csrId, // In production, get from auth context
          action: 'STATUS_CHANGED',
          meta: {
            oldStatus: job.status,
            newStatus: validatedData.status,
            overrideReason: validatedData.overrideReason,
          },
        },
      });

      return NextResponse.json({ job: updatedJob });
    }

    // Handle other updates
    const updatedJob = await db.job.update({
      where: { id: params.jobId },
      data: body,
      include: {
        client: { select: { name: true } },
        csr: { select: { name: true } },
        locations: true,
        proofs: { select: { status: true } },
      },
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    await db.job.delete({
      where: { id: params.jobId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}