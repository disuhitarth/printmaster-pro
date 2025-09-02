'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  ChevronDown,
  Loader2
} from 'lucide-react';
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

interface ExportButtonProps {
  jobs?: Job[];
  statusFilter?: string;
  className?: string;
}

export function ExportButton({ jobs = [], statusFilter, className = '' }: ExportButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { exportToExcel, exportJobsToExcel, exportFilteredJobs, isExporting, exportError, clearError } = useKanbanExport();

  const handleExport = async (format: 'xlsx' | 'csv' = 'xlsx') => {
    setShowOptions(false);
    clearError();
    
    if (jobs.length > 0) {
      // Use local job data if available
      if (statusFilter) {
        exportFilteredJobs(jobs, statusFilter, format);
      } else {
        exportJobsToExcel(jobs, format);
      }
    } else {
      // Use API endpoint with mock data
      await exportToExcel(format);
    }
  };

  const getJobCount = () => {
    if (!jobs.length) return 'All Jobs';
    const count = statusFilter && statusFilter !== 'ALL' 
      ? jobs.filter(job => job.status === statusFilter).length 
      : jobs.length;
    return `${count} Jobs`;
  };

  const getFilterDescription = () => {
    if (!jobs.length) return 'Export all available jobs';
    if (statusFilter && statusFilter !== 'ALL') {
      const count = jobs.filter(job => job.status === statusFilter).length;
      return `Export ${count} jobs with status: ${statusFilter.replace('_', ' ')}`;
    }
    return `Export ${jobs.length} filtered jobs`;
  };

  return (
    <div className="relative">
      {/* Main Export Button */}
      <div className="flex">
        <Button
          onClick={() => handleExport('xlsx')}
          disabled={isExporting}
          className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export Excel
          <Badge className="ml-2 bg-white/20 text-white border-white/30">
            {getJobCount()}
          </Badge>
        </Button>
        
        {/* Dropdown Toggle */}
        <Button
          onClick={() => setShowOptions(!showOptions)}
          disabled={isExporting}
          className="ml-1 px-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Export Options Dropdown */}
      {showOptions && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 z-[99999]">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
              Export Format
            </div>
            
            <button
              onClick={() => handleExport('xlsx')}
              disabled={isExporting}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Excel (.xlsx)</div>
                <div className="text-xs text-gray-500">Full formatting and formulas</div>
              </div>
            </button>
            
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <FileText className="w-4 h-4 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">CSV (.csv)</div>
                <div className="text-xs text-gray-500">Compatible with all spreadsheet apps</div>
              </div>
            </button>
          </div>
          
          <div className="border-t border-gray-100 p-3">
            <div className="text-xs text-gray-500">
              {getFilterDescription()}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showOptions && (
        <div
          className="fixed inset-0 z-[99998]"
          onClick={() => setShowOptions(false)}
        />
      )}

      {/* Error Display */}
      {exportError && (
        <div className="absolute top-full left-0 mt-2 w-full bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg z-[99999]">
          <div className="text-sm text-red-800">
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