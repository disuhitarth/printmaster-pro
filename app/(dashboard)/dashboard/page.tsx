'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Package, 
  Printer, 
  BarChart3,
  Calendar,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function MetricCard({ title, value, trend, icon: Icon, color }: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {trend && (
          <div className={`flex items-center text-sm mt-1 ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.positive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {trend.value} from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      title: 'Active Jobs',
      value: 42,
      trend: { value: '+12%', positive: true },
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      trend: { value: '+2.1%', positive: true },
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Revenue (MTD)',
      value: '$28,450',
      trend: { value: '+18%', positive: true },
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'Rush Jobs',
      value: 8,
      trend: { value: '-3', positive: false },
      icon: AlertTriangle,
      color: 'text-orange-600'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'job_completed',
      message: 'Job JOB-001045 completed and shipped',
      client: 'Acme Corp',
      time: '5 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'proof_approved',
      message: 'Proof approved for JOB-001046',
      client: 'Tech Startup Inc',
      time: '12 minutes ago',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'job_delayed',
      message: 'Job JOB-001043 is running behind schedule',
      client: 'Local Brewery',
      time: '25 minutes ago',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'new_job',
      message: 'New job created: JOB-001047',
      client: 'Fitness Studio',
      time: '45 minutes ago',
      icon: Package,
      color: 'text-indigo-600'
    },
    {
      id: 5,
      type: 'press_started',
      message: 'Press #2 started on JOB-001044',
      client: 'University Bookstore',
      time: '1 hour ago',
      icon: Printer,
      color: 'text-purple-600'
    }
  ];

  const topClients = [
    { name: 'Acme Corp', jobs: 12, revenue: '$8,450', growth: '+15%', positive: true },
    { name: 'Tech Startup Inc', jobs: 8, revenue: '$6,200', growth: '+22%', positive: true },
    { name: 'University Bookstore', jobs: 6, revenue: '$4,800', growth: '+8%', positive: true },
    { name: 'Local Brewery', jobs: 5, revenue: '$3,950', growth: '-5%', positive: false },
    { name: 'Fitness Studio', jobs: 4, revenue: '$2,100', growth: '+45%', positive: true }
  ];

  const pressStatus = [
    { name: 'Press #1', status: 'Running', job: 'JOB-001041', progress: 75, color: 'bg-green-500' },
    { name: 'Press #2', status: 'Running', job: 'JOB-001044', progress: 30, color: 'bg-blue-500' },
    { name: 'Press #3', status: 'Idle', job: null, progress: 0, color: 'bg-gray-400' },
    { name: 'Press #4', status: 'Maintenance', job: null, progress: 0, color: 'bg-red-500' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's your production overview</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/reports">
              <Button variant="outline" size="sm" className="bg-white/60 hover:bg-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Full Reports
              </Button>
            </Link>
            <Link href="/jobs/create">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                Create New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <span className="font-medium text-slate-700">{activity.client}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <Link href="/activity">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            
            {/* Top Clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Top Clients (MTD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topClients.map((client, index) => (
                    <div key={client.name} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-700">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{client.name}</p>
                          <p className="text-xs text-slate-500">{client.jobs} jobs</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{client.revenue}</p>
                        <p className={`text-xs ${client.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {client.growth}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Press Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Printer className="w-5 h-5 mr-2 text-purple-600" />
                  Press Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pressStatus.map((press) => (
                    <div key={press.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${press.color}`}></div>
                          <span className="text-sm font-medium text-slate-900">{press.name}</span>
                        </div>
                        <Badge 
                          variant={press.status === 'Running' ? 'default' : press.status === 'Idle' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {press.status}
                        </Badge>
                      </div>
                      {press.job && (
                        <div className="ml-5">
                          <p className="text-xs text-slate-600">Working on {press.job}</p>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${press.color}`}
                              style={{ width: `${press.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{press.progress}% complete</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/kanban">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-indigo-50 hover:border-indigo-300 group">
                  <Package className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">View Kanban</span>
                </Button>
              </Link>
              
              <Link href="/jobs/create">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300 group">
                  <Package className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">New Job</span>
                </Button>
              </Link>
              
              <Link href="/reports">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300 group">
                  <BarChart3 className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Reports</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 group"
                onClick={() => alert('Barcode scanning feature coming soon!')}
              >
                <Activity className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Scan Job</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}