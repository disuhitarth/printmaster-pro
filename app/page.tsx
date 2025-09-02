import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { TestimonialsCarousel } from '@/components/landing/TestimonialsCarousel';
import { Footer } from '@/components/landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PrintMaster Pro - Professional Screen Printing Production Management',
  description: 'Transform your screen printing workflow with our enterprise-grade PWA. From job intake to shipping, manage everything with precision, speed, and professional polish.',
  keywords: 'screen printing, production management, kanban board, job tracking, print shop software',
  openGraph: {
    title: 'PrintMaster Pro - Revolutionize Your Screen Printing Workflow',
    description: 'The world\'s most advanced screen printing production management system. Trusted by professionals who demand excellence.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrintMaster Pro - Professional Screen Printing Production Management',
    description: 'Transform your screen printing workflow with our enterprise-grade PWA.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeatureShowcase />
      <div id="demo-section">
        {/* Demo section placeholder - could add interactive Kanban preview here */}
      </div>
      <TestimonialsCarousel />
      <Footer />
    </main>
  );
}