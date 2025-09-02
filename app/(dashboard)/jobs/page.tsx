'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Package, 
  Calendar, 
  User,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Eye,
  Edit,
  Filter,
  Truck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

// Mock jobs data
const mockJobs = [
  {
    id: '1',
    jobCode: 'JOB-001001',
    oeNumber: 'OE-1029',
    status: 'NEW',
    client: { name: 'Acme Corporation' },
    csr: { name: 'Sarah M.' },
    shipDate: new Date('2024-12-20'),
    rush24hr: true,
    prePro: false,
    needPhoto: false,
    productId: 'G500 Black',
    qtyTotal: 120,
    courier: 'UPS Ground',
    notes: 'Client requested exact Pantone match for brand colors. Rush order - prioritize for tomorrow morning shipment.',
    createdAt: new Date('2024-12-19T10:00:00Z'),
  },
  {
    id: '2',
    jobCode: 'JOB-001002',
    oeNumber: 'OE-1030',
    status: 'WAITING_ARTWORK',
    client: { name: 'Tech Startup Inc' },
    csr: { name: 'John D.' },
    shipDate: new Date('2024-12-23'),
    rush24hr: false,
    prePro: false,
    needPhoto: true,
    productId: 'Next Level 3600',
    qtyTotal: 250,
    courier: 'FedEx',
    notes: 'Need high-quality photo for social media marketing.',
    createdAt: new Date('2024-12-19T14:00:00Z'),
  },
  {
    id: '3',
    jobCode: 'JOB-001003',
    oeNumber: 'OE-1028',
    status: 'READY_FOR_PRESS',
    client: { name: 'Local Brewery' },
    csr: { name: 'Sarah M.' },
    shipDate: new Date('2024-12-18'),
    rush24hr: false,
    prePro: true,
    needPhoto: false,
    productId: 'Bella Canvas 3001',
    qtyTotal: 75,
    courier: 'Local Pickup',
    notes: 'Client approved final proof. Ready for production.',
    createdAt: new Date('2024-12-17T09:00:00Z'),
  },
  {
    id: '4',
    jobCode: 'JOB-001004',
    oeNumber: 'OE-1031',
    status: 'IN_PRESS',
    client: { name: 'University Bookstore' },
    csr: { name: 'Mike R.' },
    shipDate: new Date('2024-12-22'),
    rush24hr: false,
    prePro: false,
    needPhoto: false,
    productId: 'Gildan 5000',
    qtyTotal: 500,
    courier: 'UPS Ground',
    notes: 'Large volume order for orientation week.',
    createdAt: new Date('2024-12-15T13:20:00Z'),
  },
  {
    id: '5',
    jobCode: 'JOB-001005',
    oeNumber: 'OE-1024',
    status: 'QC',
    client: { name: 'Coffee Shop Chain' },
    csr: { name: 'John D.' },
    shipDate: new Date('2024-12-21'),
    rush24hr: false,
    prePro: false,
    needPhoto: false,
    productId: 'Aprons',
    qtyTotal: 300,
    courier: 'FedEx Ground',
    notes: 'Quality check in progress.',
    createdAt: new Date('2024-12-14T11:00:00Z'),
  },
  {
    id: '6',
    jobCode: 'JOB-001006',
    oeNumber: 'OE-1022',
    status: 'PACKED',
    client: { name: 'Fitness Studio' },
    csr: { name: 'Sarah M.' },
    shipDate: new Date('2024-12-19'),
    rush24hr: false,
    prePro: false,
    needPhoto: true,
    productId: 'Tank Tops',
    qtyTotal: 150,
    courier: 'UPS Next Day',
    notes: 'Photos taken and approved. Ready to ship.',
    createdAt: new Date('2024-12-12T16:30:00Z'),
  }
];

export default function JobsPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rushOnly, setRushOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and search jobs
  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.jobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.oeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.csr.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Rush filter
    if (rushOnly) {
      filtered = filtered.filter(job => job.rush24hr);
    }

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'shipDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'qtyTotal') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter, rushOnly, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'WAITING_ARTWORK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'READY_FOR_PRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PRESS': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'QC': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PACKED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED': return 'bg-green-100 text-green-800 border-green-200';
      case 'HOLD': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return <FileText className="w-4 h-4" />;
      case 'WAITING_ARTWORK': return <Clock className="w-4 h-4" />;
      case 'READY_FOR_PRESS': return <CheckCircle className="w-4 h-4" />;
      case 'IN_PRESS': return <Package className="w-4 h-4" />;
      case 'QC': return <Eye className="w-4 h-4" />;
      case 'PACKED': return <Package className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'HOLD': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj);
  };

  const isLate = (shipDate: Date | string) => {
    const today = new Date();
    const ship = typeof shipDate === 'string' ? new Date(shipDate) : shipDate;
    return ship < today;
  };

  const totalJobs = jobs.length;
  const rushJobs = jobs.filter(job => job.rush24hr).length;
  const lateJobs = jobs.filter(job => isLate(job.shipDate)).length;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Jobs Management</h1>
            <p className="text-slate-600 mt-1">Manage and track all production jobs</p>
          </div>
          
          {/* Quick Stats & Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-2 bg-indigo-50/80 backdrop-blur-sm border border-indigo-200 px-4 py-2.5 rounded-xl">
              <Package className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Total:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-indigo-500 text-white">
                {totalJobs}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 bg-orange-50/80 backdrop-blur-sm border border-orange-200 px-4 py-2.5 rounded-xl">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Rush:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-orange-500 text-white">
                {rushJobs}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 bg-red-50/80 backdrop-blur-sm border border-red-200 px-4 py-2.5 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Late:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-red-500 text-white">
                {lateJobs}
              </Badge>
            </div>
            
            <Link href="/jobs/create">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mt-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by job code, OE#, client, product, or CSR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder-slate-500 font-medium text-base"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-slate-700">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="NEW">New</option>
                  <option value="WAITING_ARTWORK">Waiting Artwork</option>
                  <option value="READY_FOR_PRESS">Ready for Press</option>
                  <option value="IN_PRESS">In Press</option>
                  <option value="QC">QC</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="HOLD">Hold</option>
                </select>
              </div>
              
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rushOnly}
                  onChange={(e) => setRushOnly(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-2 border-orange-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors duration-200">Rush Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      {job.rush24hr && <Zap className="w-4 h-4 text-orange-500" />}
                      {job.jobCode}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.replace('_', ' ')}
                      </Badge>
                      {isLate(job.shipDate) && (
                        <Badge className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                          LATE
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="hover:bg-indigo-100 hover:text-indigo-600">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-slate-100 hover:text-slate-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">OE# {job.oeNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>{job.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4 text-purple-600" />
                    <span>{job.csr.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>{job.productId}</span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Quantity</div>
                    <div className="text-lg font-bold text-slate-800">{job.qtyTotal}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Ship Date</div>
                    <div className={`text-sm font-semibold ${isLate(job.shipDate) ? 'text-red-600' : 'text-slate-800'}`}>
                      {formatDate(job.shipDate)}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {job.rush24hr && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      Rush 24hr
                    </Badge>
                  )}
                  {job.prePro && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Pre-Pro
                    </Badge>
                  )}
                  {job.needPhoto && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Need Photo
                    </Badge>
                  )}
                </div>

                {/* Courier */}
                <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-200">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>{job.courier}</span>
                </div>

                {/* Notes */}
                {job.notes && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 italic line-clamp-2">
                      {job.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No jobs found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' || rushOnly
                ? 'Try adjusting your search terms or filters'
                : 'Start by creating your first job'
              }
            </p>
            <Link href="/jobs/create">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Job
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}