'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useKanbanExport } from '@/hooks/useKanbanExport';

interface Job {
  id: string;
  jobCode: string;
  oeNumber: string;
  client: string;
  status: string;
  shipDate: Date;
  rush24hr: boolean;
  prePro: boolean;
  qtyTotal: number;
  productId: string;
  notes?: string;
  createdAt: Date;
  csr: string;
}

interface ColumnExportButtonProps {
  jobs: Job[];
  columnTitle: string;
  status: string;
  className?: string;
}

export function ColumnExportButton({ jobs, columnTitle, status, className = '' }: ColumnExportButtonProps) {
  const { exportJobsToExcel, isExporting, exportError, clearError } = useKanbanExport();

  const handleExport = (format: 'xlsx' | 'csv' = 'xlsx') => {
    clearError();
    
    // Filter jobs for this specific status
    const statusJobs = jobs.filter(job => job.status === status);
    
    if (statusJobs.length === 0) {
      return;
    }
    
    exportJobsToExcel(statusJobs, format);
  };

  const jobCount = jobs.filter(job => job.status === status).length;

  if (jobCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        onClick={() => handleExport('xlsx')}
        disabled={isExporting}
        size="sm"
        variant="ghost"
        className={`h-6 px-2 text-xs opacity-70 hover:opacity-100 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all ${className}`}
        title={`Export ${jobCount} ${columnTitle.toLowerCase()} jobs to Excel`}
      >
        {isExporting ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            <Download className="w-3 h-3 mr-1" />
            Export ({jobCount})
          </>
        )}
      </Button>

      {/* Error Display */}
      {exportError && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-red-50 border border-red-200 rounded-lg p-2 shadow-lg z-50">
          <div className="text-xs text-red-800">
            <span className="font-medium">Export failed:</span> {exportError}
          </div>
          <button
            onClick={clearError}
            className="text-xs text-red-600 hover:text-red-800 mt-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}