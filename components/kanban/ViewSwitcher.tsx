'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Columns, Table, LayoutGrid } from 'lucide-react';

export type ViewMode = 'kanban' | 'table';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  jobCount?: number;
  className?: string;
}

export function ViewSwitcher({ currentView, onViewChange, jobCount, className = '' }: ViewSwitcherProps) {
  return (
    <div 
      className={`flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-1 shadow-sm ${className}`}
      title="Switch views (Ctrl/Cmd + Shift + V)"
    >
      <Button
        onClick={() => onViewChange('kanban')}
        size="sm"
        variant={currentView === 'kanban' ? 'default' : 'ghost'}
        className={`h-9 px-4 font-medium transition-all duration-200 ${
          currentView === 'kanban'
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Kanban board view"
      >
        <Columns className="h-4 w-4 mr-2" />
        Kanban
        {currentView === 'kanban' && jobCount !== undefined && (
          <Badge className="ml-2 bg-white/20 text-white border-white/30 text-xs">
            {jobCount}
          </Badge>
        )}
      </Button>
      
      <Button
        onClick={() => onViewChange('table')}
        size="sm"
        variant={currentView === 'table' ? 'default' : 'ghost'}
        className={`h-9 px-4 font-medium transition-all duration-200 ${
          currentView === 'table'
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Smart table view"
      >
        <Table className="h-4 w-4 mr-2" />
        Table
        {currentView === 'table' && jobCount !== undefined && (
          <Badge className="ml-2 bg-white/20 text-white border-white/30 text-xs">
            {jobCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}