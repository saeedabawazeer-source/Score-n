import React from 'react';
import { Calendar, Users, BarChart3, Bell, Trophy, MapPin } from 'lucide-react';

const featuresList = [
  {
    icon: MapPin,
    title: 'Find Pickup Games',
    description: 'Discover local drop-in matches happening tonight at campus fields or local parks.'
  },
  {
    icon: Users,
    title: 'Build Your Squad',
    description: 'Met some ballers at a pickup game? Add them to your roster for upcoming tournaments.'
  },
  {
    icon: Calendar,
    title: 'Schedule Matches',
    description: 'Set time, location, and field type in seconds. Sync with calendar automatically.'
  },
  {
    icon: BarChart3,
    title: 'Level Up',
    description: 'Input match results to earn XP. Increase your card level and unlock stat upgrades.'
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Push notifications for game changes, weather updates, and kickoff reminders.'
  },
  {
    icon: Trophy,
    title: 'Season Rewards',
    description: 'Play games to unlock exclusive card borders, hex-patterns, and cosmetic badges.'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-[#050f0d] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold uppercase text-white mb-4 tracking-tight">
            Play. <span className="text-lime">Upgrade.</span> <span className="text-white">Evolve.</span>
          </h2>
          <div className="h-1 w-20 bg-lime/50 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-lime/50 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(180,241,86,0.15)]"
            >
              <div className="w-12 h-12 bg-forest rounded-xl border border-white/10 flex items-center justify-center mb-6 group-hover:border-lime group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(180,241,86,0.3)] transition-all duration-300">
                <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-lime transition-colors" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-lime transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};