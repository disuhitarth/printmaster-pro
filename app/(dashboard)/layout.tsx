'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Columns, 
  Plus, 
  FileText, 
  Users, 
  Palette, 
  Package, 
  Printer, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search,
  User,
  LogOut,
  QrCode
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Kanban Board', href: '/kanban', icon: Columns, badge: '42' },
    { label: 'Create Job', href: '/jobs/create', icon: Plus, badge: null },
    { label: 'Jobs', href: '/jobs', icon: FileText, badge: '156' },
    { label: 'Clients', href: '/clients', icon: Users, badge: null },
    { label: 'Artwork', href: '/artwork', icon: Palette, badge: '8' },
    { label: 'Inventory', href: '/inventory', icon: Package, badge: null },
    { label: 'Presses', href: '/presses', icon: Printer, badge: '3' },
    { label: 'Reports', href: '/reports', icon: BarChart3, badge: null },
    { label: 'Settings', href: '/settings', icon: Settings, badge: null },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 shadow-lg transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900">PrintMaster Pro</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                isActive(item.href) ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
              }`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge 
                  className={`ml-2 px-2 py-1 text-xs ${
                    isActive(item.href) 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-slate-200/60">
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {session?.user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {session?.user?.role || 'Not logged in'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-slate-400 hover:text-slate-600"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Search */}
              <div className="flex-1 max-w-2xl mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, clients, or products..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-3">
                {/* Quick scan button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center bg-white/60 hover:bg-white border-slate-200 text-slate-700"
                  onClick={() => {
                    // Open scan modal or navigate to scan page
                    alert('Barcode scanning feature coming soon!');
                  }}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* Quick create */}
                <Link href="/jobs/create">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Job
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}