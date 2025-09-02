import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        jobs: {
          select: {
            id: true,
            qtyTotal: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Calculate metrics for each client
    const clientsWithMetrics = clients.map(client => {
      const totalJobs = client.jobs.length;
      const totalRevenue = client.jobs.reduce((sum, job) => sum + (job.qtyTotal * 10), 0); // Mock revenue calculation
      const averageOrderValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;
      const lastOrder = client.jobs.length > 0 
        ? client.jobs.reduce((latest, job) => 
            job.createdAt > latest ? job.createdAt : latest, 
            client.jobs[0].createdAt
          )
        : null;

      return {
        ...client,
        totalJobs,
        totalRevenue,
        averageOrderValue,
        lastOrder,
        jobs: undefined // Remove jobs array from response
      };
    });

    return NextResponse.json({ clients: clientsWithMetrics });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if client with this email already exists
    const existingClient = await prisma.client.findUnique({
      where: { email: body.email }
    });

    if (existingClient) {
      return NextResponse.json(
        { error: 'Client with this email already exists' },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
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

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}