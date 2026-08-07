import { asset } from '../lib/asset';

export interface ProcessStage {
  index: string;
  label: string;
  tool: string;
  caption: string;
  image: string;
}

export interface Project {
  id: string;
  ref: string;
  title: string;
  category: string;
  year: string;
  software: string;
  description: string;
  /** Still frame, rendered from the model itself where one exists. */
  image: string;
  /** Compressed glTF binary powering the inline viewer, when the piece has one. */
  model?: string;
  /** Technical caption shown in the viewer chrome. */
  spec: string;
  /** Production stages, scrubbed through under the piece. */
  stages?: ProcessStage[];
}

export const projects: Project[] = [
{
  id: 'mossy-log',
  ref: 'PRJ—001',
  title: 'Bloom Fragment',
  category: 'Environment',
  year: '2026',
  software: 'Blender · Meshy AI',
  description:
  'A drifting shard of bark, moss and quartz in bloom. The study that set the direction for everything since — technology used to look at nature closely.',
  image: asset('/models/posters/mossy-log.webp'),
  model: asset('/models/mossy-log.glb'),
  spec: 'GLB · 25K TRIS'
},
{
  id: 'clockwork-colossus',
  ref: 'PRJ—002',
  title: 'Clockwork Colossus',
  category: 'Character',
  year: '2026',
  software: 'Nomad Sculpt · Blender',
  description:
  'A six-limbed industrial giant, all pipes and pressure tanks. Sculpted for resin printing, so every overhang had to survive the real world.',
  image: asset('/models/posters/clockwork-colossus.webp'),
  model: asset('/models/clockwork-colossus.glb'),
  spec: 'GLB · 12K TRIS'
},
{
  id: 'crash-landed',
  ref: 'PRJ—003',
  title: 'Crash Landed / Planet Unknown',
  category: 'Diorama',
  year: '2025',
  software: 'Blender · Unreal Engine',
  description:
  'A freighter down on a dead world, hull split against the rock. Built at 1/144 as a physical diorama, then brought back into 3D.',
  image: asset('/models/posters/crash-landed.webp'),
  model: asset('/models/crash-landed.glb'),
  spec: 'GLB · 26K TRIS'
},
{
  id: 'canal-arches',
  ref: 'PRJ—004',
  title: 'Canal Arches of Seville',
  category: 'Architecture',
  year: '2026',
  software: 'Blender · DaVinci Resolve',
  description:
  'Terraced arcades stacked over still water, somewhere between an aqueduct and a hanging garden. Rendered for print, framed in oak.',
  image: asset('/models/posters/canal-arches.webp'),
  model: asset('/models/canal-arches.glb'),
  spec: 'GLB · 4K TRIS'
},
{
  id: 'navana',
  ref: 'PRJ—005',
  title: 'Navana',
  category: 'Environment',
  year: '2026',
  software: 'Blender · Cycles',
  description:
  'A canopy of fused mushroom crowns closing over a still pool. Built for the light: everything in the scene exists to catch the shafts coming through the gaps.',
  image: asset('/process/render.webp'),
  spec: 'Still · 1920 × 1080',
  stages: [
  {
    index: '01',
    label: 'Concept',
    tool: 'Painted study',
    caption:
    'A painted study first — the mood, the scale of the canopy and the palette get settled before a single vertex exists.',
    image: asset('/process/concept.webp')
  },
  {
    index: '02',
    label: 'Blockout',
    tool: 'Blender · solid view',
    caption:
    'Geometry only. Trunks, ground scatter and silhouettes are built and dressed in flat colour, so the composition can be judged without lighting hiding anything.',
    image: asset('/process/blockout.webp')
  },
  {
    index: '03',
    label: 'Render',
    tool: 'Blender · Cycles',
    caption:
    'Materials, volumetric light through the canopy, then a grade. Same camera as the blockout, so the two can be read against each other.',
    image: asset('/process/render.webp')
  }]

}];
