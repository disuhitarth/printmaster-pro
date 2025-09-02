import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const csrId = searchParams.get('csrId');
    const clientId = searchParams.get('clientId');
    const pressId = searchParams.get('pressId');

    // Default to last 30 days if no date range provided
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const defaultEndDate = new Date();

    const dateFilter = {
      shipDate: {
        gte: startDate ? new Date(startDate) : defaultStartDate,
        lte: endDate ? new Date(endDate) : defaultEndDate,
      },
    };

    const where: any = { ...dateFilter };
    if (csrId) where.csrId = csrId;
    if (clientId) where.clientId = clientId;
    if (pressId && pressId !== 'all') {
      where.pressSetup = {
        pressId: pressId,
      };
    }

    // Get all jobs in the date range with filters
    const jobs = await db.job.findMany({
      where,
      include: {
        client: { select: { name: true } },
        csr: { select: { name: true } },
        qcRecords: true,
        pressSetup: true,
        activities: {
          where: {
            action: { in: ['STATUS_CHANGED', 'PRESS_SETUP_COMPLETED'] },
          },
        },
      },
    });

    // Calculate KPIs
    const totalJobs = jobs.length;
    const shippedJobs = jobs.filter(job => job.status === 'SHIPPED').length;
    const lateJobs = jobs.filter(job => {
      const shipDate = new Date(job.shipDate);
      const today = new Date();
      return shipDate < today && job.status !== 'SHIPPED';
    }).length;

    // On-time percentage
    const onTimeJobs = jobs.filter(job => {
      if (job.status !== 'SHIPPED') return false;
      // Simplified: assume shipped jobs are on time if shipped before ship date
      const shipDate = new Date(job.shipDate);
      const lastActivity = job.activities
        .filter(a => a.action === 'STATUS_CHANGED' && a.meta?.newStatus === 'SHIPPED')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      if (!lastActivity) return true; // Assume on time if no specific shipped activity
      const shippedDate = new Date(lastActivity.createdAt);
      return shippedDate <= shipDate;
    }).length;

    const onTimePercentage = shippedJobs > 0 ? Math.round((onTimeJobs / shippedJobs) * 100) : 100;

    // Rush jobs metrics
    const rushJobs = jobs.filter(job => job.rush24hr);
    const rushCompleted = rushJobs.filter(job => job.status === 'SHIPPED').length;
    const rushSuccessPercentage = rushJobs.length > 0 ? Math.round((rushCompleted / rushJobs.length) * 100) : 100;

    // QC metrics
    const jobsWithQC = jobs.filter(job => job.qcRecords.length > 0);
    const qcPassed = jobsWithQC.filter(job => 
      job.qcRecords.some(qc => qc.passed)
    ).length;
    const qcFailed = jobsWithQC.filter(job => 
      job.qcRecords.some(qc => !qc.passed)
    ).length;

    // Calculate defects and spoilage
    const totalDefects = jobs.reduce((sum, job) => 
      sum + job.qcRecords.reduce((defectSum, qc) => defectSum + qc.defects, 0), 0
    );
    const totalQuantity = jobs.reduce((sum, job) => sum + job.qtyTotal, 0);
    const spoilagePercentage = totalQuantity > 0 ? Math.round((totalDefects / totalQuantity) * 100 * 100) / 100 : 0;

    // Reprint rate (simplified - jobs with QC failures)
    const reprintJobs = jobs.filter(job => 
      job.qcRecords.some(qc => !qc.passed && qc.defects > 5)
    ).length;
    const reprintRate = totalJobs > 0 ? Math.round((reprintJobs / totalJobs) * 100 * 100) / 100 : 0;

    // Average setup time (simplified calculation based on activities)
    const setupTimes = jobs
      .map(job => {
        const statusChanges = job.activities
          .filter(a => a.action === 'STATUS_CHANGED')
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        const readyForPress = statusChanges.find(a => a.meta?.newStatus === 'READY_FOR_PRESS');
        const inPress = statusChanges.find(a => a.meta?.newStatus === 'IN_PRESS');
        
        if (readyForPress && inPress) {
          const setup = new Date(inPress.createdAt).getTime() - new Date(readyForPress.createdAt).getTime();
          return setup / (1000 * 60); // Convert to minutes
        }
        return null;
      })
      .filter(time => time !== null) as number[];

    const avgSetupTime = setupTimes.length > 0 
      ? Math.round(setupTimes.reduce((sum, time) => sum + time, 0) / setupTimes.length) 
      : 0;

    // Status breakdown
    const statusBreakdown = {
      NEW: jobs.filter(j => j.status === 'NEW').length,
      WAITING_ARTWORK: jobs.filter(j => j.status === 'WAITING_ARTWORK').length,
      READY_FOR_PRESS: jobs.filter(j => j.status === 'READY_FOR_PRESS').length,
      IN_PRESS: jobs.filter(j => j.status === 'IN_PRESS').length,
      QC: jobs.filter(j => j.status === 'QC').length,
      PACKED: jobs.filter(j => j.status === 'PACKED').length,
      SHIPPED: jobs.filter(j => j.status === 'SHIPPED').length,
      HOLD: jobs.filter(j => j.status === 'HOLD').length,
      EXCEPTION: jobs.filter(j => j.status === 'EXCEPTION').length,
    };

    // CSR performance
    const csrPerformance = jobs.reduce((acc, job) => {
      const csrName = job.csr.name;
      if (!acc[csrName]) {
        acc[csrName] = {
          totalJobs: 0,
          shippedJobs: 0,
          rushJobs: 0,
          onTimeJobs: 0,
        };
      }
      
      acc[csrName].totalJobs++;
      if (job.status === 'SHIPPED') {
        acc[csrName].shippedJobs++;
        // Simplified on-time calculation
        const shipDate = new Date(job.shipDate);
        const today = new Date();
        if (today <= shipDate) {
          acc[csrName].onTimeJobs++;
        }
      }
      if (job.rush24hr) {
        acc[csrName].rushJobs++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const kpis = {
      totalJobs,
      shippedJobs,
      lateJobs,
      onTimePercentage,
      rushJobs: rushJobs.length,
      rushSuccessPercentage,
      spoilagePercentage,
      reprintRate,
      avgSetupTime,
      qcPassed,
      qcFailed,
      totalDefects,
      totalQuantity,
    };

    const report = {
      period: {
        startDate: startDate || defaultStartDate.toISOString(),
        endDate: endDate || defaultEndDate.toISOString(),
      },
      filters: {
        csrId,
        clientId,
        pressId,
      },
      kpis,
      statusBreakdown,
      csrPerformance,
      jobs: jobs.map(job => ({
        id: job.id,
        jobCode: job.jobCode,
        client: job.client.name,
        csr: job.csr.name,
        status: job.status,
        shipDate: job.shipDate,
        rush24hr: job.rush24hr,
        qtyTotal: job.qtyTotal,
        defects: job.qcRecords.reduce((sum, qc) => sum + qc.defects, 0),
        passed: job.qcRecords.some(qc => qc.passed),
      })),
    };

    return NextResponse.json(report);

  } catch (error) {
    console.error('Error generating reports:', error);
    return NextResponse.json(
      { error: 'Failed to generate reports' },
      { status: 500 }
    );
  }
}