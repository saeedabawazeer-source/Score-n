import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#050f0d]/95 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <span className="font-display font-bold text-3xl md:text-4xl text-white tracking-widest flex items-center">
              SC<span className="text-lime mx-0.5"><CircleDashed size={28} strokeWidth={3} /></span>RE'
            </span>
            <div className="relative -bottom-0.5 -ml-1">
              <Logo className="w-8 h-8 md:w-10 md:h-10" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};