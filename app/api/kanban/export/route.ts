import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';

// Mock data for demonstration - in a real app, this would come from your database
const getMockKanbanData = () => {
  return [
    {
      id: 'job-001',
      jobCode: 'PRT-2024-001',
      oeNumber: 'OE-001',
      client: 'Acme Corp',
      status: 'NEW',
      shipDate: new Date('2024-01-15'),
      rush24hr: true,
      prePro: false,
      qtyTotal: 500,
      productId: 'T-SHIRT-001',
      notes: 'Rush order for corporate event',
      createdAt: new Date('2024-01-10'),
      csr: 'John Smith'
    },
    {
      id: 'job-002', 
      jobCode: 'PRT-2024-002',
      oeNumber: 'OE-002',
      client: 'Tech Startup Inc',
      status: 'WAITING_ARTWORK',
      shipDate: new Date('2024-01-20'),
      rush24hr: false,
      prePro: true,
      qtyTotal: 250,
      productId: 'HOODIE-001',
      notes: 'Pre-production sample required',
      createdAt: new Date('2024-01-12'),
      csr: 'Sarah Johnson'
    },
    {
      id: 'job-003',
      jobCode: 'PRT-2024-003', 
      oeNumber: 'OE-003',
      client: 'Local Restaurant',
      status: 'READY_FOR_PRESS',
      shipDate: new Date('2024-01-18'),
      rush24hr: false,
      prePro: false,
      qtyTotal: 100,
      productId: 'APRON-001',
      notes: 'Standard order',
      createdAt: new Date('2024-01-08'),
      csr: 'Mike Davis'
    },
    {
      id: 'job-004',
      jobCode: 'PRT-2024-004',
      oeNumber: 'OE-004', 
      client: 'Sports Team',
      status: 'IN_PRESS',
      shipDate: new Date('2024-01-22'),
      rush24hr: false,
      prePro: false,
      qtyTotal: 75,
      productId: 'JERSEY-001',
      notes: 'Team jerseys with numbers',
      createdAt: new Date('2024-01-05'),
      csr: 'Lisa Wang'
    },
    {
      id: 'job-005',
      jobCode: 'PRT-2024-005',
      oeNumber: 'OE-005',
      client: 'Marketing Agency',
      status: 'QC',
      shipDate: new Date('2024-01-16'),
      rush24hr: true,
      prePro: false,
      qtyTotal: 300,
      productId: 'POLO-001',
      notes: 'Premium quality polo shirts',
      createdAt: new Date('2024-01-11'),
      csr: 'Tom Brown'
    },
    {
      id: 'job-006',
      jobCode: 'PRT-2024-006',
      oeNumber: 'OE-006',
      client: 'School District',
      status: 'PACKED',
      shipDate: new Date('2024-01-19'),
      rush24hr: false,
      prePro: false,
      qtyTotal: 600,
      productId: 'T-SHIRT-002',
      notes: 'School spirit shirts',
      createdAt: new Date('2024-01-03'),
      csr: 'Emma Wilson'
    }
  ];
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xlsx';

    // Get Kanban data (in real app, this would be from database)
    const jobs = getMockKanbanData();

    // Prepare data for export
    const exportData = jobs.map(job => ({
      'Job Code': job.jobCode,
      'OE Number': job.oeNumber,
      'Client': job.client,
      'Status': job.status,
      'Ship Date': job.shipDate.toLocaleDateString(),
      'Rush 24hr': job.rush24hr ? 'Yes' : 'No',
      'Pre-Pro': job.prePro ? 'Yes' : 'No',
      'Quantity': job.qtyTotal,
      'Product ID': job.productId,
      'CSR': job.csr,
      'Created Date': job.createdAt.toLocaleDateString(),
      'Notes': job.notes || ''
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 15 }, // Job Code
      { wch: 12 }, // OE Number  
      { wch: 20 }, // Client
      { wch: 18 }, // Status
      { wch: 12 }, // Ship Date
      { wch: 10 }, // Rush 24hr
      { wch: 10 }, // Pre-Pro
      { wch: 10 }, // Quantity
      { wch: 15 }, // Product ID
      { wch: 15 }, // CSR
      { wch: 12 }, // Created Date
      { wch: 30 }  // Notes
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kanban Jobs');

    // Generate buffer
    const buffer = XLSX.write(workbook, { 
      bookType: format as XLSX.BookType, 
      type: 'buffer' 
    });

    // Set headers for file download
    const filename = `kanban-export-${new Date().toISOString().split('T')[0]}.${format}`;
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': format === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' }, 
      { status: 500 }
    );
  }
}