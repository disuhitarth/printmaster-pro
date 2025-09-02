'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Upload, 
  Image, 
  FileText, 
  Download, 
  Eye,
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Grid,
  List,
  Star,
  MessageSquare
} from 'lucide-react';

// Mock artwork data
const mockArtwork = [
  {
    id: 'art-1',
    fileName: 'acme-corp-logo-v3.ai',
    title: 'Acme Corp Logo Design',
    description: 'Updated logo design with brand guidelines compliance',
    fileType: 'ai',
    fileSize: '2.4 MB',
    uploadedBy: { name: 'Sarah M.', role: 'CSR' },
    uploadedAt: new Date('2024-12-18T10:30:00Z'),
    jobCode: 'JOB-001001',
    client: { name: 'Acme Corporation' },
    status: 'approved',
    version: 3,
    approvedBy: { name: 'Mike R.', role: 'PRODUCTION_LEAD' },
    approvedAt: new Date('2024-12-18T14:22:00Z'),
    tags: ['logo', 'brand', 'vector'],
    notes: 'Final approved version with corrected Pantone colors',
    thumbnailUrl: '/artwork-thumbnails/acme-logo-v3.png',
    downloadCount: 12,
    category: 'logos'
  },
  {
    id: 'art-2',
    fileName: 'tech-startup-tshirt-design.psd',
    title: 'Tech Startup T-Shirt Design',
    description: 'Front chest logo placement with custom typography',
    fileType: 'psd',
    fileSize: '45.7 MB',
    uploadedBy: { name: 'John D.', role: 'CSR' },
    uploadedAt: new Date('2024-12-17T16:45:00Z'),
    jobCode: 'JOB-001002',
    client: { name: 'Tech Startup Inc' },
    status: 'pending',
    version: 1,
    tags: ['apparel', 'design', 'typography'],
    notes: 'Waiting for client approval on font selection',
    thumbnailUrl: '/artwork-thumbnails/tech-startup-design.png',
    downloadCount: 3,
    category: 'apparel'
  },
  {
    id: 'art-3',
    fileName: 'brewery-event-poster.pdf',
    title: 'Local Brewery Event Poster',
    description: 'Holiday event promotional poster design',
    fileType: 'pdf',
    fileSize: '8.9 MB',
    uploadedBy: { name: 'Sarah M.', role: 'CSR' },
    uploadedAt: new Date('2024-12-16T09:15:00Z'),
    jobCode: 'JOB-001003',
    client: { name: 'Local Brewery' },
    status: 'revision_requested',
    version: 2,
    tags: ['poster', 'event', 'print'],
    notes: 'Client requested darker background and larger text for readability',
    thumbnailUrl: '/artwork-thumbnails/brewery-poster.png',
    downloadCount: 7,
    category: 'promotional'
  },
  {
    id: 'art-4',
    fileName: 'university-merchandise-bundle.zip',
    title: 'University Merchandise Bundle',
    description: 'Complete artwork package for campus store merchandise',
    fileType: 'zip',
    fileSize: '127.3 MB',
    uploadedBy: { name: 'Mike R.', role: 'PRODUCTION_LEAD' },
    uploadedAt: new Date('2024-12-15T13:20:00Z'),
    jobCode: 'JOB-001005',
    client: { name: 'University Bookstore' },
    status: 'approved',
    version: 1,
    approvedBy: { name: 'Dr. James Wilson', role: 'CLIENT' },
    approvedAt: new Date('2024-12-15T17:45:00Z'),
    tags: ['merchandise', 'bundle', 'university'],
    notes: 'Approved package includes logos, patterns, and placement guides',
    thumbnailUrl: '/artwork-thumbnails/university-bundle.png',
    downloadCount: 25,
    category: 'merchandise'
  },
  {
    id: 'art-5',
    fileName: 'coffee-shop-loyalty-card.ai',
    title: 'Coffee Shop Loyalty Card Design',
    description: 'Vintage-inspired loyalty card with stamp areas',
    fileType: 'ai',
    fileSize: '1.8 MB',
    uploadedBy: { name: 'John D.', role: 'CSR' },
    uploadedAt: new Date('2024-12-14T11:00:00Z'),
    jobCode: 'JOB-001006',
    client: { name: 'Coffee Shop Chain' },
    status: 'archived',
    version: 4,
    tags: ['cards', 'loyalty', 'vintage'],
    notes: 'Project completed and archived',
    thumbnailUrl: '/artwork-thumbnails/loyalty-card.png',
    downloadCount: 18,
    category: 'cards'
  }
];

export default function ArtworkPage() {
  const [artwork, setArtwork] = useState(mockArtwork);
  const [filteredArtwork, setFilteredArtwork] = useState(mockArtwork);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Filter and search artwork
  useEffect(() => {
    let filtered = artwork;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(art =>
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.jobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(art => art.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(art => art.category === categoryFilter);
    }

    // Sort artwork
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'uploadedAt' || sortBy === 'approvedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'downloadCount' || sortBy === 'version') {
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

    setFilteredArtwork(filtered);
  }, [artwork, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'revision_requested': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'archived': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'revision_requested': return <XCircle className="w-4 h-4" />;
      case 'archived': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'ai':
      case 'svg':
        return <Image className="w-5 h-5 text-orange-600" />;
      case 'psd':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="w-5 h-5 text-blue-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes: string) => {
    return bytes; // Already formatted in mock data
  };

  const totalFiles = artwork.length;
  const approvedFiles = artwork.filter(art => art.status === 'approved').length;
  const pendingFiles = artwork.filter(art => art.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Artwork Management</h1>
            <p className="text-slate-600 mt-1">Manage design files, approvals, and artwork versions</p>
          </div>
          
          {/* Quick Stats & Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-2 bg-indigo-50/80 backdrop-blur-sm border border-indigo-200 px-4 py-2.5 rounded-xl">
              <Image className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Total:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-indigo-500 text-white">
                {totalFiles}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 px-4 py-2.5 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Approved:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-emerald-500 text-white">
                {approvedFiles}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 px-4 py-2.5 rounded-xl">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Pending:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-yellow-500 text-white">
                {pendingFiles}
              </Badge>
            </div>
            
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              <Upload className="w-4 h-4 mr-2" />
              Upload Artwork
            </Button>
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
                  placeholder="Search by title, filename, client, job code, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder-slate-500 font-medium text-base"
                />
              </div>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-slate-700">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="revision_requested">Needs Revision</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-slate-700">Category:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="logos">Logos</option>
                  <option value="apparel">Apparel</option>
                  <option value="promotional">Promotional</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="cards">Cards</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'} transition-all duration-200`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'} transition-all duration-200`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtwork.map((art) => (
              <Card key={art.id} className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">
                        {art.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(art.status)}`}>
                          {getStatusIcon(art.status)}
                          {art.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button variant="ghost" size="sm" className="hover:bg-indigo-100 hover:text-indigo-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* File Info */}
                  <div className="flex items-center gap-2 text-sm">
                    {getFileIcon(art.fileType)}
                    <span className="font-medium text-slate-700 truncate">{art.fileName}</span>
                  </div>

                  {/* Client & Job */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Building className="w-3 h-3" />
                      <span className="truncate">{art.client.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FileText className="w-3 h-3" />
                      <span>{art.jobCode}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {art.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                      {art.tags.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                          +{art.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold">v{art.version}</span>
                    </div>
                    <div className="text-right">
                      <span>{formatFileSize(art.fileSize)}</span>
                    </div>
                    <div>
                      <span>{art.downloadCount} downloads</span>
                    </div>
                    <div className="text-right">
                      <span>{formatDate(art.uploadedAt).split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-600 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-600">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-green-100 hover:text-green-600">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArtwork.map((art) => (
              <Card key={art.id} className="bg-gradient-to-r from-white to-slate-50 border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(art.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 truncate">{art.title}</h3>
                          <p className="text-sm text-slate-600 truncate">{art.fileName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(art.status)}`}>
                            {getStatusIcon(art.status)}
                            {art.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {art.client.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {art.jobCode}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {art.uploadedBy.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(art.uploadedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-600">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-indigo-100 hover:text-indigo-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No results */}
        {filteredArtwork.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No artwork found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Start by uploading your first artwork file'
              }
            </p>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Artwork
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}