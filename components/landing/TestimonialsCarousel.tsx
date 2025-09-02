'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Quote, ChevronLeft, ChevronRight, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export function TestimonialsCarousel() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Owner',
      company: 'Precision Print Studio',
      location: 'Austin, TX',
      avatar: '👩‍💼',
      rating: 5,
      quote: "PrintMaster Pro transformed our entire operation. We went from chaos to clarity overnight. Our on-time delivery rate improved from 70% to 98%, and our team loves the intuitive interface.",
      metrics: { onTime: '+28%', efficiency: '+45%', errors: '-80%' },
      highlight: 'Increased on-time delivery by 28%'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      title: 'Production Manager',
      company: 'Custom Tees & More',
      location: 'Los Angeles, CA',
      avatar: '👨‍🔧',
      rating: 5,
      quote: "The barcode scanning feature alone saved us 2 hours per day. No more lost jobs, no more manual tracking. The mobile app keeps our entire team connected from press to shipping.",
      metrics: { timeSaved: '2hrs/day', accuracy: '+90%', mobile: '100%' },
      highlight: 'Saves 2 hours daily with automation'
    },
    {
      id: 3,
      name: 'Jennifer Chen',
      title: 'CSR Lead',
      company: 'Elite Graphics',
      location: 'Denver, CO',
      avatar: '👩‍💻',
      rating: 5,
      quote: "Client communication is so much smoother now. The proof approval system eliminates back-and-forth emails, and clients love the professional digital experience.",
      metrics: { approval: '+60%', satisfaction: '4.9/5', communication: '+70%' },
      highlight: '60% faster proof approvals'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Operations Director',
      company: 'Metro Screen Works',
      location: 'Chicago, IL',
      avatar: '👨‍💼',
      rating: 5,
      quote: "The analytics dashboard gives us insights we never had before. We can now predict bottlenecks, optimize our schedule, and make data-driven decisions that boost profitability.",
      metrics: { visibility: '+100%', profit: '+25%', planning: '+40%' },
      highlight: '25% increase in profitability'
    }
  ];

  const companyLogos = [
    { name: 'Precision Print Studio', size: 'Small Shop', employees: '5-10' },
    { name: 'Custom Tees & More', size: 'Medium Shop', employees: '11-25' },
    { name: 'Elite Graphics', size: 'Large Shop', employees: '26-50' },
    { name: 'Metro Screen Works', size: 'Enterprise', employees: '50+' },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            Success Stories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Screen Printers
            </span>{' '}
            Everywhere
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of successful screen printing businesses that have transformed their operations.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:p-12 text-white relative">
              <Quote className="absolute top-8 right-8 w-12 h-12 opacity-20" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{currentTestimonial.avatar}</div>
                  <div>
                    <h3 className="text-2xl font-bold">{currentTestimonial.name}</h3>
                    <p className="text-indigo-100">{currentTestimonial.title} at {currentTestimonial.company}</p>
                    <p className="text-sm text-indigo-200">{currentTestimonial.location}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                  "{currentTestimonial.quote}"
                </blockquote>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-semibold mb-4 text-lg">{currentTestimonial.highlight}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(currentTestimonial.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{value}</div>
                        <div className="text-sm text-indigo-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center mb-12 space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full w-12 h-12 border-2 hover:bg-indigo-50 hover:border-indigo-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTestimonial(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'bg-indigo-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full w-12 h-12 border-2 hover:bg-indigo-50 hover:border-indigo-300"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Company Sizes */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect for Every Size Shop</h3>
            <p className="text-gray-600">From small startups to enterprise operations</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {companyLogos.map((company, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{company.size}</h4>
                <p className="text-sm text-gray-600">{company.employees} employees</p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ROI Calculator Teaser */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Calculate Your ROI</h3>
            </div>
            <p className="text-gray-600 mb-6">
              See how much time and money PrintMaster Pro can save your business
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                // Open ROI calculator modal or navigate to calculator page
                alert('ROI Calculator coming soon! Contact sales for a personalized assessment.');
              }}
            >
              Get Your Custom ROI Report
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}