'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Demo', href: '/kanban' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Support', href: '/support' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Shop?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful screen printing businesses. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kanban">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              onClick={() => window.open('mailto:sales@printmasterpro.com', '_blank')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold">PrintMaster Pro</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The world's most advanced screen printing production management system. 
                Trusted by professionals who demand excellence.
              </p>
              
              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  SOC 2 Type II Certified
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Award className="w-4 h-4 mr-2 text-yellow-400" />
                  #1 Rated by Industry Professionals
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  500+ Active Businesses
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Zap className="w-4 h-4 mr-2 text-purple-400" />
                  99.9% Uptime Guarantee
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <nav className="space-y-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <nav className="space-y-4">
                <Link href="/blog" className="block text-gray-400 hover:text-white transition-colors duration-200">
                  Blog & Insights
                </Link>
                <Link href="/guides" className="block text-gray-400 hover:text-white transition-colors duration-200">
                  Setup Guides
                </Link>
                <Link href="/webinars" className="block text-gray-400 hover:text-white transition-colors duration-200">
                  Webinars
                </Link>
                <Link href="/case-studies" className="block text-gray-400 hover:text-white transition-colors duration-200">
                  Case Studies
                </Link>
                <Link href="/api" className="block text-gray-400 hover:text-white transition-colors duration-200">
                  API Documentation
                </Link>
                <Link href="/integrations" className="block text-gray-400 hover:text-white transition-colors duration-200">
                  Integrations
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                  <a href="mailto:support@printmasterpro.com" className="hover:text-white transition-colors">
                    support@printmasterpro.com
                  </a>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                  <a href="tel:+1-555-123-4567" className="hover:text-white transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-start text-gray-400">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>
                    123 Innovation Drive<br />
                    Tech City, TC 12345<br />
                    United States
                  </span>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">Support Hours</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Monday - Friday: 8AM - 8PM EST</div>
                  <div>Saturday: 9AM - 5PM EST</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-6">
            Get the latest features, tips, and industry insights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1"
            />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            No spam, unsubscribe at any time. Read our{' '}
            <Link href="/privacy" className="underline hover:text-gray-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} PrintMaster Pro. All rights reserved.
            </div>

            {/* Legal Links */}
            <nav className="flex flex-wrap items-center gap-6 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={() => {
            // Open chat widget or contact form
            alert('Chat support coming soon! Please email us at support@printmasterpro.com');
          }}
        >
          💬 Chat
        </Button>
      </div>
    </footer>
  );
}