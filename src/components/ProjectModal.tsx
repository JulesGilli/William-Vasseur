import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { ThreeViewer } from './ThreeViewer';
interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  geometry:
  'box' |
  'sphere' |
  'torus' |
  'icosahedron' |
  'octahedron' |
  'dodecahedron' |
  'torusKnot';
  color: string;
  description: string;
  tools: string[];
  details: string;
}
interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;
  return (
    <AnimatePresence>
      {project &&
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          duration: 0.3
        }}>
        
          {/* Backdrop */}
          <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }} />
        

          {/* Modal Content */}
          <motion.div
          className="relative z-10 w-[95vw] max-w-6xl h-[90vh] max-h-[900px] bg-[#0a0a0a] border-2 border-[rgba(255,255,255,0.2)] flex flex-col lg:flex-row overflow-hidden"
          initial={{
            scale: 0.9,
            y: 40,
            opacity: 0
          }}
          animate={{
            scale: 1,
            y: 0,
            opacity: 1
          }}
          exit={{
            scale: 0.9,
            y: 40,
            opacity: 0
          }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
          }}>
          
            {/* Close Button */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 border border-[rgba(255,255,255,0.3)] flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors cursor-hover"
            style={{
              cursor: 'pointer'
            }}>
            
              <XIcon size={18} />
            </button>

            {/* 3D Viewer Side */}
            <div className="w-full lg:w-3/5 h-[50vh] lg:h-full relative border-b-2 lg:border-b-0 lg:border-r-2 border-[rgba(255,255,255,0.1)]">
              {/* Header Bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.1)] bg-[#0a0a0a]/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="text-red-500 font-mono text-xs">
                    FIG.{project.id}
                  </span>
                  <span className="text-green-500 font-mono text-[10px]">
                    RENDER_ENGINE: WEBGL
                  </span>
                </div>
                <div className="text-[10px] font-mono text-gray-500">
                  VERTICES:{' '}
                  {project.geometry === 'torusKnot' ?
                '4096' :
                project.geometry === 'torus' ?
                '1600' :
                '512'}
                </div>
              </div>

              <ThreeViewer
              geometryType={project.geometry}
              wireframe={true}
              color={project.color}
              className="w-full h-full" />
            
            </div>

            {/* Info Side */}
            <div className="w-full lg:w-2/5 h-auto lg:h-full overflow-y-auto p-6 lg:p-8 flex flex-col">
              {/* Project Number */}
              <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.2
              }}
              className="mb-2">
              
                <span className="text-red-500 font-mono text-6xl lg:text-8xl font-bold opacity-20">
                  {project.id}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.25
              }}
              className="text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2 -mt-8">
              
                {project.title}
              </motion.h2>

              {/* Category & Year */}
              <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.3
              }}
              className="flex items-center gap-4 mb-8 border-b border-[rgba(255,255,255,0.1)] pb-6">
              
                <span className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {project.year}
                </span>
              </motion.div>

              {/* Description */}
              <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.35
              }}
              className="mb-8">
              
                <h3 className="text-xs font-mono tracking-[0.3em] text-gray-400 uppercase mb-4">
                  [OVERVIEW]
                </h3>
                <p className="text-sm font-mono text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </motion.div>

              {/* Details */}
              <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.4
              }}
              className="mb-8">
              
                <h3 className="text-xs font-mono tracking-[0.3em] text-gray-400 uppercase mb-4">
                  [DETAILS]
                </h3>
                <p className="text-sm font-mono text-gray-400 leading-relaxed">
                  {project.details}
                </p>
              </motion.div>

              {/* Tools */}
              <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.45
              }}
              className="mb-8">
              
                <h3 className="text-xs font-mono tracking-[0.3em] text-gray-400 uppercase mb-4">
                  [TOOLS & TECH]
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) =>
                <span
                  key={tool}
                  className="text-xs font-mono border border-[rgba(255,255,255,0.2)] px-3 py-1 text-gray-300 uppercase tracking-wider">
                  
                      {tool}
                    </span>
                )}
                </div>
              </motion.div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom metadata */}
              <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                delay: 0.5
              }}
              className="border-t border-[rgba(255,255,255,0.1)] pt-4 mt-4 flex justify-between items-center">
              
                <span className="text-[10px] font-mono text-green-500">
                  STATUS: PUBLISHED
                </span>
                <span className="text-[10px] font-mono text-gray-600">
                  ID_{project.id}_REV.03
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}