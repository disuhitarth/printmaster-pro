'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import JsBarcode from 'jsbarcode';
import { formatDate } from '@/lib/utils';

interface Job {
  id: string;
  jobCode: string;
  oeNumber: string;
  client: { name: string };
  productId: string;
  qtyTotal: number;
  shipDate: Date | string;
  locations: Array<{
    name: string;
    pms: string[];
    widthIn: number;
    heightIn: number;
    placementNote?: string;
  }>;
  notes?: string;
  rush24hr: boolean;
  needPhoto: boolean;
}

interface PrintTicketProps {
  job: Job;
  onPrint?: () => void;
}

export function PrintTicket({ job, onPrint }: PrintTicketProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const generateBarcode = () => {
    if (canvasRef.current) {
      JsBarcode(canvasRef.current, job.jobCode, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: true,
        fontSize: 14,
        margin: 10,
      });
    }
  };

  const handlePrint = () => {
    generateBarcode();
    setTimeout(() => {
      if (printRef.current) {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // Reload to restore functionality
      }
      onPrint?.();
    }, 100);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handlePrint} className="mb-4">
        Print Production Ticket
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <div ref={printRef} className="p-6 font-mono text-sm print-ticket">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-4">PRODUCTION TICKET</h1>
            <canvas ref={canvasRef} className="mx-auto mb-4"></canvas>
            <div className="text-lg font-semibold">{job.jobCode}</div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold mb-3 border-b border-gray-300 pb-1">JOB INFORMATION</h3>
              <div className="space-y-2">
                <div><strong>Job Code:</strong> {job.jobCode}</div>
                <div><strong>OE#:</strong> {job.oeNumber}</div>
                <div><strong>Client:</strong> {job.client.name}</div>
                <div><strong>Product:</strong> {job.productId}</div>
                <div><strong>Quantity:</strong> {job.qtyTotal}</div>
                <div><strong>Ship Date:</strong> {formatDate(job.shipDate)}</div>
                {job.rush24hr && (
                  <div><strong>⚠️ RUSH 24HR TURNAROUND</strong></div>
                )}
                {job.needPhoto && (
                  <div><strong>📷 PHOTO REQUIRED</strong></div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3 border-b border-gray-300 pb-1">PRINT SPECIFICATIONS</h3>
              {job.locations.map((location, index) => (
                <div key={index} className="mb-4">
                  <div><strong>Location:</strong> {location.name}</div>
                  <div><strong>Size:</strong> {location.widthIn}" W × {location.heightIn}" H</div>
                  <div><strong>Colors:</strong> {location.pms.join(', ')}</div>
                  {location.placementNote && (
                    <div><strong>Placement:</strong> {location.placementNote}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-3 border-b border-gray-300 pb-1">PRODUCTION CHECKLIST</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Pre-Production</h4>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Vellum</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Screen</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Product</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Quality Checks</h4>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Style</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Color</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Pantone Match</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Print Quality</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Print Location</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Initials</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs">CSR:</label>
                    <div className="border-b border-gray-400 h-6"></div>
                  </div>
                  <div>
                    <label className="block text-xs">Printer:</label>
                    <div className="border-b border-gray-400 h-6"></div>
                  </div>
                  <div>
                    <label className="block text-xs">QC:</label>
                    <div className="border-b border-gray-400 h-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {job.notes && (
            <div className="mb-6">
              <h3 className="font-bold mb-3 border-b border-gray-300 pb-1">NOTES</h3>
              <div className="p-2 border border-gray-300 rounded min-h-16">
                {job.notes}
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-600 border-t border-gray-300 pt-4">
            Generated: {new Date().toLocaleString()} | Production Ticket v1.0
          </div>
        </div>
      </Card>
    </div>
  );
}