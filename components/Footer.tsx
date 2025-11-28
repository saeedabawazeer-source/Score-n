import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a221e] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6">

        {/* Minimal Brand */}
        <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity">
          <span className="font-display text-2xl font-bold text-white tracking-wider flex items-center">
            SCORE'<span className="relative inline-block" style={{ width: '1ch' }}>
              <span className="relative z-10">n</span>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 16 24" style={{ top: '1px' }}>
                <defs>
                  <pattern id="netPatternFooter" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                    <path d="M0 0 L6 6 M6 0 L0 6" stroke="#b4f156" strokeWidth="0.4" fill="none" opacity="0.6" />
                  </pattern>
                </defs>
                <rect x="1" y="0" width="14" height="22" fill="url(#netPatternFooter)" />
              </svg>
            </span>
          </span>
        </div>

        {/* Links Row */}
        <div className="flex gap-8 text-xs font-mono uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-lime transition-colors">Privacy</a>
          <span className="text-white/10">|</span>
          <a href="#" className="hover:text-lime transition-colors">Terms</a>
          <span className="text-white/10">|</span>
          <a href="#" className="hover:text-lime transition-colors">Support</a>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-gray-700 font-mono pt-4">
          &copy; {new Date().getFullYear()} SCORE'N INC.
        </div>

      </div>
    </footer>
  );
};