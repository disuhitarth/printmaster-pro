import { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

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

export function useKanbanExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportToExcel = async (format: 'xlsx' | 'csv' = 'xlsx') => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch(`/api/kanban/export?format=${format}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const filename = `kanban-export-${new Date().toISOString().split('T')[0]}.${format}`;
      
      saveAs(blob, filename);
      
    } catch (error) {
      console.error('Export error:', error);
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const exportJobsToExcel = (jobs: Job[], format: 'xlsx' | 'csv' = 'xlsx') => {
    setIsExporting(true);
    setExportError(null);

    try {
      // Transform job data for export
      const exportData = jobs.map(job => ({
        'Job Code': job.jobCode,
        'OE Number': job.oeNumber,
        'Client': job.client,
        'Status': job.status,
        'Ship Date': job.shipDate instanceof Date ? job.shipDate.toLocaleDateString() : job.shipDate,
        'Rush 24hr': job.rush24hr ? 'Yes' : 'No',
        'Pre-Pro': job.prePro ? 'Yes' : 'No',
        'Quantity': job.qtyTotal,
        'Product ID': job.productId,
        'CSR': job.csr,
        'Created Date': job.createdAt instanceof Date ? job.createdAt.toLocaleDateString() : job.createdAt,
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

      // Generate file and trigger download
      const filename = `kanban-export-${new Date().toISOString().split('T')[0]}.${format}`;
      XLSX.writeFile(workbook, filename);

    } catch (error) {
      console.error('Export error:', error);
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const exportFilteredJobs = (jobs: Job[], statusFilter?: string, format: 'xlsx' | 'csv' = 'xlsx') => {
    let filteredJobs = jobs;
    
    if (statusFilter && statusFilter !== 'ALL') {
      filteredJobs = jobs.filter(job => job.status === statusFilter);
    }
    
    exportJobsToExcel(filteredJobs, format);
  };

  return {
    exportToExcel,
    exportJobsToExcel,
    exportFilteredJobs,
    isExporting,
    exportError,
    clearError: () => setExportError(null)
  };
}