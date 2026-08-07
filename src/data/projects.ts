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

/**
 * Portfolio work only. The pieces sold as prints, figurines and dioramas live
 * in `products` and are deliberately absent here, so the Projects sheet stays
 * a body of work rather than a second shop window.
 */
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
  id: 'navana',
  ref: 'PRJ—002',
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
