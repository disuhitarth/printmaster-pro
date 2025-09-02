'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Truck,
  FileImage,
  Printer,
  Package,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Camera,
  Tag,
} from 'lucide-react';
import { formatDate, hexFromPMS } from '@/lib/utils';
import { PrintTicket } from '@/components/print/PrintTicket';

interface Job {
  id: string;
  jobCode: string;
  oeNumber: string;
  status: string;
  client: { name: string };
  csr: { name: string };
  shipDate: Date | string;
  rush24hr: boolean;
  prePro: boolean;
  needPhoto: boolean;
  productId: string;
  qtyTotal: number;
  courier?: string;
  notes?: string;
  locations: Array<{
    name: string;
    widthIn: number;
    heightIn: number;
    colors: number;
    pms: string[];
    underbase: boolean;
    halftoneLpi?: number;
    placementNote?: string;
  }>;
  proofs: Array<{
    id: string;
    version: number;
    status: string;
    fileUrl: string;
    approvedAt?: Date;
    approvedBy?: string;
    notes?: string;
  }>;
  screens?: Array<{
    screenId: string;
    mesh: number;
    tensionN?: number;
    emulsion?: string;
    exposureSec?: number;
    reclaimStatus?: string;
  }>;
  inks?: Array<{
    name: string;
    pms?: string;
    type: string;
    flashTempF?: number;
    cureTempF?: number;
    additives?: string;
  }>;
  pressSetup?: {
    pressId: string;
    platen?: string;
    squeegeeDurometer?: number;
    strokes?: number;
    offContact?: number;
    flashTimeMs?: number;
    testPrintPass: boolean;
  };
  qcRecords: Array<{
    id: string;
    exitTempF?: number;
    passed: boolean;
    defects: number;
    reasons?: string[];
    photoUrl?: string;
    createdAt: Date;
  }>;
  sizeBreakdown: Record<string, number>;
  activities: Array<{
    id: string;
    action: string;
    user: { name: string };
    createdAt: Date;
    meta?: any;
  }>;
  // Paper checklist fields
  vellum?: boolean;
  screen?: boolean;
  product?: boolean;
  checklistNotes?: string;
  checklistInitial?: string;
  style?: boolean;
  colour?: boolean;
  oneSide?: boolean;
  twoSide?: boolean;
  pantoneMatch?: boolean;
  printQuality?: boolean;
  printLocation?: boolean;
  csrInitial?: string;
  printerInitial?: string;
  approvalInitial?: string;
  qcInitial?: string;
}

interface JobDetailDrawerProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onJobUpdate: (jobId: string, updates: Partial<Job>) => Promise<void>;
}

export function JobDetailDrawer({ job, isOpen, onClose, onJobUpdate }: JobDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrintTicket, setShowPrintTicket] = useState(false);

  if (!job) return null;

  const handlePrintJob = () => {
    // Create a comprehensive print-friendly job sheet
    const printWindow = window.open('', '_blank');
    if (printWindow && job) {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Job ${job.jobCode} - Production Sheet</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.4;
              color: #333;
              font-size: 12px;
            }
            .header {
              border-bottom: 3px solid #4F46E5;
              padding-bottom: 15px;
              margin-bottom: 20px;
              text-align: center;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #4F46E5;
              margin-bottom: 5px;
            }
            .job-title {
              font-size: 18px;
              color: #666;
            }
            .barcode {
              font-family: 'Courier New', monospace;
              font-size: 32px;
              text-align: center;
              margin: 15px 0;
              padding: 10px;
              border: 3px solid #333;
              background: #f9f9f9;
            }
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #4F46E5;
              border-bottom: 2px solid #4F46E5;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .info-item {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              min-width: 140px;
              color: #555;
            }
            .info-value {
              color: #333;
            }
            .badge {
              display: inline-block;
              padding: 4px 10px;
              background: #f0f0f0;
              border-radius: 4px;
              font-size: 11px;
              margin: 2px 4px 2px 0;
              border: 1px solid #ddd;
            }
            .rush {
              background: #ff6b6b;
              color: white;
              border-color: #ff5252;
              animation: pulse 1s infinite;
            }
            .photo {
              background: #9c27b0;
              color: white;
              border-color: #8e24aa;
            }
            .location {
              border: 2px solid #ddd;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 8px;
              background: #f9f9f9;
            }
            .location-title {
              font-weight: bold;
              font-size: 14px;
              color: #4F46E5;
              margin-bottom: 10px;
            }
            .color-swatch {
              display: inline-block;
              width: 20px;
              height: 20px;
              border: 2px solid #333;
              margin-right: 5px;
              vertical-align: middle;
            }
            .checklist {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .checklist-item {
              display: flex;
              align-items: center;
              padding: 8px;
              border: 1px solid #ddd;
              margin-bottom: 5px;
            }
            .checkbox {
              width: 20px;
              height: 20px;
              border: 2px solid #333;
              margin-right: 10px;
              display: inline-block;
            }
            .signature-line {
              border-bottom: 1px solid #333;
              min-height: 30px;
              margin: 10px 0;
              display: flex;
              align-items: end;
              padding-bottom: 5px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              font-size: 10px;
              color: #666;
              text-align: center;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            @media print {
              .no-print { display: none; }
              body { margin: 0; font-size: 11px; }
              .section { margin-bottom: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">✨ PrintMaster Pro ✨</div>
            <div class="job-title">PRODUCTION JOB SHEET</div>
          </div>
          
          <div class="barcode">||||| ${job.jobCode} |||||</div>
          
          <div class="section">
            <div class="section-title">📄 JOB INFORMATION</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Client:</span>
                <span class="info-value">${job.client.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Job Code:</span>
                <span class="info-value">${job.jobCode}</span>
              </div>
              <div class="info-item">
                <span class="info-label">OE Number:</span>
                <span class="info-value">${job.oeNumber}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">${job.status.replace('_', ' ')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">CSR:</span>
                <span class="info-value">${job.csr.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Ship Date:</span>
                <span class="info-value">${formatDate(job.shipDate)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Product:</span>
                <span class="info-value">${job.productId}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Quantity:</span>
                <span class="info-value">${job.qtyTotal.toLocaleString()} pieces</span>
              </div>
              <div class="info-item">
                <span class="info-label">Courier:</span>
                <span class="info-value">${job.courier || 'TBD'}</span>
              </div>
            </div>
            
            <div style="margin-top: 15px;">
              ${job.rush24hr ? '<span class="badge rush">🚀 RUSH 24hr - PRIORITY</span>' : ''}
              ${job.needPhoto ? '<span class="badge photo">📸 Photo Required</span>' : ''}
              ${job.prePro ? '<span class="badge">Pre-Production</span>' : ''}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">🎨 PRINT SPECIFICATIONS</div>
            ${job.locations.map((location: any, index: number) => `
              <div class="location">
                <div class="location-title">Location ${index + 1}: ${location.name}</div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Dimensions:</span>
                    <span class="info-value">${location.widthIn || 'N/A'}" W x ${location.heightIn || 'N/A'}" H</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Colors:</span>
                    <span class="info-value">${location.colors || 'N/A'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">PMS Colors:</span>
                    <span class="info-value">${location.pms ? location.pms.join(', ') : 'N/A'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Underbase:</span>
                    <span class="info-value">${location.underbase ? 'Yes' : 'No'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Halftone LPI:</span>
                    <span class="info-value">${location.halftoneLpi || 'N/A'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Placement:</span>
                    <span class="info-value">${location.placementNote || 'Standard'}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          ${job.notes ? `
          <div class="section">
            <div class="section-title">📝 SPECIAL NOTES</div>
            <div style="padding: 15px; background: #f9f9f9; border-left: 4px solid #4F46E5; font-style: italic;">
              ${job.notes}
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <div class="section-title">✅ PRODUCTION CHECKLIST</div>
            <div class="checklist">
              <div class="checklist-item">
                <span class="checkbox"></span>
                <span>📄 Vellum/Artwork Checked</span>
                <div class="signature-line" style="margin-left: auto; width: 100px;">_____________</div>
              </div>
              <div class="checklist-item">
                <span class="checkbox"></span>
                <span>🕸️ Screen Prepared & Tensioned</span>
                <div class="signature-line" style="margin-left: auto; width: 100px;">_____________</div>
              </div>
              <div class="checklist-item">
                <span class="checkbox"></span>
                <span>👕 Product/Garment Ready</span>
                <div class="signature-line" style="margin-left: auto; width: 100px;">_____________</div>
              </div>
              <div class="checklist-item">
                <span class="checkbox"></span>
                <span>🎨 Colors Mixed & Matched</span>
                <div class="signature-line" style="margin-left: auto; width: 100px;">_____________</div>
              </div>
              <div class="checklist-item">
                <span class="checkbox"></span>
                <span>🔍 Print Quality Approved</span>
                <div class="signature-line" style="margin-left: auto; width: 100px;">_____________</div>
              </div>
              <div class="checklist-item">
                <span class="checkbox"></span>
                <span>📍 Print Location Confirmed</span>
                <div class="signature-line" style="margin-left: auto; width: 100px;">_____________</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">✍️ SIGNATURES & APPROVALS</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px;">
              <div>
                <strong>CSR Approval:</strong>
                <div class="signature-line">_______________________</div>
                <div style="font-size: 10px; color: #666;">Signature & Date</div>
              </div>
              <div>
                <strong>Printer Approval:</strong>
                <div class="signature-line">_______________________</div>
                <div style="font-size: 10px; color: #666;">Signature & Date</div>
              </div>
              <div>
                <strong>Quality Control:</strong>
                <div class="signature-line">_______________________</div>
                <div style="font-size: 10px; color: #666;">Signature & Date</div>
              </div>
              <div>
                <strong>Final Approval:</strong>
                <div class="signature-line">_______________________</div>
                <div style="font-size: 10px; color: #666;">Signature & Date</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div>Generated: ${new Date().toLocaleString()} | System: PrintMaster Pro | Job Sheet v1.0</div>
            <div style="margin-top: 5px; font-weight: bold;">🔒 This document contains confidential production information</div>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const handleChecklistUpdate = async (field: string, value: boolean) => {
    await onJobUpdate(job.id, { [field]: value });
  };

  const handleInitialUpdate = async (field: string, value: string) => {
    await onJobUpdate(job.id, { [field]: value });
  };

  const latestQC = job.qcRecords?.[0];
  const approvedProof = job.proofs?.find(p => p.status === 'APPROVED');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">{job.client.name}</span>
                <div className="text-sm text-gray-500 mt-1">
                  {job.oeNumber} • {job.jobCode} • CSR: {job.csr.name}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {job.rush24hr && (
                  <Badge variant="destructive" className="animate-pulse">
                    RUSH 24hr
                  </Badge>
                )}
                {job.needPhoto && (
                  <Badge variant="info">
                    <Camera className="h-3 w-3 mr-1" />
                    Photo Required
                  </Badge>
                )}
                <Badge variant="outline">{job.status.replace('_', ' ')}</Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="proofs">Proofs</TabsTrigger>
              <TabsTrigger value="printing">Printing Specs</TabsTrigger>
              <TabsTrigger value="screens">Screens & Inks</TabsTrigger>
              <TabsTrigger value="sizes">Size Breakdown</TabsTrigger>
              <TabsTrigger value="qc">QC & Packing</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <div className="mt-6 max-h-96 overflow-y-auto">
              <TabsContent value="overview" className="space-y-6">
                {/* Job Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Client Name</Label>
                          <div className="text-sm font-medium">{job.client.name}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">OE#</Label>
                          <div className="text-sm font-medium">{job.oeNumber}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Job ID</Label>
                          <div className="text-sm font-medium">{job.jobCode}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">CSR Rep</Label>
                          <div className="text-sm font-medium">{job.csr.name}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Ship Date</Label>
                          <div className="text-sm font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(job.shipDate)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Courier</Label>
                          <div className="text-sm font-medium flex items-center">
                            <Truck className="h-4 w-4 mr-2" />
                            {job.courier || 'Not set'}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Product</Label>
                          <div className="text-sm font-medium">{job.qtyTotal}x {job.productId}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Status</Label>
                          <Badge variant="outline">{job.status.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Request Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Request Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={job.rush24hr}
                          onChange={(e) => onJobUpdate(job.id, { rush24hr: e.target.checked })}
                        />
                        <span className="text-sm">24hr Turnaround</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={job.prePro}
                          onChange={(e) => onJobUpdate(job.id, { prePro: e.target.checked })}
                        />
                        <span className="text-sm">Pre-Pro</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={job.needPhoto}
                          onChange={(e) => onJobUpdate(job.id, { needPhoto: e.target.checked })}
                        />
                        <span className="text-sm">Need Photo</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Production Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle>Production Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Pre-Production</h4>
                        <div className="space-y-2">
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Vellum</span>
                            <input 
                              type="checkbox" 
                              checked={job.vellum}
                              onChange={(e) => handleChecklistUpdate('vellum', e.target.checked)}
                            />
                          </label>
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Screen</span>
                            <input 
                              type="checkbox" 
                              checked={job.screen}
                              onChange={(e) => handleChecklistUpdate('screen', e.target.checked)}
                            />
                          </label>
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Product</span>
                            <input 
                              type="checkbox" 
                              checked={job.product}
                              onChange={(e) => handleChecklistUpdate('product', e.target.checked)}
                            />
                          </label>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Quality Checks</h4>
                        <div className="space-y-2">
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Style</span>
                            <input 
                              type="checkbox" 
                              checked={job.style}
                              onChange={(e) => handleChecklistUpdate('style', e.target.checked)}
                            />
                          </label>
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Colour</span>
                            <input 
                              type="checkbox" 
                              checked={job.colour}
                              onChange={(e) => handleChecklistUpdate('colour', e.target.checked)}
                            />
                          </label>
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Pantone Match</span>
                            <input 
                              type="checkbox" 
                              checked={job.pantoneMatch}
                              onChange={(e) => handleChecklistUpdate('pantoneMatch', e.target.checked)}
                            />
                          </label>
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Print Quality</span>
                            <input 
                              type="checkbox" 
                              checked={job.printQuality}
                              onChange={(e) => handleChecklistUpdate('printQuality', e.target.checked)}
                            />
                          </label>
                          <label className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Print Location</span>
                            <input 
                              type="checkbox" 
                              checked={job.printLocation}
                              onChange={(e) => handleChecklistUpdate('printLocation', e.target.checked)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Initials Section */}
                    <div className="mt-6 grid grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">CSR Initial</Label>
                        <Input 
                          value={job.csrInitial || ''}
                          onChange={(e) => handleInitialUpdate('csrInitial', e.target.value)}
                          className="text-center h-8"
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Printer Initial</Label>
                        <Input 
                          value={job.printerInitial || ''}
                          onChange={(e) => handleInitialUpdate('printerInitial', e.target.value)}
                          className="text-center h-8"
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Approval Initial</Label>
                        <Input 
                          value={job.approvalInitial || ''}
                          onChange={(e) => handleInitialUpdate('approvalInitial', e.target.value)}
                          className="text-center h-8"
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">QC Initial</Label>
                        <Input 
                          value={job.qcInitial || ''}
                          onChange={(e) => handleInitialUpdate('qcInitial', e.target.value)}
                          className="text-center h-8"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={job.notes || ''}
                      onChange={(e) => onJobUpdate(job.id, { notes: e.target.value })}
                      placeholder="Add job notes..."
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="proofs" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Artwork & Proofs</h3>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Proof
                  </Button>
                </div>
                
                {job.proofs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {job.proofs.map((proof) => (
                      <Card key={proof.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <FileImage className="h-8 w-8 text-blue-500" />
                              <div>
                                <div className="font-medium">Version {proof.version}</div>
                                <div className="text-sm text-gray-500">{proof.fileUrl}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={
                                  proof.status === 'APPROVED' ? 'success' : 
                                  proof.status === 'PENDING' ? 'warning' : 'info'
                                }
                              >
                                {proof.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {proof.approvedAt && (
                            <div className="mt-2 text-sm text-green-600">
                              Approved by {proof.approvedBy} on {formatDate(proof.approvedAt)}
                            </div>
                          )}
                          {proof.notes && (
                            <div className="mt-2 text-sm text-gray-600">{proof.notes}</div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div>No proofs uploaded yet</div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="printing" className="space-y-4">
                <h3 className="text-lg font-semibold">Printing Specifications</h3>
                {job.locations.map((location, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{location.name} Print</span>
                        <Badge variant="outline">{location.colors} Color{location.colors > 1 ? 's' : ''}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Dimensions</Label>
                          <div className="text-sm">{location.widthIn}" W × {location.heightIn}" H</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Placement</Label>
                          <div className="text-sm">{location.placementNote || 'Standard placement'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">PMS Colors</Label>
                          <div className="flex items-center space-x-2">
                            {location.pms.map((pms, pmsIndex) => (
                              <div key={pmsIndex} className="flex items-center space-x-1">
                                <div 
                                  className="w-4 h-4 rounded border border-gray-300"
                                  style={{ backgroundColor: hexFromPMS(pms) }}
                                  title={pms}
                                />
                                <span className="text-sm">{pms}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Special Instructions</Label>
                          <div className="text-sm">
                            {location.underbase && 'Underbase required'}
                            {location.halftoneLpi && `, ${location.halftoneLpi} LPI`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="screens" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Screens</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {job.screens && job.screens.length > 0 ? (
                        <div className="space-y-2">
                          {job.screens.map((screen, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center space-x-4">
                                <div className="font-medium">{screen.screenId}</div>
                                <div className="text-sm text-gray-600">{screen.mesh} mesh</div>
                                {screen.tensionN && <div className="text-sm text-gray-600">{screen.tensionN}N tension</div>}
                              </div>
                              <Badge variant={screen.reclaimStatus === 'READY' ? 'success' : 'warning'}>
                                {screen.reclaimStatus || 'Unknown'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">No screens assigned</div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Inks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {job.inks && job.inks.length > 0 ? (
                        <div className="space-y-2">
                          {job.inks.map((ink, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center space-x-4">
                                <div 
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{ backgroundColor: hexFromPMS(ink.pms || ink.name) }}
                                />
                                <div>
                                  <div className="font-medium">{ink.name}</div>
                                  <div className="text-sm text-gray-600">{ink.type}</div>
                                </div>
                              </div>
                              <div className="text-right text-sm text-gray-600">
                                {ink.flashTempF && <div>Flash: {ink.flashTempF}°F</div>}
                                {ink.cureTempF && <div>Cure: {ink.cureTempF}°F</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">No inks assigned</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sizes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Size Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {job.sizeBreakdown ? Object.entries(job.sizeBreakdown).map(([size, qty]) => (
                        <div key={size} className="flex items-center justify-between p-3 border rounded">
                          <div className="font-medium">{size}</div>
                          <div className="text-sm font-medium">{qty} pcs</div>
                        </div>
                      )) : (
                        <div className="col-span-2 text-center text-gray-500 py-4">
                          No size breakdown available
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-right">
                      <div className="text-lg font-semibold">
                        Total: {job.qtyTotal} pieces
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qc" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Quality Control & Packing</h3>
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Log QC
                  </Button>
                </div>

                {job.qcRecords && job.qcRecords.length > 0 ? (
                  <div className="space-y-4">
                    {job.qcRecords.map((qc) => (
                      <Card key={qc.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {qc.passed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="font-medium">
                                QC {qc.passed ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(qc.createdAt)}
                            </div>
                          </div>
                          
                          {qc.exitTempF && (
                            <div className="text-sm mb-2">Exit Temperature: {qc.exitTempF}°F</div>
                          )}
                          
                          {qc.defects > 0 && (
                            <div className="text-sm mb-2">Defects: {qc.defects}</div>
                          )}
                          
                          {qc.reasons && qc.reasons.length > 0 && (
                            <div className="text-sm text-gray-600">
                              Issues: {qc.reasons.join(', ')}
                            </div>
                          )}
                          
                          {qc.photoUrl && (
                            <div className="mt-2">
                              <img src={qc.photoUrl} alt="QC Photo" className="w-32 h-32 object-cover rounded" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div>No QC records yet</div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <h3 className="text-lg font-semibold">Activity Log</h3>
                <div className="space-y-2">
                  {job.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.action.replace('_', ' ')}</div>
                        <div className="text-sm text-gray-500">
                          by {activity.user.name} • {formatDate(activity.createdAt)}
                        </div>
                        {activity.meta && (
                          <div className="text-sm text-gray-600 mt-1">
                            {JSON.stringify(activity.meta, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handlePrintJob}
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Job Sheet
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Print barcode labels
                  const labelWindow = window.open('', '_blank');
                  if (labelWindow && job) {
                    const labelContent = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>Job Labels - ${job.jobCode}</title>
                        <style>
                          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                          .label { 
                            width: 4in; 
                            height: 2in; 
                            border: 3px solid #000; 
                            margin: 10px; 
                            padding: 15px;
                            display: inline-block;
                            page-break-inside: avoid;
                            background: white;
                          }
                          .barcode { 
                            font-family: 'Courier New', monospace; 
                            font-size: 24px; 
                            text-align: center;
                            margin: 8px 0;
                            font-weight: bold;
                          }
                          .info { 
                            font-size: 14px; 
                            font-weight: bold; 
                            margin: 4px 0;
                          }
                          .client { font-size: 16px; color: #4F46E5; }
                          @media print { 
                            body { margin: 0; } 
                            .label { margin: 5px; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="label">
                          <div class="client">${job.client.name}</div>
                          <div class="barcode">||||| ${job.jobCode} |||||</div>
                          <div class="info">Ship: ${formatDate(job.shipDate)}</div>
                          <div class="info">Qty: ${job.qtyTotal} | ${job.productId}</div>
                          ${job.rush24hr ? '<div class="info" style="color: red;">🚀 RUSH 24hr</div>' : ''}
                        </div>
                        <div class="label">
                          <div class="client">${job.client.name}</div>
                          <div class="barcode">||||| ${job.jobCode} |||||</div>
                          <div class="info">Ship: ${formatDate(job.shipDate)}</div>
                          <div class="info">Qty: ${job.qtyTotal} | ${job.productId}</div>
                          ${job.rush24hr ? '<div class="info" style="color: red;">🚀 RUSH 24hr</div>' : ''}
                        </div>
                      </body>
                      </html>
                    `;
                    labelWindow.document.write(labelContent);
                    labelWindow.document.close();
                    labelWindow.focus();
                    setTimeout(() => labelWindow.print(), 500);
                  }
                }}
                className="hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <Tag className="h-4 w-4 mr-2" />
                Print Labels
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Simulate photo capture - in production would use camera API
                  alert('📸 Photo capture feature would open camera interface in production app');
                }}
                className="hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                Mark Ready
              </Button>
              <Button>
                Start Setup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Ticket Modal */}
      {showPrintTicket && (
        <Dialog open={showPrintTicket} onOpenChange={setShowPrintTicket}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Print Production Ticket</DialogTitle>
            </DialogHeader>
            <PrintTicket 
              job={job} 
              onPrint={() => setShowPrintTicket(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}