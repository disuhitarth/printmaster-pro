'use client';

import { CreateJobForm } from '@/components/forms/CreateJobForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Package, Calendar } from 'lucide-react';

export default function CreateJobPage() {
  const handleJobCreate = async (jobData: any) => {
    try {
      console.log('Creating job:', jobData);
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create job');
      }

      const { job } = await response.json();
      alert(`Job ${job.jobCode} created successfully! Redirecting to kanban board...`);
      
      // Redirect to kanban
      window.location.href = '/kanban';
    } catch (error) {
      console.error('Error creating job:', error);
      alert(`Error creating job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const recentTemplates = [
    { name: 'Standard T-Shirt', uses: 156, type: 'Apparel' },
    { name: 'Business Cards', uses: 89, type: 'Cards' },
    { name: 'Tote Bags', uses: 67, type: 'Accessories' },
    { name: 'Hoodies', uses: 45, type: 'Apparel' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="px-6 py-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create New Job</h1>
            <p className="text-slate-600 mt-1">Set up a new screen printing job with all specifications</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
              <FileText className="w-4 h-4 mr-1" />
              Job Wizard
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Form */}
          <div className="lg:col-span-3">
            <CreateJobForm
              isOpen={true}
              onClose={() => window.history.back()}
              onJobCreate={handleJobCreate}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Client Information</p>
                    <p className="text-xs text-slate-600">Use existing clients when possible to maintain history</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Product Details</p>
                    <p className="text-xs text-slate-600">Be specific with product codes and sizes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Ship Dates</p>
                    <p className="text-xs text-slate-600">Allow extra time for proof approval cycles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTemplates.map((template, index) => (
                    <div 
                      key={template.name}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      onClick={() => alert(`Template "${template.name}" - Feature coming soon!`)}
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{template.name}</p>
                        <p className="text-xs text-slate-500">{template.type}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.uses} uses
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}