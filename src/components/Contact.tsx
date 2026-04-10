import React from 'react';
import { motion } from 'framer-motion';
import { ThreeCanvas } from './ThreeCanvas';
interface ContactProps {
  scrollY: number;
}
export function Contact({ scrollY }: ContactProps) {
  return (
    <section className="w-full min-h-screen flex flex-col justify-between py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background 3D */}
      <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-full opacity-20 pointer-events-none">
        <ThreeCanvas
          geometryType="icosahedron"
          wireframe={true}
          color="#00ff41"
          scrollProgress={scrollY * 0.002}
          speed={0.3} />
        
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-center">
        {/* Section Header */}
        <div className="flex items-baseline mb-16">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">
            <span className="text-red-600 text-4xl align-top mr-4 font-mono">
              [03]
            </span>
            CONTACT
          </h2>
        </div>

        <div className="space-y-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 50
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8
            }}
            viewport={{
              once: true
            }}>
            
            <p className="text-sm font-mono text-gray-400 mb-4 tracking-widest uppercase">
              Start a project
            </p>
            <a
              href="mailto:william@wvasseur.com"
              className="text-4xl md:text-7xl lg:text-8xl font-bold text-white hover:text-red-500 transition-colors break-all md:break-normal cursor-hover">
              
              WILLIAM@WVASSEUR.COM
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {[
            {
              name: 'INSTAGRAM',
              url: '#'
            },
            {
              name: 'BEHANCE',
              url: '#'
            },
            {
              name: 'ARTSTATION',
              url: '#'
            },
            {
              name: 'TWITTER',
              url: '#'
            },
            {
              name: 'LINKEDIN',
              url: '#'
            },
            {
              name: 'GITHUB',
              url: '#'
            }].
            map((social, i) =>
            <motion.a
              key={social.name}
              href={social.url}
              initial={{
                opacity: 0,
                x: -20
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.1
              }}
              viewport={{
                once: true
              }}
              className="group flex items-center space-x-4 border-b border-[rgba(255,255,255,0.1)] pb-4 hover:border-red-500 transition-colors cursor-hover">
              
                <span className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
                <span className="text-xl font-mono tracking-widest group-hover:text-white text-gray-400 transition-colors">
                  {social.name}
                </span>
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full pt-24 border-t border-[rgba(255,255,255,0.1)] mt-24 flex flex-col md:flex-row justify-between items-end md:items-center text-xs font-mono text-gray-500">
        <div>
          <p>© 2026 WILLIAM VASSEUR — ALL RIGHTS RESERVED</p>
          <p className="mt-1 text-red-900">WVASSEUR.COM // V.1.0</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p>3D ARTIST</p>
          <p>LOVER OF NEW TECHNOLOGIES</p>
        </div>
      </footer>
    </section>);

}