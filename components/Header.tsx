import React, { useState, useEffect } from 'react';
import { CircleDashed } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-forest/95 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          {/* Logo Centered */}
          <div className="flex items-center space-x-2 group cursor-pointer">
            <span className="font-display text-3xl font-bold tracking-wider text-white flex items-center gap-1">
              SC<span className="text-lime"><CircleDashed size={28} strokeWidth={3} /></span>RE'<span className="relative inline-block" style={{ width: '1.2ch' }}>
                <span className="relative z-10">n</span>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 20 30" style={{ top: '2px' }}>
                  <defs>
                    <pattern id="netPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M0 0 L8 8 M8 0 L0 8" stroke="#b4f156" strokeWidth="0.5" fill="none" opacity="0.6" />
                    </pattern>
                  </defs>
                  <rect x="2" y="0" width="16" height="28" fill="url(#netPattern)" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};