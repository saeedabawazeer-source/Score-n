import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PlayerCardCreator } from './components/PlayerCardCreator';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  const [showCardCreator, setShowCardCreator] = useState(false);

  const handleCreateCardClick = () => {
    setShowCardCreator(true);
    const element = document.getElementById('card-creator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-forest tech-grid font-sans selection:bg-lime selection:text-forest overflow-x-hidden text-white">
      <Header />
      
      <main className="pt-20">
        <Hero onCreateCard={handleCreateCardClick} />
        
        <div id="card-creator" className="scroll-mt-24">
            <PlayerCardCreator isActive={true} />
        </div>

        <Features />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}