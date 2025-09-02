'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Columns, 
  Upload, 
  QrCode, 
  BarChart3, 
  Smartphone, 
  Zap, 
  CheckCircle, 
  Clock,
  Users,
  FileText,
  Palette,
  Package,
  ArrowRight
} from 'lucide-react';

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'kanban',
      title: 'Visual Kanban Board',
      description: 'Drag-and-drop job management with real-time status tracking',
      icon: Columns,
      color: 'from-blue-500 to-indigo-600',
      benefits: ['Visual workflow management', 'Real-time collaboration', 'Status validation rules'],
      demo: 'Interactive board preview'
    },
    {
      id: 'proofs',
      title: 'Proof Approval System',
      description: 'Streamlined artwork approval with client notifications',
      icon: Upload,
      color: 'from-green-500 to-emerald-600',
      benefits: ['Automated client notifications', 'Version control', 'Digital approvals'],
      demo: 'Proof workflow animation'
    },
    {
      id: 'scanning',
      title: 'Barcode Tracking',
      description: 'QR codes and barcode scanning for instant status updates',
      icon: QrCode,
      color: 'from-purple-500 to-violet-600',
      benefits: ['Instant status updates', 'Mobile scanning', 'Error reduction'],
      demo: 'Scanning demonstration'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and business intelligence',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      benefits: ['KPI dashboards', 'Performance tracking', 'Custom reports'],
      demo: 'Analytics dashboard'
    },
    {
      id: 'mobile',
      title: 'Mobile-First Design',
      description: 'Full functionality on any device, anywhere',
      icon: Smartphone,
      color: 'from-pink-500 to-rose-600',
      benefits: ['Touch-optimized interface', 'Offline capabilities', 'Push notifications'],
      demo: 'Mobile interface showcase'
    },
    {
      id: 'automation',
      title: 'Smart Automation',
      description: 'Intelligent workflows that reduce manual tasks',
      icon: Zap,
      color: 'from-yellow-500 to-amber-600',
      benefits: ['Automated notifications', 'Smart scheduling', 'Error prevention'],
      demo: 'Automation examples'
    }
  ];

  const beforeAfter = {
    before: [
      { icon: FileText, text: 'Paper job tickets everywhere', pain: true },
      { icon: Clock, text: 'Manual status updates', pain: true },
      { icon: Users, text: 'Miscommunication between teams', pain: true },
      { icon: Package, text: 'Lost or delayed jobs', pain: true },
    ],
    after: [
      { icon: Columns, text: 'Digital kanban board', gain: true },
      { icon: Zap, text: 'Automated notifications', gain: true },
      { icon: CheckCircle, text: 'Real-time collaboration', gain: true },
      { icon: BarChart3, text: 'Data-driven decisions', gain: true },
    ]
  };

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold">
            Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Scale Your Shop
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built specifically for screen printing professionals who demand efficiency, accuracy, and growth.
          </p>
        </div>

        {/* Before & After Comparison */}
        <div className="mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Before */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Before: Paper Chaos</h3>
                <p className="text-gray-600 mb-6">Traditional paper-based workflows create bottlenecks and errors</p>
              </div>
              <div className="space-y-4">
                {beforeAfter.before.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <item.icon className="w-6 h-6 text-red-600" />
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">After: Digital Precision</h3>
                <p className="text-gray-600 mb-6">Streamlined digital workflows increase efficiency by 80%</p>
              </div>
              <div className="space-y-4">
                {beforeAfter.after.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-green-50 border border-green-100 rounded-lg">
                    <item.icon className="w-6 h-6 text-green-600" />
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.id}
              className={`group cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                activeFeature === index ? 'ring-2 ring-indigo-500 shadow-xl -translate-y-2' : ''
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                >
                  View Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Demo Section */}
        <div className="mt-20">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
              <p className="text-indigo-100 mb-6">{features[activeFeature].description}</p>
              <Badge className="bg-white/20 text-white border-white/30">
                {features[activeFeature].demo}
              </Badge>
            </div>
            
            <CardContent className="p-8">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  {(() => {
                    const IconComponent = features[activeFeature].icon;
                    return <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />;
                  })()}
                  <p className="text-gray-600 font-medium">Interactive {features[activeFeature].title} Demo</p>
                  <p className="text-sm text-gray-500 mt-2">Click to explore this feature</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}