import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-end gap-0.5">
            <span className="font-display font-bold text-3xl md:text-4xl text-white tracking-tighter leading-none">SCORE'</span>
            <div className="relative -bottom-0.5">
              <Logo className="w-8 h-8 md:w-10 md:h-10" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};