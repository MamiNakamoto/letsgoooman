import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import HowItWorks from './components/HowItWorks';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian text-white selection:bg-gold-500/30">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />

      <footer className="bg-charcoal border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span className="text-lg font-bold tracking-wider">
                API<span className="text-gold-500">GATEWAY</span>
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} API Gateway. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
