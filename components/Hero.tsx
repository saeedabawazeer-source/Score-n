import React from 'react';
import { ArrowRight, AlertCircle, Fingerprint, Globe, Shield, Zap, Users, Target, Lock, TrendingUp, Award, Flame, Heart, Brain, Eye, Crosshair, Wind, Sword, Mountain, Rocket, Radio, Headphones } from 'lucide-react';
import { Badge, BadgeTier, PlaystyleType } from './Badge';

interface HeroProps {
  onCreateCard: () => void;
}

interface PlayerBadge {
  tier: BadgeTier;
  playstyle: PlaystyleType;
}

import { BinaryBorder } from './BinaryBorder';

// ... (existing imports)

// Sample player cards data - positioned to clear center text on mobile
const scatteredCards = [
  {
    name: 'AMMAR',
    position: 'CAM',
    level: 5,
    age: 25,
    height: 176,
    foot: 'L',
    gms: 89,
    gls: 31,
    ast: 45,
    heatmap: [0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0],
    flagIso2: 'ae',
    imageUrl: '/player-cards/ammar.png',
    // Mobile: Top row, center | Desktop: Original
    positionClass: 'top-[2%] left-1/2 md:top-[-25%] md:right-[1%] md:left-auto',
    rotation: -5,
    delay: 0.5,
    scale: 0.53,
    badges: [
      { tier: 'S' as BadgeTier, playstyle: 'playmaker' as PlaystyleType },
      { tier: 'A' as BadgeTier, playstyle: 'engine' as PlaystyleType },
      { tier: 'B' as BadgeTier, playstyle: 'clutch' as PlaystyleType },
    ]
  },
  {
    name: 'AHMAD',
    position: 'ST',
    level: 3,
    age: 23,
    height: 179,
    foot: 'R',
    gms: 47,
    gls: 23,
    ast: 12,
    heatmap: [0, 3, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    flagIso2: 'sa',
    imageUrl: '/player-cards/hassan.png',
    // Mobile: Top row, left | Desktop: Original
    positionClass: 'top-[2%] left-[1%] md:top-[-22%] md:left-[1%]',
    rotation: 6,
    delay: 0,
    scale: 0.37,
    badges: [
      { tier: 'B' as BadgeTier, playstyle: 'finisher' as PlaystyleType },
      { tier: 'C' as BadgeTier, playstyle: 'speed' as PlaystyleType },
    ]
  },
  {
    name: 'JULIAN',
    position: 'CB',
    level: 4,
    age: 29,
    height: 188,
    foot: 'R',
    gms: 72,
    gls: 4,
    ast: 2,
    heatmap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0],
    flagIso2: 'mx',
    imageUrl: '/player-cards/julian.png',
    // Mobile: Top row, right | Desktop: Original
    positionClass: 'top-[2%] right-[1%] md:bottom-auto md:top-[10%] md:left-[1%] md:right-auto',
    rotation: -8,
    delay: 1,
    scale: 0.38,
    badges: [
      { tier: 'A' as BadgeTier, playstyle: 'wall' as PlaystyleType },
      { tier: 'B' as BadgeTier, playstyle: 'lockdown' as PlaystyleType },
    ]
  },
  {
    name: 'RODRI',
    position: 'LW',
    level: 4,
    age: 22,
    height: 178,
    foot: 'L',
    gms: 56,
    gls: 18,
    ast: 22,
    heatmap: [3, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    flagIso2: 'es',
    imageUrl: '/player-cards/rodriguez.png',
    // Mobile: Bottom row, left | Desktop: Original
    positionClass: 'bottom-[5%] left-[15%] md:bottom-auto md:top-[28%] md:right-[1%] md:left-auto',
    rotation: 7,
    delay: 1.5,
    scale: 0.56,
    badges: [
      { tier: 'A' as BadgeTier, playstyle: 'speed' as PlaystyleType },
      { tier: 'B' as BadgeTier, playstyle: 'finisher' as PlaystyleType },
    ]
  },
  {
    name: 'WILLIAM',
    position: 'GK',
    level: 5,
    age: 31,
    height: 191,
    foot: 'R',
    gms: 94,
    gls: 0,
    ast: 1,
    heatmap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
    flagIso2: 'us',
    imageUrl: '/player-cards/william.png',
    // Mobile: Bottom row, right | Desktop: Original
    positionClass: 'bottom-[5%] right-[15%] md:top-[40%] md:left-[8%] md:right-auto md:bottom-auto',
    rotation: 2,
    delay: 0.8,
    scale: 0.38,
    badges: [
      { tier: 'S' as BadgeTier, playstyle: 'wall' as PlaystyleType },
      { tier: 'A' as BadgeTier, playstyle: 'anchor' as PlaystyleType },
      { tier: 'B' as BadgeTier, playstyle: 'clutch' as PlaystyleType },
    ]
  },
];

// ... (CardContent component)



import { ElectricBorder } from './ElectricBorder';
import { FreezeBorder } from './FreezeBorder';
import { AmbientGlowBorder } from './AmbientGlowBorder';

const CardContent: React.FC<{
  name: string;
  position: string;
  level: number;
  age: number;
  height: number;
  foot: string;
  gms: number;
  gls: number;
  ast: number;
  heatmap: number[];
  flagIso2: string;
  imageUrl: string;
  badges?: PlayerBadge[];
}> = ({ name, position, level, age, height, foot, gms, gls, ast, heatmap, flagIso2, imageUrl, badges = [] }) => {
  return (
    <div className="relative w-full h-full">
      {/* Individual Badge Ribbons - Curve behind card immediately at edge */}
      {badges && badges.length > 0 && (
        <div className="absolute left-0 top-1/2 z-50 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
          {badges.map((badge, index) => {
            const getIcon = (playstyle: PlaystyleType) => {
              switch (playstyle) {
                case 'wall': return <Shield className="w-full h-full" />;
                case 'speed': return <Zap className="w-full h-full" />;
                case 'playmaker': return <Users className="w-full h-full" />;
                case 'finisher': return <Target className="w-full h-full" />;
                case 'anchor': return <Lock className="w-full h-full" />;
                case 'engine': return <TrendingUp className="w-full h-full" />;
                case 'clutch': return <Award className="w-full h-full" />;
                case 'lockdown': return <Radio className="w-full h-full" />;
                case 'poacher': return <Flame className="w-full h-full" />;
                case 'dribbler': return <Wind className="w-full h-full" />;
                case 'tactician': return <Brain className="w-full h-full" />;
                case 'aerial': return <Mountain className="w-full h-full" />;
                case 'sniper': return <Crosshair className="w-full h-full" />;
                case 'press': return <Eye className="w-full h-full" />;
                case 'striker': return <Sword className="w-full h-full" />;
                case 'rock': return <Heart className="w-full h-full" />;
                case 'speedster': return <Rocket className="w-full h-full" />;
                case 'vision': return <Headphones className="w-full h-full" />;
              }
            };

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  top: `${(index - (badges.length - 1) / 2) * 38}px`,
                  left: '0px',
                }}
              >
                <div className="relative" style={{ width: '50px', height: '32px', left: '-3px', zIndex: 998 }}>
                  {/* Animated glow */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '20px',
                      height: '100%',
                      zIndex: 999,
                      background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
                      transform: 'skew(20deg)',
                      animation: 'ribbonGlow 1.5s linear infinite',
                    }}
                  />

                  {/* Main ribbon front */}
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: '#f59e0b',
                      height: '32px',
                      width: '50px',
                      left: '-3px',
                      zIndex: 2,
                      boxShadow: '0px 0px 4px rgba(0,0,0,0.55)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)',
                    }}
                  >
                    {/* Icon */}
                    <div className="w-5 h-5 text-black flex items-center justify-center">
                      {getIcon(badge.playstyle)}
                    </div>
                  </div>

                  {/* Top left edge */}
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      left: '-3px',
                      top: '-2px',
                      width: 0,
                      height: 0,
                      borderStyle: 'solid',
                      borderWidth: '2px 3px 0 0',
                      borderColor: 'transparent #b45309 transparent transparent'
                    }}
                  />

                  {/* Bottom left edge */}
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      left: '-3px',
                      top: '32px',
                      width: 0,
                      height: 0,
                      borderStyle: 'solid',
                      borderWidth: '0 3px 0px 0',
                      borderColor: 'transparent #b45309 transparent transparent'
                    }}
                  />

                  {/* Top right edge */}
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      left: '44px',
                      top: '0px',
                      width: 0,
                      height: 0,
                      borderStyle: 'solid',
                      borderWidth: '0px 0 0 3px',
                      borderColor: 'transparent transparent transparent #b45309'
                    }}
                  />

                  {/* Bottom right edge */}
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      left: '44px',
                      top: '32px',
                      width: 0,
                      height: 0,
                      borderStyle: 'solid',
                      borderWidth: '0 0 2px 3px',
                      borderColor: 'transparent transparent #b45309 transparent'
                    }}
                  />
                </div>

                <style>{`
                  @keyframes ribbonGlow {
                    0% { left: -10px; opacity: 0; }
                    50% { left: 15px; opacity: 0.3; }
                    100% { left: 35px; opacity: 0; }
                  }
                `}</style>
              </div>
            );
          })}
        </div>
      )}

      <div className="w-full h-full bg-[#0a0a0a] flex flex-col relative rounded-[30px] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_100%)] bg-[length:20px_20px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        {/* Top Section: Level & Flag */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none">
          <div className="font-display text-6xl font-bold text-lime leading-[0.8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {level}
          </div>
          <div className="font-mono text-[9px] text-lime/70 uppercase tracking-widest mt-1 text-center">
            LEVEL
          </div>
          <div className="font-display text-xl font-bold text-white text-center uppercase tracking-wide mt-1 drop-shadow-md">
            {position}
          </div>
        </div>

        <div className="absolute top-6 right-6 z-20 pointer-events-none">
          <div className="relative">
            {/* Sun Devils Badge - Absolute positioned to LEFT of flag */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-0 w-[55px] h-[55px] flex items-center justify-center animate-in fade-in zoom-in duration-300">
              <img
                src="/sd2.png"
                alt="Sun Devils"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            <div className="border-2 border-white/10 p-0.5 bg-black/40 backdrop-blur-sm shadow-lg min-w-[44px] min-h-[28px] flex items-center justify-center rounded">
              {flagIso2 ? (
                <img
                  src={`https://flagcdn.com/w80/${flagIso2.toLowerCase()}.png`}
                  alt="flag"
                  className="w-10 h-auto block"
                />
              ) : (
                <Globe className="text-white/50 w-6 h-6" strokeWidth={1.5} />
              )}
            </div>
          </div>
        </div>

        {/* Player Image */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className={`w-full h-full object-cover contrast-125 ${name === 'JULIAN' ? 'object-[25%_5%]' : name === 'AMMAR' ? 'object-[50%_15%]' : (name === 'WILLIAM' || name === 'HASSAN') ? 'object-[50%_35%]' : name === 'RODRI' ? 'object-[50%_10%]' : ''}`}
          />
        </div>

        {/* Info Section (Bottom Third) */}
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#050f0d] via-[#0a1a17] to-transparent flex flex-col justify-end p-5 z-10 pointer-events-none">

          {/* Name */}
          <div className="mb-4 text-center relative">
            <h2 className="font-display text-4xl font-bold text-white uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{name}</h2>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent mt-2"></div>
          </div>

          {/* Primary Stats (GMS/GLS/AST) */}
          <div className="flex justify-between px-4 mb-4">
            <div className="text-center">
              <span className="font-display font-bold text-white text-xl block leading-none">{gms}</span>
              <span className="text-[9px] font-mono text-lime uppercase">GMS</span>
            </div>
            <div className="text-center">
              <span className="font-display font-bold text-white text-xl block leading-none">{gls}</span>
              <span className="text-[9px] font-mono text-lime uppercase">GLS</span>
            </div>
            <div className="text-center">
              <span className="font-display font-bold text-white text-xl block leading-none">{ast}</span>
              <span className="text-[9px] font-mono text-lime uppercase">AST</span>
            </div>
          </div>

          {/* Bio Grid (Age/Ht/Foot + Mini Map) */}
          <div className="grid grid-cols-4 gap-2 items-center border-t border-white/5 pt-3">
            <div className="text-center border-r border-white/5">
              <span className="font-display font-bold text-gray-300 text-sm block">{age}</span>
              <span className="text-[8px] font-mono text-gray-500 uppercase">AGE</span>
            </div>
            <div className="text-center border-r border-white/5">
              <span className="font-display font-bold text-gray-300 text-sm block">{height}</span>
              <span className="text-[8px] font-mono text-gray-500 uppercase">CM</span>
            </div>
            <div className="text-center border-r border-white/5">
              <span className="font-display font-bold text-gray-300 text-sm block">{foot}</span>
              <span className="text-[8px] font-mono text-gray-500 uppercase">FT</span>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-[1px] w-[20px] h-[25px] opacity-80">
                {heatmap.map((level, i) => (
                  <div
                    key={i}
                    className={`w-full h-full ${level === 0 ? 'bg-white/10' :
                      level === 1 ? 'bg-lime' :
                        level === 2 ? 'bg-yellow-500' : 'bg-red-600'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Holographic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 pointer-events-none z-30"></div>
      </div>
    </div>
  );
};

// Wrapper component to handle different border styles based on player name
const CardWrapper: React.FC<{
  card: typeof scatteredCards[0];
  responsiveClass: string;
  wrapperStyle: React.CSSProperties;
}> = ({ card, responsiveClass, wrapperStyle }) => {
  const { name } = card;

  if (name === 'AMMAR') {
    return (
      <div className={responsiveClass} style={wrapperStyle}>
        <div className="scale-[0.35] md:scale-100 origin-center transition-transform duration-500">
          <div className="w-[340px] h-[540px] overflow-visible">
            <ElectricBorder>
              <CardContent {...card} />
            </ElectricBorder>
          </div>
        </div>
      </div>
    );
  }

  if (name === 'AHMAD') {
    return (
      <div className={responsiveClass} style={wrapperStyle}>
        <div className="scale-[0.35] md:scale-100 origin-center transition-transform duration-500">
          <div className="w-[340px] h-[540px] overflow-visible">
            <BinaryBorder>
              <CardContent {...card} />
            </BinaryBorder>
          </div>
        </div>
      </div>
    );
  }

  if (name === 'JULIAN') {
    return (
      <div className={responsiveClass} style={wrapperStyle}>
        <div className="scale-[0.35] md:scale-100 origin-center transition-transform duration-500">
          <div className="w-[340px] h-[540px] overflow-visible">
            <FreezeBorder>
              <CardContent {...card} />
            </FreezeBorder>
          </div>
        </div>
      </div>
    );
  }

  if (name === 'RODRI') {
    return (
      <div className={responsiveClass} style={wrapperStyle}>
        <div className="scale-[0.35] md:scale-100 origin-center transition-transform duration-500">
          <div className="w-[340px] h-[540px] overflow-visible">
            <AmbientGlowBorder>
              <CardContent {...card} />
            </AmbientGlowBorder>
          </div>
        </div>
      </div>
    );
  }

  if (name === 'WILLIAM') {
    return (
      <div className={responsiveClass} style={wrapperStyle}>
        <div className="scale-[0.35] md:scale-100 origin-center transition-transform duration-500">
          <div className="w-[340px] h-[540px] overflow-visible">
            <AmbientGlowBorder color1="#FFD700" color2="#CD7F32">
              <CardContent {...card} />
            </AmbientGlowBorder>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={responsiveClass} style={wrapperStyle}>
      <div className="scale-[0.35] md:scale-100 origin-center transition-transform duration-500">
        <div className="relative w-[340px] h-[540px] rounded-[32px] p-[2px] bg-gradient-to-b from-[#333] via-[#222] to-lime/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-visible">
          <CardContent {...card} />
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ onCreateCard }) => {
  const topCards = scatteredCards.slice(0, 3);
  const bottomCards = scatteredCards.slice(3, 5);

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col px-4 py-4 md:py-12">

      {/* Ambient Glow - Needs overflow hidden wrapper to prevent scrollbars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-lime/5 rounded-full blur-[100px]" />
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden flex flex-col h-[100dvh] overflow-hidden justify-between pb-0">

        {/* Top 2 Cards - Extremely Compact */}
        <div className="relative w-full h-[150px] mt-2 mb-0 overflow-visible z-50">
          {scatteredCards.filter(c => c.name !== 'JULIAN').slice(0, 2).map((card, index) => {
            // Very small cards
            const positions = [
              { left: '5%', top: '0px', scale: 0.29, rotation: 6, zIndex: 1 },
              { left: '60%', top: '0px', scale: 0.28, rotation: -5, zIndex: 2 }
            ];

            const pos = positions[index];

            return (
              <CardWrapper
                key={index}
                card={card}
                responsiveClass="absolute transition-transform duration-500 hover:scale-105 z-[60]"
                wrapperStyle={{
                  left: pos.left,
                  top: pos.top,
                  transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
                  transformOrigin: 'top left',
                  zIndex: 60
                }}
              />
            );
          })}
        </div>

        {/* Middle Content Wrapper - Groups Text & Button to keep them close */}
        <div className="flex-1 flex flex-col justify-center items-center w-full z-20 gap-2">

          {/* Headlines & Alert */}
          <div className="flex flex-col items-center px-4 w-full">
            {/* Tag */}
            <div className="flex items-center gap-1 mb-1 opacity-80">
              <div className="w-0.5 h-0.5 bg-lime"></div>
              <span className="font-mono text-[7px] text-lime uppercase tracking-wider font-bold">ASU / 2026_SEASON_PREVIEW</span>
            </div>

            {/* Headline - Minimal */}
            <h1 className="font-display text-[8vw] font-bold uppercase leading-[0.75] tracking-tighter text-center text-white mix-blend-overlay opacity-40 select-none whitespace-nowrap">
              HIT THE FIELD
            </h1>
            <h1 className="font-display text-[8vw] font-bold uppercase leading-[0.75] tracking-tighter text-center text-lime -mt-1 drop-shadow-[0_0_20px_rgba(180,241,86,0.15)] whitespace-nowrap">
              SCORE BIG
            </h1>

            {/* System Migration Alert - Minimal */}
            <div className="w-full max-w-sm mt-2 mb-1.5">
              <div className="bg-lime p-1.5 flex items-start gap-1.5 shadow-lg shadow-lime/10">
                <AlertCircle className="w-3 h-3 text-black shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="text-black font-display font-bold uppercase text-[9px] leading-none mb-0.5">System Migration</p>
                  <p className="text-black font-medium text-[7px] leading-tight uppercase">
                    We are leaving WhatsApp. Join the new hub for pickup soccer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email + Button - Minimal */}
          <div className="px-4 pb-1 z-50 relative w-full max-w-sm">
            <button
              onClick={onCreateCard}
              className="w-full bg-white hover:bg-gray-200 text-black px-3 py-2.5 font-display font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 group shadow-lg"
            >
              <span>Create Card</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-700 justify-center">
              <Fingerprint size={16} className="text-lime" />
              Own Your Card
            </p>
          </div>
        </div>

        {/* Bottom 2 Cards - Extremely Compact */}
        <div className="relative w-full h-[140px] mb-44 overflow-visible">
          {scatteredCards.filter(c => c.name !== 'JULIAN').slice(2, 4).map((card, index) => {
            // Very small cards
            const positions = [
              { left: '55%', top: '0px', scale: 0.34, rotation: 7, zIndex: 1 },
              { left: '8%', top: '10px', scale: 0.28, rotation: 2, zIndex: 2 }
            ];

            const pos = positions[index];

            return (
              <CardWrapper
                key={index}
                card={card}
                responsiveClass="absolute transition-transform duration-500 hover:scale-105 z-50"
                wrapperStyle={{
                  left: pos.left,
                  top: pos.top,
                  transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
                  transformOrigin: 'top left',
                  zIndex: 50
                }}
              />
            );
          })}
        </div>

      </div>

      {/* Desktop: Scattered Cards - MOVED TO END for stacking context */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
        {scatteredCards.map((card, index) => (
          <CardWrapper
            key={index}
            card={card}
            responsiveClass={`absolute ${card.positionClass} transition-transform duration-700 hover:scale-105 z-0`}
            wrapperStyle={{}}
          />
        ))}
      </div>

      {/* Desktop Content - Restored Original Look */}
      <div className="relative z-10 hidden md:flex flex-col items-center justify-center min-h-[90vh] text-center pt-20">

        {/* Tag */}
        <div className="flex items-center gap-3 mb-8 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="w-2 h-2 bg-lime"></div>
          <span className="font-mono text-xs text-lime uppercase tracking-[0.3em] font-bold">ASU / 2026_SEASON_PREVIEW</span>
        </div>

        {/* Main Headline - Fixed Overlap */}
        <div className="relative mb-12 flex flex-col items-center">
          <h1 className="font-display text-[10vw] lg:text-[9rem] font-bold uppercase leading-[0.85] tracking-tighter text-white mix-blend-overlay opacity-40 select-none animate-in fade-in zoom-in duration-1000">
            HIT THE FIELD
          </h1>
          <h1 className="font-display text-[10vw] lg:text-[9rem] font-bold uppercase leading-[0.85] tracking-tighter text-lime animate-pulse-slow -mt-[2vw] lg:-mt-[2rem]">
            SCORE BIG
          </h1>
        </div>

        {/* System Migration Alert */}
        <div className="w-full max-w-xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="bg-lime p-4 flex items-start gap-4 shadow-[0_0_30px_rgba(180,241,86,0.2)] border border-lime/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 blur-[30px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/30 transition-colors"></div>
            <AlertCircle className="w-6 h-6 text-black shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="text-left relative z-10">
              <p className="text-black font-display font-bold uppercase text-lg leading-none mb-1">System Migration</p>
              <p className="text-black font-medium text-xs leading-tight uppercase tracking-wide">
                We are leaving WhatsApp. Join the new hub for pickup soccer.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onCreateCard}
          className="group relative px-12 py-6 bg-white text-black font-display font-bold text-xl uppercase tracking-widest hover:bg-lime transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(180,241,86,0.3)] animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500"
        >
          <span className="relative z-10 flex items-center gap-3">
            Create Your Card
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors"></div>
        </button>

        <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-700">
          <Fingerprint size={16} className="text-lime" />
          Own Your Card
        </p>
      </div>

      {/* Footer Ticker */}
      <div className="absolute bottom-16 w-full border-t border-white/10 bg-[#050f0d]/80 backdrop-blur-sm py-1 md:py-2 z-[70]">
        <div className="flex space-x-8 md:space-x-12 animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-4 opacity-50">
              <span className="text-[9px] md:text-xs font-mono text-white uppercase">PLAY PICKUP</span>
              <span className="text-[8px] md:text-[10px] text-lime">●</span>
              <span className="text-[9px] md:text-xs font-mono text-white uppercase">GET RATED</span>
              <span className="text-[8px] md:text-[10px] text-lime">●</span>
              <span className="text-[9px] md:text-xs font-mono text-white uppercase">EARN REWARDS</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};