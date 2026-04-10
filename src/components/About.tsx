import React from 'react';
import { motion } from 'framer-motion';
import { ThreeCanvas } from './ThreeCanvas';
interface AboutProps {
  scrollY: number;
}
export function About({ scrollY }: AboutProps) {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[rgba(255,255,255,0.1)] bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-baseline mb-16">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">
            <span className="text-red-600 text-4xl align-top mr-4 font-mono">
              [02]
            </span>
            ABOUT
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <motion.p
              initial={{
                opacity: 0,
                x: -50
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.6
              }}
              viewport={{
                once: true
              }}
              className="text-xl md:text-2xl leading-relaxed font-mono text-gray-300">
              
              I'm William VASSEUR — a 3D artist driven by curiosity and a deep
              passion for new technologies. I create digital worlds that blur
              the line between the tangible and the virtual.
            </motion.p>

            <motion.p
              initial={{
                opacity: 0,
                x: -50
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.6,
                delay: 0.2
              }}
              viewport={{
                once: true
              }}
              className="text-base md:text-lg leading-relaxed text-gray-400">
              
              From real-time WebGL experiments to cinematic renders, I embrace
              every tool that pushes creative boundaries — AI-assisted
              workflows, procedural generation, immersive XR experiences.
              Technology isn't just a medium; it's the material I sculpt with.
            </motion.p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[rgba(255,255,255,0.1)]">
              {[
              {
                label: 'PROJECTS',
                value: '47'
              },
              {
                label: 'TECHNOLOGIES',
                value: '15'
              },
              {
                label: 'YEARS XP',
                value: '08'
              }].
              map((stat, i) =>
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.1
                }}
                viewport={{
                  once: true
                }}>
                
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-red-500 tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* 3D Visual */}
          <div className="h-[400px] md:h-[600px] w-full relative border-2 border-[rgba(255,255,255,0.1)]">
            <div className="absolute top-2 left-2 text-xs font-mono text-green-500">
              RENDER_TARGET: TORUS_KNOT
            </div>
            <ThreeCanvas
              geometryType="torusKnot"
              wireframe={true}
              color="#ff0000"
              scrollProgress={scrollY * 0.001}
              speed={0.5} />
            

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
          </div>
        </div>
      </div>
    </section>);

}