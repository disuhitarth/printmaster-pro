'use client';

import { Badge } from '@/components/ui/badge';

interface ColumnHeaderProps {
  title: string;
  count: number;
  color: string;
}

export function ColumnHeader({ title, count, color }: ColumnHeaderProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'gray':
        return 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg';
      case 'yellow':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg';
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg';
      case 'indigo':
        return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg';
      case 'purple':
        return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg';
      case 'green':
        return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg';
      case 'red':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg';
    }
  };

  const getHeaderBackground = (color: string) => {
    switch (color) {
      case 'gray':
        return 'bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-sm border-b border-slate-200/60';
      case 'yellow':
        return 'bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border-b border-amber-200/60';
      case 'blue':
        return 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-b border-blue-200/60';
      case 'indigo':
        return 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-b border-indigo-200/60';
      case 'purple':
        return 'bg-gradient-to-r from-purple-50/80 to-violet-50/80 backdrop-blur-sm border-b border-purple-200/60';
      case 'green':
        return 'bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm border-b border-emerald-200/60';
      case 'red':
        return 'bg-gradient-to-r from-red-50/80 to-rose-50/80 backdrop-blur-sm border-b border-red-200/60';
      default:
        return 'bg-gradient-to-r from-slate-50/80 to-gray-50/80 backdrop-blur-sm border-b border-slate-200/60';
    }
  };

  return (
    <div className={`p-3 ${getHeaderBackground(color)} sticky top-0 z-20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
            {title}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`text-sm font-bold px-4 py-2 rounded-full ${getColorClasses(color)} shadow-lg hover:scale-110 transition-transform duration-200`}>
            {count}
          </Badge>
        </div>
      </div>
    </div>
  );
}