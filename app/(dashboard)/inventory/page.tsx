'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Archive,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  Download,
  Upload,
  BarChart3,
  Settings,
  Grid3X3,
  List
} from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
  currentStock: number;
  minStock: number;
  maxStock?: number;
  reorderPoint: number;
  unitCost: number;
  unitPrice?: number;
  unit: string;
  size?: string;
  color?: string;
  brand?: string;
  supplier?: string;
  location?: string;
  status: 'active' | 'discontinued' | 'backordered';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: number;
}

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch inventory data from API
  useEffect(() => {
    fetchInventoryData();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/inventory/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchInventoryData = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (stockFilter !== 'all') params.append('stockLevel', stockFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/inventory?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }

      const data = await response.json();
      setItems(data.items || []);
      setFilteredItems(data.items || []);
      setStats(data.stats || {
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        categories: 0
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  // Refetch data when filters change
  useEffect(() => {
    if (!loading) {
      setLoading(true);
      fetchInventoryData();
    }
  }, [statusFilter, categoryFilter, stockFilter, searchTerm]);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', priority: 'critical' };
    if (item.currentStock <= item.minStock) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', priority: 'warning' };
    if (item.currentStock <= item.reorderPoint) return { label: 'Reorder Soon', color: 'bg-orange-100 text-orange-800', priority: 'info' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', priority: 'good' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            Inventory Management
          </h1>
          <p className="text-slate-600 mt-2">
            Track stock levels, manage items, and monitor inventory health
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Items</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalItems.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Archive className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Value</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Low Stock</p>
                <p className="text-2xl font-bold text-slate-800">{stats.lowStockItems}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Out of Stock</p>
                <p className="text-2xl font-bold text-slate-800">{stats.outOfStockItems}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <p className="text-2xl font-bold text-slate-800">{stats.categories}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by name, SKU, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              
              <div className="flex border border-slate-200 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="discontinued">Discontinued</option>
                    <option value="backordered">Backordered</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Stock Level</label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="good">In Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
      }>
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item);
          
          if (viewMode === 'list') {
            return (
              <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                          <Badge 
                            className={stockStatus.color}
                            variant="secondary"
                          >
                            {stockStatus.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>SKU: {item.sku}</span>
                          <span>•</span>
                          <span>{item.category.name}</span>
                          {item.location && (
                            <>
                              <span>•</span>
                              <span>Location: {item.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-sm text-slate-600">
                          Min: {item.minStock} {item.unit}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">
                          {formatCurrency(item.unitCost)}
                        </div>
                        <div className="text-sm text-slate-600">
                          Value: {formatCurrency(item.currentStock * item.unitCost)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          return (
            <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-0">
                {/* Item Image/Icon */}
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-16 h-16 text-slate-400" />
                  )}
                  
                  {/* Stock Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={stockStatus.color} variant="secondary">
                      {stockStatus.label}
                    </Badge>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge 
                      style={{ backgroundColor: item.category.color + '20', color: item.category.color }}
                      variant="secondary"
                    >
                      {item.category.name}
                    </Badge>
                  </div>
                </div>
                
                {/* Item Details */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">SKU: {item.sku}</p>
                    {item.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  
                  {/* Stock Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Current Stock:</span>
                      <span className="font-semibold text-slate-800">
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Unit Cost:</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(item.unitCost)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Value:</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(item.currentStock * item.unitCost)}
                      </span>
                    </div>
                    
                    {/* Stock Level Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Stock Level</span>
                        <span>{item.currentStock} / {item.maxStock || 'unlimited'}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            stockStatus.priority === 'critical' ? 'bg-red-500' :
                            stockStatus.priority === 'warning' ? 'bg-yellow-500' :
                            stockStatus.priority === 'info' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (item.currentStock / (item.maxStock || item.currentStock || 1)) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="space-y-1 mb-4 text-xs text-slate-600">
                    {item.brand && (
                      <div className="flex justify-between">
                        <span>Brand:</span>
                        <span>{item.brand}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.size && (
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{item.size}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No items found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || stockFilter !== 'all'
                ? "No items match your current filters. Try adjusting your search criteria."
                : "You haven't added any inventory items yet. Start by adding your first item."
              }
            </p>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}