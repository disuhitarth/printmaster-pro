'use client';

import { useState, useEffect } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { SmartTableView } from '@/components/kanban/SmartTableView';
import { ViewSwitcher, ViewMode } from '@/components/kanban/ViewSwitcher';
import { JobDetailDrawer } from '@/components/kanban/JobDetailDrawer';
import { CreateJobForm } from '@/components/forms/CreateJobForm';
import { ExportButton } from '@/components/kanban/ExportButton';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data - in production this would come from API
const mockJobs = [
  {
    id: '1',
    jobCode: 'JOB-001001',
    oeNumber: 'OE-1029',
    status: 'NEW',
    client: { name: 'Acme Corp' },
    csr: { name: 'Sarah M.' },
    shipDate: new Date('2024-12-20'),
    rush24hr: true,
    prePro: false,
    needPhoto: false,
    productId: 'G500 Black',
    qtyTotal: 120,
    courier: 'UPS Ground',
    notes: 'Client requested exact Pantone match for brand colors. Rush order - prioritize for tomorrow morning shipment.',
    locations: [
      {
        name: 'Front',
        widthIn: 12,
        heightIn: 10,
        colors: 3,
        pms: ['186C', 'Black', 'Cool Gray 6C'],
        underbase: true,
        halftoneLpi: 55,
        placementNote: 'Center, 2" below collar'
      }
    ],
    proofs: [
      {
        id: 'proof-1',
        version: 1,
        status: 'PENDING',
        fileUrl: '/mockups/job-1001-v1.pdf',
        notes: 'Initial proof for approval'
      }
    ],
    screens: [
      {
        screenId: 'SCR-156-001',
        mesh: 156,
        tensionN: 25.0,
        emulsion: 'Dual Cure',
        exposureSec: 180,
        reclaimStatus: 'READY'
      }
    ],
    inks: [
      {
        name: '186C',
        pms: '186C',
        type: 'plastisol',
        flashTempF: 260,
        cureTempF: 320
      },
      {
        name: 'Black',
        pms: 'Black',
        type: 'plastisol',
        flashTempF: 240,
        cureTempF: 300
      }
    ],
    sizeBreakdown: { S: 20, M: 40, L: 40, XL: 20 },
    qcRecords: [],
    activities: [
      {
        id: 'act-1',
        action: 'JOB_CREATED',
        user: { name: 'Sarah M.' },
        createdAt: new Date('2024-12-19T10:00:00Z'),
        meta: { jobCode: 'JOB-001001' }
      }
    ],
    vellum: false,
    screen: false,
    product: false,
    style: false,
    colour: false,
    oneSide: true,
    twoSide: false,
    pantoneMatch: false,
    printQuality: false,
    printLocation: false
  },
  {
    id: '2',
    jobCode: 'JOB-001002',
    oeNumber: 'OE-1030',
    status: 'NEW',
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
    locations: [
      {
        name: 'Front',
        widthIn: 8,
        heightIn: 6,
        colors: 1,
        pms: ['306C'],
        underbase: false,
        halftoneLpi: 65,
        placementNote: 'Left chest, 4" from shoulder seam'
      }
    ],
    proofs: [],
    screens: [],
    inks: [],
    sizeBreakdown: { S: 50, M: 100, L: 75, XL: 25 },
    qcRecords: [],
    activities: [
      {
        id: 'act-2',
        action: 'JOB_CREATED',
        user: { name: 'John D.' },
        createdAt: new Date('2024-12-19T14:00:00Z'),
        meta: { jobCode: 'JOB-001002' }
      }
    ],
    vellum: false,
    screen: false,
    product: false,
    style: false,
    colour: false,
    oneSide: true,
    twoSide: false,
    pantoneMatch: false,
    printQuality: false,
    printLocation: false
  },
  {
    id: '3',
    jobCode: 'JOB-001003',
    oeNumber: 'OE-1028',
    status: 'NEW',
    client: { name: 'Local Brewery' },
    csr: { name: 'Sarah M.' },
    shipDate: new Date('2024-12-18'), // Late
    rush24hr: false,
    needPhoto: false,
    productId: 'Bella Canvas 3001',
    qtyTotal: 75,
    locations: [
      {
        name: 'Front',
        pms: ['Black', 'White']
      }
    ],
    proofs: [{ status: 'APPROVED' }],
    sizeBreakdown: { S: 15, M: 25, L: 25, XL: 10 },
    screens: [],
    inks: [],
    qcRecords: [],
    activities: [],
    vellum: false,
    screen: false,
    product: false,
    style: false,
    colour: false,
    oneSide: true,
    twoSide: false,
    pantoneMatch: false,
    printQuality: false,
    printLocation: false
  },
  {
    id: '4',
    jobCode: 'JOB-001004',
    oeNumber: 'OE-1031',
    status: 'WAITING_ARTWORK',
    client: { name: 'Fitness Studio' },
    csr: { name: 'John D.' },
    shipDate: new Date('2024-12-27'),
    rush24hr: false,
    needPhoto: false,
    productId: 'Tank Tops',
    qtyTotal: 50,
    locations: [
      {
        name: 'Front',
        pms: ['Black', 'White', 'Red', 'Blue']
      }
    ],
    proofs: [],
    sizeBreakdown: { S: 10, M: 20, L: 15, XL: 5 },
    screens: [],
    inks: [],
    qcRecords: [],
    activities: [],
    vellum: false,
    screen: false,
    product: false,
    style: false,
    colour: false,
    oneSide: true,
    twoSide: false,
    pantoneMatch: false,
    printQuality: false,
    printLocation: false
  },
  {
    id: '5',
    jobCode: 'JOB-001005',
    oeNumber: 'OE-1025',
    status: 'READY_FOR_PRESS',
    client: { name: 'University Bookstore' },
    csr: { name: 'Sarah M.' },
    shipDate: new Date('2024-12-22'),
    rush24hr: false,
    needPhoto: false,
    productId: 'Gildan 5000',
    qtyTotal: 500,
    locations: [
      {
        name: 'Front',
        pms: ['Navy', 'White']
      }
    ],
    proofs: [{ status: 'APPROVED' }],
    sizeBreakdown: { S: 100, M: 200, L: 150, XL: 50 },
    screens: [],
    inks: [],
    qcRecords: [],
    activities: [],
    vellum: false,
    screen: false,
    product: false,
    style: false,
    colour: false,
    oneSide: true,
    twoSide: false,
    pantoneMatch: false,
    printQuality: false,
    printLocation: false
  },
  {
    id: '6',
    jobCode: 'JOB-001006',
    oeNumber: 'OE-1024',
    status: 'IN_PRESS',
    client: { name: 'Coffee Shop Chain' },
    csr: { name: 'Mike R.' },
    shipDate: new Date('2024-12-21'),
    rush24hr: false,
    needPhoto: false,
    productId: 'Aprons',
    qtyTotal: 300,
    locations: [
      {
        name: 'Front',
        pms: ['Black']
      }
    ],
    proofs: [{ status: 'APPROVED' }],
    sizeBreakdown: { S: 75, M: 150, L: 75 },
    screens: [],
    inks: [],
    qcRecords: [],
    activities: [],
    vellum: false,
    screen: false,
    product: false,
    style: false,
    colour: false,
    oneSide: true,
    twoSide: false,
    pantoneMatch: false,
    printQuality: false,
    printLocation: false
  }
];

export default function KanbanPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRushOnly, setShowRushOnly] = useState(false);
  const [showNeedPhotoOnly, setShowNeedPhotoOnly] = useState(false);
  const [selectedCSR, setSelectedCSR] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('kanban-view-mode');
    if (savedViewMode && (savedViewMode === 'kanban' || savedViewMode === 'table')) {
      setViewMode(savedViewMode as ViewMode);
    }
  }, []);

  // Save view mode to localStorage when it changes
  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem('kanban-view-mode', newViewMode);
  };

  // Keyboard shortcut to toggle views (Ctrl/Cmd + Shift + V)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        const newView = viewMode === 'kanban' ? 'table' : 'kanban';
        handleViewModeChange(newView);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.oeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.productId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Rush jobs filter
    if (showRushOnly) {
      filtered = filtered.filter(job => job.rush24hr);
    }
    
    // Need photo filter
    if (showNeedPhotoOnly) {
      filtered = filtered.filter(job => job.needPhoto);
    }
    
    // CSR filter
    if (selectedCSR !== 'all') {
      filtered = filtered.filter(job => job.csr.name === selectedCSR);
    }
    
    // Date range filter (simplified)
    if (selectedDateRange !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (selectedDateRange === 'today') {
        filtered = filtered.filter(job => {
          const shipDate = new Date(job.shipDate);
          return shipDate.toDateString() === today.toDateString();
        });
      }
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, showRushOnly, showNeedPhotoOnly, selectedCSR, selectedDateRange]);

  const handleJobUpdate = async (jobId: string, updates: any) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  const handleViewJobDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsJobDetailOpen(true);
  };

  const handleCreateJob = async (jobData: any) => {
    const newJob = {
      ...jobData,
      id: (Date.now()).toString(), // Simple ID generation
    };
    setJobs(prev => [newJob, ...prev]);
    console.log('New job created:', newJob);
  };

  const selectedJob = selectedJobId ? jobs.find(job => job.id === selectedJobId) : null;

  const onTimePercentage = 94;
  const capacityPercentage = 85;

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Production {viewMode === 'kanban' ? 'Kanban' : 'Jobs Table'}
            </h1>
            <p className="text-slate-600 mt-1">
              {viewMode === 'kanban' 
                ? 'Manage your jobs from intake to shipping' 
                : 'View and manage jobs in a sortable table format'
              }
            </p>
          </div>
          
          {/* Quick Stats, View Switcher, and Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 px-4 py-2.5 rounded-xl">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">On-Time:</span>
              <Badge className={`font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm ${onTimePercentage >= 95 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                {onTimePercentage}%
              </Badge>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200 px-4 py-2.5 rounded-xl">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Capacity:</span>
              <Badge className={`font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm ${capacityPercentage >= 90 ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                {capacityPercentage}%
              </Badge>
            </div>
            
            {/* View Switcher */}
            <ViewSwitcher 
              currentView={viewMode}
              onViewChange={handleViewModeChange}
              jobCount={filteredJobs.length}
            />
            
            {/* Export Button */}
            <ExportButton 
              jobs={filteredJobs.map(job => ({
                ...job,
                client: job.client.name,
                csr: job.csr.name,
                createdAt: new Date() // Using current date for demo purposes
              }))}
              statusFilter="ALL"
            />
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mt-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            {/* Enhanced Search */}
            <div className="flex-1 max-w-2xl">
              <div className={`relative group transition-all duration-200 ${
                isSearchFocused ? 'transform scale-[1.02]' : ''
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl transition-opacity duration-200 ${
                  isSearchFocused ? 'opacity-100' : 'opacity-0'
                }`}></div>
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
                    isSearchFocused ? 'text-indigo-600' : 'text-slate-400'
                  }`} />
                  <Input
                    type="text"
                    placeholder="Search jobs by client, job code, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="pl-12 pr-6 py-4 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder-slate-500 font-medium text-base"
                  />
                </div>
              </div>
            </div>

            {/* Modern Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3">
                <Label htmlFor="csr-filter" className="text-sm font-semibold text-slate-700">Team:</Label>
                <select
                  id="csr-filter"
                  value={selectedCSR}
                  onChange={(e) => setSelectedCSR(e.target.value)}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-36 cursor-pointer transition-all duration-200"
                >
                  <option value="all">All Members</option>
                  <option value="Sarah M.">Sarah M.</option>
                  <option value="John D.">John D.</option>
                  <option value="Mike R.">Mike R.</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showRushOnly}
                      onChange={(e) => setShowRushOnly(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${
                      showRushOnly ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-300 group-hover:border-orange-400'
                    }`}>
                      {showRushOnly && (
                        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors duration-200">Rush Jobs</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showNeedPhotoOnly}
                      onChange={(e) => setShowNeedPhotoOnly(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${
                      showNeedPhotoOnly ? 'bg-purple-500 border-purple-500' : 'bg-white border-slate-300 group-hover:border-purple-400'
                    }`}>
                      {showNeedPhotoOnly && (
                        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-purple-600 transition-colors duration-200">Photo Required</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-2 py-2">
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.15s' }}></div>
              </div>
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              jobs={filteredJobs}
              onJobUpdate={handleJobUpdate}
              onViewJobDetails={handleViewJobDetails}
            />
          ) : (
            <SmartTableView
              jobs={filteredJobs}
              onViewJobDetails={handleViewJobDetails}
              onJobUpdate={handleJobUpdate}
            />
          )}
        </div>
      </main>

      {/* Job Detail Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={isJobDetailOpen}
        onClose={() => {
          setIsJobDetailOpen(false);
          setSelectedJobId(null);
        }}
        onJobUpdate={handleJobUpdate}
      />

      {/* Create Job Form */}
      {isCreateJobOpen && (
        <CreateJobForm
          isOpen={isCreateJobOpen}
          onClose={() => setIsCreateJobOpen(false)}
          onJobCreate={handleCreateJob}
        />
      )}
    </div>
  );
}