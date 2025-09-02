'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, CheckCircle, Star, Users, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { label: 'Jobs Processed', value: '50K+', icon: CheckCircle },
    { label: 'Happy Clients', value: '500+', icon: Users },
    { label: 'Time Saved', value: '80%', icon: Zap },
    { label: 'Revenue Growth', value: '45%', icon: TrendingUp },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-orange-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(79,70,229,0.1)_1px,transparent_0)] [background-size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-indigo-500/5 to-orange-500/5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Star className="w-4 h-4 mr-2" />
              #1 Screen Printing Production System
            </Badge>
          </div>

          {/* Main Headline */}
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionize Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Screen Printing
              </span>{' '}
              Workflow
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your paper-based chaos into a{' '}
              <strong className="text-gray-900">streamlined digital powerhouse</strong>.
              From job intake to shipping, manage everything with precision, speed, and professional polish.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="/kanban">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-200 hover:border-indigo-300 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:bg-indigo-50 group"
                >
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Try Demo
                </Button>
              </Link>
            </div>
            
            {/* Login Link */}
            <div className="mb-16">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={`transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center transform transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${1000 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-indigo-600 mr-2" />
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-sm text-gray-500 mb-4 font-medium">Trusted by screen printing shops worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Replace with actual client logos */}
              <div className="w-24 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">CLIENT</span>
              </div>
              <div className="w-24 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">LOGO</span>
              </div>
              <div className="w-24 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">HERE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}