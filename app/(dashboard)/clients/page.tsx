'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClientForm } from '@/components/forms/ClientForm';
import { 
  Search, 
  Plus, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Loader2
} from 'lucide-react';

// Mock client data
const mockClients = [
  {
    id: 'client-1',
    name: 'Acme Corporation',
    email: 'orders@acme.com',
    phone: '(555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    contactPerson: 'Sarah Johnson',
    totalJobs: 45,
    totalRevenue: 125000,
    averageOrderValue: 2780,
    lastOrder: new Date('2024-12-15'),
    status: 'active',
    notes: 'Premium client with consistent monthly orders. Prefers rush delivery.',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'client-2',
    name: 'Tech Startup Inc',
    email: 'marketing@techstartup.com',
    phone: '(555) 987-6543',
    address: '456 Innovation Dr, San Francisco, CA 94105',
    contactPerson: 'Michael Chen',
    totalJobs: 12,
    totalRevenue: 18500,
    averageOrderValue: 1540,
    lastOrder: new Date('2024-12-10'),
    status: 'active',
    notes: 'Growing startup, potential for large orders. Photo requirements for social media.',
    createdAt: new Date('2024-03-20')
  },
  {
    id: 'client-3',
    name: 'Local Brewery',
    email: 'events@localbrewery.com',
    phone: '(555) 456-7890',
    address: '789 Craft Beer Ln, Portland, OR 97201',
    contactPerson: 'Emma Davis',
    totalJobs: 28,
    totalRevenue: 42000,
    averageOrderValue: 1500,
    lastOrder: new Date('2024-11-25'),
    status: 'active',
    notes: 'Seasonal orders for events and merchandise. Eco-friendly materials preferred.',
    createdAt: new Date('2023-06-10')
  },
  {
    id: 'client-4',
    name: 'University Bookstore',
    email: 'purchasing@university.edu',
    phone: '(555) 321-9876',
    address: '321 Campus Way, Boston, MA 02115',
    contactPerson: 'Dr. James Wilson',
    totalJobs: 67,
    totalRevenue: 98000,
    averageOrderValue: 1460,
    lastOrder: new Date('2024-12-01'),
    status: 'active',
    notes: 'Large volume orders for student orientation and campus events.',
    createdAt: new Date('2022-09-01')
  },
  {
    id: 'client-5',
    name: 'Coffee Shop Chain',
    email: 'procurement@coffeeshop.com',
    phone: '(555) 654-3210',
    address: '987 Main St, Chicago, IL 60601',
    contactPerson: 'Lisa Rodriguez',
    totalJobs: 23,
    totalRevenue: 56000,
    averageOrderValue: 2435,
    lastOrder: new Date('2024-09-15'),
    status: 'inactive',
    notes: 'Has not placed orders recently. May need follow-up.',
    createdAt: new Date('2023-11-12')
  }
];

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
  status: 'active' | 'inactive';
  totalJobs: number;
  totalRevenue: number;
  averageOrderValue: number;
  lastOrder?: Date;
  createdAt: Date;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load clients from API
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data.clients || mockClients);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      setError(error.message);
      // Fall back to mock data
      setClients(mockClients);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search clients
  useEffect(() => {
    let filtered = clients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Sort clients
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'totalRevenue' || sortBy === 'totalJobs' || sortBy === 'averageOrderValue') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === 'lastOrder' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreateClient = async (clientData: any) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create client');
      }

      const data = await response.json();
      await fetchClients(); // Refresh the list
      alert('Client created successfully!');
    } catch (error: any) {
      console.error('Error creating client:', error);
      throw error; // Re-throw to be handled by the form
    }
  };

  const handleEditClient = async (clientData: any) => {
    if (!editingClient) return;

    try {
      const response = await fetch(`/api/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update client');
      }

      await fetchClients(); // Refresh the list
      alert('Client updated successfully!');
    } catch (error: any) {
      console.error('Error updating client:', error);
      throw error; // Re-throw to be handled by the form
    }
  };

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`Are you sure you want to delete "${clientName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete client');
      }

      await fetchClients(); // Refresh the list
      alert('Client deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting client:', error);
      alert(`Error deleting client: ${error.message}`);
    }
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingClient(null);
    setIsEditModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'No orders yet';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj);
  };

  const totalRevenue = clients.reduce((sum, client) => sum + client.totalRevenue, 0);
  const activeClients = clients.filter(client => client.status === 'active').length;
  const totalJobs = clients.reduce((sum, client) => sum + client.totalJobs, 0);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Client Management</h1>
            <p className="text-slate-600 mt-1">Manage your client relationships and track business metrics</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 px-4 py-2.5 rounded-xl">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Revenue:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-emerald-500 text-white">
                {formatCurrency(totalRevenue)}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200 px-4 py-2.5 rounded-xl">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Active:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-blue-500 text-white">
                {activeClients}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50/80 backdrop-blur-sm border border-purple-200 px-4 py-2.5 rounded-xl">
              <Package className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Jobs:</span>
              <Badge className="font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm bg-purple-500 text-white">
                {totalJobs}
              </Badge>
            </div>
            
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
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
                  placeholder="Search clients by name, email, contact person, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 w-full bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder-slate-500 font-medium text-base"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-slate-700">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-32 cursor-pointer transition-all duration-200"
                >
                  <option value="all">All Clients</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-semibold text-slate-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-40 cursor-pointer transition-all duration-200"
                >
                  <option value="name">Name</option>
                  <option value="totalRevenue">Revenue</option>
                  <option value="totalJobs">Total Jobs</option>
                  <option value="lastOrder">Last Order</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.15s' }}></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Package className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Clients</h3>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={fetchClients} className="mt-4">
              <Loader2 className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
            <Card key={client.id} className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Building className="w-5 h-5 text-indigo-600" />
                      {client.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs font-medium px-3 py-1 rounded-full ${
                        client.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-orange-100 text-orange-800 border-orange-200'
                      }`}>
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-indigo-100 hover:text-indigo-600"
                      onClick={() => openEditModal(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-red-100 hover:text-red-600"
                      onClick={() => handleDeleteClient(client.id, client.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">{client.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{typeof client.address === 'object' ? `${client.address.city}, ${client.address.state}` : client.address || 'No address'}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Revenue</span>
                    </div>
                    <div className="text-lg font-bold text-slate-800">{formatCurrency(client.totalRevenue)}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Jobs</span>
                    </div>
                    <div className="text-lg font-bold text-slate-800">{client.totalJobs}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      Avg Order:
                    </span>
                    <span className="font-semibold text-slate-800">{formatCurrency(client.averageOrderValue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Last Order:
                    </span>
                    <span className="font-semibold text-slate-800">{formatDate(client.lastOrder)}</span>
                  </div>
                </div>

                {/* Notes */}
                {client.notes && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 italic">
                      {client.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

            {/* No results */}
            {filteredClients.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No clients found</h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search terms or filters'
                    : 'Start by adding your first client'
                  }
                </p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Client
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Client Form */}
      <ClientForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClient}
        mode="create"
      />

      {/* Edit Client Form */}
      <ClientForm
        client={editingClient || undefined}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditClient}
        mode="edit"
      />
    </div>
  );
}