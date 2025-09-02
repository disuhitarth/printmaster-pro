import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        jobs: {
          select: {
            id: true,
            jobCode: true,
            qtyTotal: true,
            createdAt: true,
            status: true,
          }
        }
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Calculate metrics
    const totalJobs = client.jobs.length;
    const totalRevenue = client.jobs.reduce((sum, job) => sum + (job.qtyTotal * 10), 0);
    const averageOrderValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;
    const lastOrder = client.jobs.length > 0 
      ? client.jobs.reduce((latest, job) => 
          job.createdAt > latest ? job.createdAt : latest, 
          client.jobs[0].createdAt
        )
      : null;

    const clientWithMetrics = {
      ...client,
      totalJobs,
      totalRevenue,
      averageOrderValue,
      lastOrder,
    };

    return NextResponse.json({ client: clientWithMetrics });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: params.id }
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken by another client
    if (body.email && body.email !== existingClient.email) {
      const emailTaken = await prisma.client.findFirst({
        where: { 
          email: body.email,
          id: { not: params.id }
        }
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: 'Email already exists for another client' },
          { status: 400 }
        );
      }
    }

    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        address: body.address || '',
        contactPerson: body.contactPerson || '',
        notes: body.notes || '',
        status: body.status || 'active',
      }
    });

    return NextResponse.json({ client });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        jobs: true
      }
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Check if client has jobs
    if (existingClient.jobs.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete client with existing jobs. Please remove all jobs first.' },
        { status: 400 }
      );
    }

    await prisma.client.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}