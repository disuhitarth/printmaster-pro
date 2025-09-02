'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ChevronUp, 
  ChevronDown, 
  Search,
  Eye,
  Filter,
  Calendar,
  User,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

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
}

interface SmartTableViewProps {
  jobs: Job[];
  onViewJobDetails: (jobId: string) => void;
  onJobUpdate: (jobId: string, updates: any) => void;
}

type SortField = keyof Job | 'client.name' | 'csr.name';
type SortDirection = 'asc' | 'desc';

const STATUS_CONFIG = {
  NEW: { label: 'New', color: 'bg-gray-500', textColor: 'text-gray-700' },
  WAITING_ARTWORK: { label: 'Waiting Artwork', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  READY_FOR_PRESS: { label: 'Ready for Press', color: 'bg-blue-500', textColor: 'text-blue-700' },
  IN_PRESS: { label: 'In Press', color: 'bg-indigo-500', textColor: 'text-indigo-700' },
  QC: { label: 'QC', color: 'bg-purple-500', textColor: 'text-purple-700' },
  PACKED: { label: 'Packed', color: 'bg-green-500', textColor: 'text-green-700' },
  SHIPPED: { label: 'Shipped', color: 'bg-emerald-500', textColor: 'text-emerald-700' },
  HOLD: { label: 'Hold/Exception', color: 'bg-red-500', textColor: 'text-red-700' },
};

export function SmartTableView({ jobs, onViewJobDetails, onJobUpdate }: SmartTableViewProps) {
  const [sortField, setSortField] = useState<SortField>('shipDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter and sort jobs
  const processedJobs = useMemo(() => {
    let filtered = jobs;

    // Apply table search
    if (tableSearch) {
      filtered = filtered.filter(job =>
        job.jobCode.toLowerCase().includes(tableSearch.toLowerCase()) ||
        job.oeNumber.toLowerCase().includes(tableSearch.toLowerCase()) ||
        job.client.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        job.productId.toLowerCase().includes(tableSearch.toLowerCase()) ||
        job.csr.name.toLowerCase().includes(tableSearch.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField === 'client.name') {
        aValue = a.client.name;
        bValue = b.client.name;
      } else if (sortField === 'csr.name') {
        aValue = a.csr.name;
        bValue = b.csr.name;
      } else {
        aValue = a[sortField as keyof Job];
        bValue = b[sortField as keyof Job];
      }

      // Handle dates
      if (sortField === 'shipDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [jobs, tableSearch, selectedStatus, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />; // Placeholder for alignment
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (shipDate: Date | string) => {
    return new Date(shipDate) < new Date();
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(jobs.map(job => job.status))];
    return statuses.filter(status => STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
      {/* Table Header with Controls */}
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Jobs Table View</h3>
            <p className="text-sm text-slate-600 mt-1">
              Showing {processedJobs.length} of {jobs.length} jobs
            </p>
          </div>
          
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search jobs..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-10 w-64 bg-white border-slate-200"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                {getUniqueStatuses().map(status => (
                  <option key={status} value={status}>
                    {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/80 border-b border-slate-200/60">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors"
                onClick={() => handleSort('jobCode')}
              >
                <div className="flex items-center gap-2">
                  Job Code
                  <SortIcon field="jobCode" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors"
                onClick={() => handleSort('client.name')}
              >
                <div className="flex items-center gap-2">
                  Client
                  <SortIcon field="client.name" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors"
                onClick={() => handleSort('shipDate')}
              >
                <div className="flex items-center gap-2">
                  Ship Date
                  <SortIcon field="shipDate" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors"
                onClick={() => handleSort('qtyTotal')}
              >
                <div className="flex items-center gap-2">
                  Quantity
                  <SortIcon field="qtyTotal" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100/80 transition-colors"
                onClick={() => handleSort('csr.name')}
              >
                <div className="flex items-center gap-2">
                  CSR
                  <SortIcon field="csr.name" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Flags
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200/60">
            {processedJobs.map((job, index) => (
              <tr 
                key={job.id} 
                className={`hover:bg-slate-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{job.jobCode}</div>
                    <div className="text-xs text-slate-500">{job.oeNumber}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{job.client.name}</div>
                  <div className="text-xs text-slate-500">{job.productId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    className={`${STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]?.color} text-white font-medium px-3 py-1 text-xs`}
                  >
                    {STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]?.label || job.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium flex items-center gap-2 ${
                    isOverdue(job.shipDate) ? 'text-red-600' : 'text-slate-900'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    {formatDate(job.shipDate)}
                    {isOverdue(job.shipDate) && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Package className="h-4 w-4 text-slate-400" />
                    {job.qtyTotal.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-slate-900">
                    <User className="h-4 w-4 text-slate-400" />
                    {job.csr.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1">
                    {job.rush24hr && (
                      <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1 font-semibold">
                        <Clock className="h-3 w-3 mr-1" />
                        RUSH
                      </Badge>
                    )}
                    {job.prePro && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1 font-semibold">
                        PP
                      </Badge>
                    )}
                    {job.needPhoto && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-1 font-semibold">
                        📷
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    onClick={() => onViewJobDetails(job.id)}
                    size="sm"
                    variant="ghost"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {processedJobs.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
          <p className="text-slate-600">
            {tableSearch || selectedStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No jobs available to display'
            }
          </p>
        </div>
      )}
    </div>
  );
}