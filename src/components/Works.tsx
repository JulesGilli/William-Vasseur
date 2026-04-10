import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ThreeCanvas } from './ThreeCanvas';
import { ProjectModal } from './ProjectModal';
const projects = [
{
  id: '01',
  title: 'METAMORPHOSIS',
  category: 'MOTION DESIGN',
  year: '2025',
  geometry: 'box' as const,
  color: '#ff0000',
  description:
  'An exploration of form transformation through procedural animation. This piece deconstructs the rigid geometry of a cube into organic, fluid motion — challenging the boundary between digital precision and natural chaos.',
  details:
  'Created as a real-time WebGL experience, METAMORPHOSIS uses vertex displacement shaders to morph between geometric states. The animation responds to audio input, creating a synesthetic bridge between sound and form.',
  tools: ['Three.js', 'GLSL', 'WebGL', 'Blender', 'Houdini']
},
{
  id: '02',
  title: 'DIGITAL RUINS',
  category: 'ENVIRONMENT',
  year: '2025',
  geometry: 'octahedron' as const,
  color: '#ffffff',
  description:
  'A meditation on digital decay. Architectural forms dissolve into data fragments, questioning the permanence of our virtual constructions. What remains when the servers go dark?',
  details:
  'Built using photogrammetry scans of brutalist architecture, then procedurally destroyed through custom simulation tools. The octahedral structure represents the crystalline nature of data storage.',
  tools: ['Unreal Engine', 'Megascans', 'ZBrush', 'Substance']
},
{
  id: '03',
  title: 'VOID ARCHITECTURE',
  category: 'ARCHITECTURAL VIZ',
  year: '2024',
  geometry: 'torus' as const,
  color: '#00ff41',
  description:
  'Impossible structures that exist only in computational space. VOID ARCHITECTURE proposes buildings that defy physics — spaces that fold into themselves, corridors that loop infinitely.',
  details:
  'Each structure was generated using L-system algorithms and then refined manually. The torus form represents the cyclical nature of architectural innovation — every revolution brings us back to fundamental questions of space and shelter.',
  tools: ['Rhino', 'Grasshopper', 'V-Ray', 'TouchDesigner']
},
{
  id: '04',
  title: 'NEURAL GARDEN',
  category: 'GENERATIVE ART',
  year: '2024',
  geometry: 'dodecahedron' as const,
  color: '#ff0000',
  description:
  'A living digital ecosystem where artificial neural networks grow, evolve, and die in real-time. Each node is a neuron, each connection a synapse firing in the void.',
  details:
  'NEURAL GARDEN uses a custom implementation of cellular automata combined with neural network visualization. The dodecahedral geometry was chosen for its relationship to natural forms found in radiolaria and virus capsids.',
  tools: ['Python', 'TensorFlow', 'Three.js', 'GLSL', 'Processing']
}];

interface WorksProps {
  scrollY: number;
}
export function Works({ scrollY }: WorksProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-10%'
  });
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null>(
    null);
  return (
    <>
      <section
        ref={ref}
        className="w-full py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[rgba(255,255,255,0.1)]">
        
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between mb-16 border-b border-[rgba(255,255,255,0.1)] pb-8">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">
              <span className="text-red-600 text-4xl align-top mr-4 font-mono">
                [01]
              </span>
              SELECTED WORKS
            </h2>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) =>
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              scrollY={scrollY}
              onClick={() => setSelectedProject(project)} />

            )}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)} />
      
    </>);

}
function ProjectCard({
  project,
  index,
  scrollY,
  onClick





}: {project: (typeof projects)[0];index: number;scrollY: number;onClick: () => void;}) {
  const cardRef = useRef(null);
  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0,
        y: 50
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1
      }}
      viewport={{
        once: true
      }}
      onClick={onClick}
      className="group relative border-2 border-[rgba(255,255,255,0.2)] hover:border-red-600 transition-colors duration-300 h-[500px] flex flex-col bg-[#0a0a0a] cursor-hover"
      style={{
        cursor: 'pointer'
      }}>
      
      {/* 3D Canvas Container */}
      <div className="flex-1 relative overflow-hidden w-full">
        <div className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          <ThreeCanvas
            geometryType={project.geometry}
            wireframe={true}
            color={project.color === '#ff0000' ? '#ff0000' : '#ffffff'}
            scrollProgress={scrollY * 0.0005}
            speed={2} />
          
        </div>

        {/* Overlay Info */}
        <div className="absolute top-4 right-4 font-mono text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
          FIG.{project.id} // RENDER_MODE: WIREFRAME // RENDER_MODE: WIREFRAME
          // RENDER_MODE: WIREFRAME // RENDER_MODE: WIREFRAME
        </div>

        {/* Click Hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="border border-white/40 px-6 py-3 bg-black/60 backdrop-blur-sm">
            <span className="text-sm font-mono tracking-widest uppercase text-white">
              View Project →
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 border-t-2 border-[rgba(255,255,255,0.2)] bg-[#0a0a0a] relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight group-hover:text-red-500 transition-colors">
            {project.title}
          </h3>
          <span className="font-mono text-sm text-gray-500">
            {project.year}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono tracking-[0.2em] text-gray-400 uppercase">
            {project.category}
          </span>
          <span className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300 text-sm font-mono">
            OPEN →
          </span>
        </div>
      </div>
    </motion.div>);

}