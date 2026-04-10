import React from 'react';
import { motion } from 'framer-motion';
import { ThreeCanvas } from './ThreeCanvas';
import { GlitchText } from './GlitchText';
interface HeroProps {
  scrollY: number;
}
export function Hero({ scrollY }: HeroProps) {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden border-b-2 border-[rgba(255,255,255,0.1)]">
      {/* Background 3D Element */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ThreeCanvas
          geometryType="sphere"
          wireframe={true}
          color="#ffffff"
          scrollProgress={scrollY * 0.001}
          speed={0.5} />
        
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
        {/* Top Metadata */}
        <div className="absolute top-8 left-8 hidden md:block">
          <p className="text-xs font-mono text-green-500 tracking-widest">
            SYSTEM.INIT(2026)
          </p>
        </div>

        <div className="absolute top-8 right-8 hidden md:block">
          <p className="text-xs font-mono text-green-500 tracking-widest">
            STATUS: ONLINE
          </p>
        </div>

        {/* Main Title */}
        <div className="w-full text-center mix-blend-difference">
          <motion.div
            initial={{
              opacity: 0,
              y: 100
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}>
            
            <GlitchText
              text="WILLIAM"
              as="h1"
              className="text-[15vw] md:text-[12vw] leading-[0.85] font-black tracking-tighter text-white select-none" />
            
            <GlitchText
              text="VASSEUR"
              as="h1"
              className="text-[15vw] md:text-[12vw] leading-[0.85] font-black tracking-tighter text-white select-none" />
            
          </motion.div>

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.5,
              duration: 0.8
            }}
            className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
            
            <span className="h-[2px] w-12 bg-red-600 hidden md:block"></span>
            <p className="text-lg md:text-2xl font-mono tracking-widest uppercase text-gray-400">
              3D Artist —{' '}
              <span className="text-red-500">Lover of New Technologies</span>
            </p>
            <span className="h-[2px] w-12 bg-red-600 hidden md:block"></span>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2
        }}>
        
        <p className="text-[10px] tracking-[0.3em] text-white uppercase">
          Scroll
        </p>
        <div className="w-[1px] h-12 bg-gradient-to-b from-red-500 to-transparent"></div>
      </motion.div>

      {/* Coordinates */}
      <div className="absolute bottom-8 right-8 font-mono text-xs text-green-500 hidden md:block">
        POS_Y: {scrollY.toFixed(0).padStart(4, '0')}
      </div>
    </section>);

}