import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateJobCode } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const csrId = searchParams.get('csrId');
    const clientId = searchParams.get('clientId');
    const rush = searchParams.get('rush');
    const needPhoto = searchParams.get('needPhoto');

    const where: any = {};
    if (status) where.status = status;
    if (csrId) where.csrId = csrId;
    if (clientId) where.clientId = clientId;
    if (rush) where.rush24hr = rush === 'true';
    if (needPhoto) where.needPhoto = needPhoto === 'true';

    const jobs = await prisma.job.findMany({
      where,
      include: {
        client: { select: { name: true } },
        csr: { select: { name: true } },
        locations: true,
        proofs: { select: { status: true } },
        qcRecords: true,
        shipments: true,
      },
      orderBy: [
        { rush24hr: 'desc' },
        { shipDate: 'asc' },
      ],
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation - in production you'd use a proper validation schema
    if (!body.oeNumber || !body.clientId || !body.csrId || !body.productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const jobCode = generateJobCode();

    const job = await prisma.job.create({
      data: {
        jobCode,
        oeNumber: body.oeNumber,
        clientId: body.clientId,
        csrId: body.csrId,
        shipDate: new Date(body.shipDate),
        rush24hr: body.rush24hr || false,
        prePro: body.prePro || false,
        needPhoto: body.needPhoto || false,
        notes: body.notes || '',
        courier: body.courier || '',
        productId: body.productId,
        qtyTotal: parseInt(body.qtyTotal) || 0,
        sizeBreakdown: JSON.stringify(body.sizeBreakdown || {}),
        // Skip locations for now since they need to be created separately in SQLite
      },
      // Skip includes for now to simplify
    });

    // Skip activity logging for now to simplify
    // TODO: Add activity logging back when Activity table relationships are properly set up

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}