import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proofUploadSchema, proofApprovalSchema } from '@/lib/validations/job.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'upload') {
      const validation = proofUploadSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid upload data', details: validation.error.issues },
          { status: 400 }
        );
      }

      const { jobId, file, version } = validation.data;

      // Check if job exists
      const job = await db.job.findUnique({
        where: { id: jobId },
        include: { proofs: { orderBy: { version: 'desc' } } },
      });

      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      // Determine next version number
      const nextVersion = version || (job.proofs[0]?.version || 0) + 1;

      // In production, upload file to storage service (UploadThing/S3)
      const fileUrl = `/proofs/${jobId}-v${nextVersion}.pdf`; // Mock URL
      const imageUrl = `/proofs/${jobId}-v${nextVersion}-thumb.png`; // Mock thumbnail

      // Create proof record
      const proof = await db.proof.create({
        data: {
          jobId,
          version: nextVersion,
          status: 'PENDING',
          fileUrl,
          imageUrl,
        },
      });

      // Log activity
      await db.activity.create({
        data: {
          jobId,
          userId: job.csrId,
          action: 'PROOF_UPLOADED',
          meta: {
            proofId: proof.id,
            version: nextVersion,
            fileUrl,
          },
        },
      });

      return NextResponse.json({ proof }, { status: 201 });

    } else if (action === 'approve' || action === 'request_changes' || action === 'supersede') {
      const validation = proofApprovalSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid approval data', details: validation.error.issues },
          { status: 400 }
        );
      }

      const { proofId, status, approvedBy, approverEmail, notes } = validation.data;

      // Update proof status
      const proof = await db.proof.update({
        where: { id: proofId },
        data: {
          status,
          approvedAt: status === 'APPROVED' ? new Date() : null,
          approvedBy,
          approverEmail,
          notes,
        },
        include: { job: true },
      });

      // If superseded, mark previous proofs as superseded
      if (action === 'supersede') {
        await db.proof.updateMany({
          where: {
            jobId: proof.jobId,
            version: { lt: proof.version },
            status: { notIn: ['SUPERSEDED'] },
          },
          data: { status: 'SUPERSEDED' },
        });
      }

      // Log activity
      await db.activity.create({
        data: {
          jobId: proof.jobId,
          userId: proof.job.csrId,
          action: `PROOF_${status}`,
          meta: {
            proofId: proof.id,
            version: proof.version,
            approvedBy,
            approverEmail,
            notes,
          },
        },
      });

      // If approved, potentially advance job status
      if (status === 'APPROVED' && proof.job.status === 'WAITING_ARTWORK') {
        await db.job.update({
          where: { id: proof.jobId },
          data: { status: 'READY_FOR_PRESS' },
        });

        await db.activity.create({
          data: {
            jobId: proof.jobId,
            userId: proof.job.csrId,
            action: 'STATUS_CHANGED',
            meta: {
              oldStatus: 'WAITING_ARTWORK',
              newStatus: 'READY_FOR_PRESS',
              reason: 'Proof approved',
            },
          },
        });
      }

      return NextResponse.json({ proof });

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be upload, approve, request_changes, or supersede' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error handling proof action:', error);
    return NextResponse.json(
      { error: 'Failed to process proof action' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const proofs = await db.proof.findMany({
      where: { jobId },
      orderBy: { version: 'desc' },
    });

    return NextResponse.json({ proofs });
  } catch (error) {
    console.error('Error fetching proofs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proofs' },
      { status: 500 }
    );
  }
}