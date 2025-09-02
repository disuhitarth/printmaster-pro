'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Calendar, Truck } from 'lucide-react';
import { formatDate, isLate, hexFromPMS } from '@/lib/utils';

interface Job {
  id: string;
  jobCode: string;
  oeNumber: string;
  client: { name: string };
  shipDate: Date | string;
  rush24hr: boolean;
  needPhoto: boolean;
  productId: string;
  qtyTotal: number;
  courier?: string;
  status: string;
  locations: Array<{
    name: string;
    pms: string[];
  }>;
  proofs: Array<{
    status: string;
  }>;
  csr: { name: string };
}

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
  isDragging?: boolean;
}

export function JobCard({ job, onViewDetails, isDragging: propIsDragging }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isJobLate = isLate(job.shipDate);
  const latestProof = job.proofs?.[job.proofs.length - 1];
  const allPMSColors = job.locations.flatMap(loc => loc.pms);

  const cardIsDragging = isDragging || propIsDragging;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid="job-card"
      className={`cursor-move transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${
        cardIsDragging ? 'opacity-95 shadow-2xl scale-105 z-50' : ''
      } ${isJobLate ? 'border-l-4 border-l-red-500' : ''} 
      ${job.rush24hr ? 'border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50/80 to-amber-50/60' : 'bg-white/95'}
      backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg hover:border-slate-300/80 hover:shadow-indigo-500/10`}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 truncate tracking-tight">
                {job.client.name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-slate-100/80 text-slate-500 hover:text-indigo-600 transition-all duration-200 flex-shrink-0 ml-2 hover:scale-110"
                aria-label="View details"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(job.id);
                }}
              >
                <Info className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {job.rush24hr && (
                <Badge className="text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full shadow-sm">
                  ⚡ RUSH 24hr
                </Badge>
              )}
              {isJobLate && (
                <Badge className="text-xs font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white px-2 py-1 rounded-full shadow-sm animate-pulse">
                  🚨 OVERDUE
                </Badge>
              )}
            </div>
            <div className="text-sm text-slate-600 font-semibold tracking-wide">
              {job.oeNumber} • {job.jobCode}
            </div>
          </div>
        </div>

        {/* Ship Date */}
        <div className={`flex items-center text-xs px-3 py-2 rounded-lg font-semibold border backdrop-blur-sm ${
          isJobLate 
            ? 'text-red-800 bg-red-50/80 border-red-200 shadow-sm' 
            : 'text-slate-700 bg-slate-50/80 border-slate-200 shadow-sm'
        }`}>
          <Calendar className={`h-3 w-3 mr-2 ${
            isJobLate ? 'text-red-500' : 'text-slate-500'
          }`} />
          <span className="font-bold tracking-wide">Ship:</span>
          <span className="ml-1 font-semibold">{formatDate(job.shipDate)}</span>
          {isJobLate && <span className="ml-auto text-red-600 font-bold text-xs uppercase tracking-wider animate-pulse">OVERDUE</span>}
        </div>

        {/* Product Info */}
        <div className="text-xs text-slate-700 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-sm px-3 py-2 rounded-lg font-semibold border border-indigo-100 shadow-sm">
          <span className="font-bold text-indigo-700 text-sm">{job.qtyTotal.toLocaleString()}x</span> 
          <span className="mx-1 font-semibold">{job.productId}</span> • 
          <span className="font-bold text-indigo-600">{job.locations.length} location{job.locations.length > 1 ? 's' : ''}</span>
        </div>

        {/* PMS Color Swatches */}
        {allPMSColors.length > 0 && (
          <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Colors:</span>
            <div className="flex items-center space-x-1">
              {allPMSColors.slice(0, 4).map((pms, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: hexFromPMS(pms) }}
                  title={pms}
                />
              ))}
              {allPMSColors.length > 4 && (
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-[8px] font-bold text-slate-700">+{allPMSColors.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
          <div className="flex flex-wrap items-center gap-2">
            {latestProof && (
              <Badge
                className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${
                  latestProof.status === 'APPROVED' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                    : latestProof.status === 'PENDING' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                }`}
              >
                {latestProof.status === 'APPROVED' ? '✓ Approved' : 
                 latestProof.status === 'PENDING' ? '⏳ Pending' : 
                 '👁 In Review'}
              </Badge>
            )}
            {job.needPhoto && (
              <Badge className="text-xs font-bold bg-gradient-to-r from-purple-500 to-violet-600 text-white px-2 py-1 rounded-full shadow-sm">
                📸 Photo Needed
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2 text-xs">
            {job.courier && (
              <div className="flex items-center text-slate-700 bg-slate-100/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                <Truck className="h-3 w-3 mr-1" />
                <span className="font-semibold text-xs">{job.courier}</span>
              </div>
            )}
            <div className="text-slate-700 font-semibold text-xs px-2 py-1 bg-slate-100/60 rounded-lg">
              {job.csr.name}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}