'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { JobCard } from './JobCard';
import { ColumnHeader } from './ColumnHeader';
import { Card } from '@/components/ui/card';
import { useViewport } from '@/hooks/useViewport';
// import { useToast } from '@/components/ui/use-toast';

const COLUMNS = [
  { id: 'NEW', title: 'New', color: 'gray' },
  { id: 'WAITING_ARTWORK', title: 'Waiting Artwork', color: 'yellow' },
  { id: 'READY_FOR_PRESS', title: 'Ready for Press', color: 'blue' },
  { id: 'IN_PRESS', title: 'In Press', color: 'indigo' },
  { id: 'QC', title: 'QC', color: 'purple' },
  { id: 'PACKED', title: 'Packed', color: 'green' },
  { id: 'SHIPPED', title: 'Shipped', color: 'green' },
  { id: 'HOLD', title: 'Hold/Exception', color: 'red' },
];

interface Job {
  id: string;
  jobCode: string;
  oeNumber: string;
  status: string;
  client: { name: string };
  shipDate: Date | string;
  rush24hr: boolean;
  needPhoto: boolean;
  productId: string;
  qtyTotal: number;
  courier?: string;
  locations: Array<{
    name: string;
    pms: string[];
  }>;
  proofs: Array<{
    status: string;
  }>;
  csr: { name: string };
}

interface KanbanBoardProps {
  jobs: Job[];
  onJobUpdate: (jobId: string, updates: Partial<Job>) => Promise<void>;
  onViewJobDetails: (jobId: string) => void;
}

// Droppable Column Component
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`h-full transition-all duration-200 ${
        isOver ? 'ring-2 ring-indigo-400 ring-opacity-50 bg-indigo-50/30' : ''
      }`}
    >
      {children}
    </div>
  );
}

export function KanbanBoard({ jobs, onJobUpdate, onViewJobDetails }: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isClient, setIsClient] = useState(false);
  const viewport = useViewport();
  // const { toast } = useToast();

  // Prevent hydration mismatch by only enabling DnD on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Increased distance to prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Increased delay to prevent accidental touch drags
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Group jobs by status
  const jobsByStatus = useMemo(() => {
    const grouped: { [key: string]: Job[] } = {};
    COLUMNS.forEach(col => {
      grouped[col.id] = jobs.filter(job => job.status === col.id);
      // Sort by rush first, then by ship date
      grouped[col.id].sort((a, b) => {
        if (a.rush24hr !== b.rush24hr) {
          return a.rush24hr ? -1 : 1;
        }
        return new Date(a.shipDate).getTime() - new Date(b.shipDate).getTime();
      });
    });
    return grouped;
  }, [jobs]);

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find(j => j.id === event.active.id);
    if (job) {
      setActiveJob(job);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) {
      // Job was dropped outside any droppable area - do nothing, don't delete
      return;
    }

    const jobId = active.id as string;
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      return;
    }

    // Determine if dropped on a column or another job
    let newStatus = over.id as string;
    
    // If dropped on another job, get the status of that job's column
    const targetJob = jobs.find(j => j.id === over.id);
    if (targetJob) {
      newStatus = targetJob.status;
    }
    
    // Check if dropped on a valid column
    const targetColumn = COLUMNS.find(col => col.id === newStatus);
    if (!targetColumn) {
      return;
    }

    if (job.status === newStatus) {
      // Same column - do nothing
      return;
    }

    // Business rule checks
    try {
      await validateStatusChange(job, newStatus);
      await onJobUpdate(jobId, { status: newStatus });
      
      console.log(`Job ${job.jobCode} moved to ${COLUMNS.find(c => c.id === newStatus)?.title}`);
    } catch (error: any) {
      console.error('Move blocked:', error.message);
      alert(`Move blocked: ${error.message}`);
    }
  };

  const validateStatusChange = async (job: Job, newStatus: string) => {
    // Rule: Ready for Press → In Press requires approved proof
    if (job.status === 'READY_FOR_PRESS' && newStatus === 'IN_PRESS') {
      const hasApprovedProof = job.proofs?.some(proof => proof.status === 'APPROVED');
      if (!hasApprovedProof) {
        const reason = prompt('This job does not have an approved proof. Admin override required. Enter reason:');
        if (!reason) {
          throw new Error('Proof approval required before starting press.');
        }
        // Log admin override (in production, would log to activity)
        console.log(`Admin override: ${reason} for job ${job.jobCode}`);
      }
    }

    // Rule: Need Photo blocks shipment
    if (job.needPhoto && (newStatus === 'SHIPPED' || (job.status === 'PACKED' && newStatus === 'SHIPPED'))) {
      const hasPhoto = job.proofs?.some(proof => proof.status === 'APPROVED'); // Simplified - in production check for photo
      if (!hasPhoto) {
        throw new Error('Photo required before shipping. Please attach photo in QC tab.');
      }
    }

    // Rule: Rush jobs capacity warning
    if (job.rush24hr && newStatus === 'IN_PRESS') {
      const rushJobsInPress = jobs.filter(j => j.rush24hr && j.status === 'IN_PRESS').length;
      if (rushJobsInPress >= 3) { // Example threshold
        const proceed = confirm('Capacity warning: Multiple rush jobs in press. Continue?');
        if (!proceed) {
          throw new Error('Capacity limit reached for rush jobs.');
        }
      }
    }
  };

  const columnWidth = Math.max(280, (viewport.width - 64) / COLUMNS.length);
  const boardMinWidth = Math.max(2240, viewport.width - 16);

  return (
    <div className="overflow-x-auto min-h-screen w-full">
      {isClient ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
        <div className="flex space-x-2 pb-4 px-2" style={{ minWidth: `${boardMinWidth}px` }}>
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-1" style={{ minWidth: `${columnWidth}px` }}>
              <DroppableColumn id={column.id}>
                <Card className="glass-effect rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                  <ColumnHeader
                    title={column.title}
                    count={jobsByStatus[column.id]?.length || 0}
                    color={column.color}
                  />
                  <SortableContext
                    items={jobsByStatus[column.id]?.map(job => job.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      className="p-2 space-y-2 min-h-96"
                      data-column-id={column.id}
                    >
                    {jobsByStatus[column.id]?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm font-medium">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 shadow-inner">
                          <div className="text-2xl opacity-60">📋</div>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="font-semibold text-slate-600">Drop jobs here</div>
                          <div className="text-xs text-slate-500">Drag & drop to move jobs</div>
                        </div>
                      </div>
                    ) : (
                      jobsByStatus[column.id]?.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onViewDetails={onViewJobDetails}
                        />
                      ))
                    )}
                    </div>
                  </SortableContext>
                </Card>
              </DroppableColumn>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeJob ? (
            <div className="transform rotate-1 scale-110 transition-all duration-300 drop-shadow-2xl">
              <JobCard job={activeJob} onViewDetails={onViewJobDetails} isDragging />
            </div>
          ) : null}
        </DragOverlay>
        </DndContext>
      ) : (
        <div className="flex space-x-2 pb-4 px-2" style={{ minWidth: `${boardMinWidth}px` }}>
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-1" style={{ minWidth: `${columnWidth}px` }}>
              <Card className="glass-effect rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                <ColumnHeader
                  title={column.title}
                  count={jobsByStatus[column.id]?.length || 0}
                  color={column.color}
                />
                <div
                  className="p-2 space-y-2 min-h-96"
                  data-column-id={column.id}
                >
                {jobsByStatus[column.id]?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm font-medium">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 shadow-inner">
                      <div className="text-2xl opacity-60">📋</div>
                    </div>
                    <div>No jobs in {column.title.toLowerCase()}</div>
                  </div>
                ) : (
                  jobsByStatus[column.id]?.map((job) => (
                    <div key={job.id}>
                      <JobCard job={job} onViewDetails={onViewJobDetails} />
                    </div>
                  ))
                )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}