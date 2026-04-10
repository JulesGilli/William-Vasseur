import React from 'react';
import { useScrollProgress } from './hooks/useScrollProgress';
import { GridOverlay } from './components/GridOverlay';
import { CustomCursor } from './components/CustomCursor';
import { Hero } from './components/Hero';
import { Works } from './components/Works';
import { About } from './components/About';
import { Contact } from './components/Contact';
export function App() {
  const { scrollY } = useScrollProgress();
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Global Elements */}
      <GridOverlay />
      <CustomCursor />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col w-full">
        <Hero scrollY={scrollY} />
        <Works scrollY={scrollY} />
        <About scrollY={scrollY} />
        <Contact scrollY={scrollY} />
      </main>

      {/* Fixed Debug Overlay */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-overlay opacity-20 hidden md:block">
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white"></div>
      </div>
    </div>);

}