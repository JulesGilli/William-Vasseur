import { asset } from '../lib/asset';

export interface GalleryImage {
  src: string;
  /** Shown in the carousel chrome and used to name the downloaded file. */
  label: string;
  /** Native pixel size, so the viewer can state what is being taken away. */
  size: string;
}

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
  /**
   * Tailwind aspect utility for this piece's frames. Set it when the artwork
   * is not landscape, or a portrait still ends up boxed inside a wide frame.
   */
  frameAspect?: string;
  /** Production stages, scrubbed through under the piece. */
  stages?: ProcessStage[];
  /** Finished artwork, browsable and downloadable in place of a 3D viewer. */
  gallery?: GalleryImage[];
  /**
   * Gaussian splat of the scene, opened full-screen from the project. The
   * button only appears on pieces that have one.
   */
  world?: SplatWorld;
}

export interface SplatWorld {
  src: string;
  /**
   * Trainers emit Y-down, so a captured splat arrives upside down and has to
   * be turned over. One derived from a mesh is already the right way up.
   */
  upright?: boolean;
  /**
   * Idle camera path until the visitor takes over: 'orbit' circles an object,
   * 'walk' wanders into an environment. Defaults to 'orbit'.
   */
  travel?: 'orbit' | 'walk';
  /** Where the camera starts, for scenes whose interest is not at the origin. */
  eye?: [number, number, number];
  /** What the starting camera looks at. */
  look?: [number, number, number];
  /** Vertical field of view; environments want a wider one than objects. */
  fov?: number;
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
  software: 'Blender',
  description:
  'A drifting shard of bark, moss and quartz in bloom. The study that set the direction for everything since — technology used to look at nature closely.',
  image: asset('/models/posters/mossy-log.webp'),
  model: asset('/models/mossy-log.glb'),
  spec: 'GLB · 25K TRIS',
  // Sampled from the Blooming Crystals mesh (tools/mesh-to-splat.mjs) rather
  // than trained from photographs, so it needs no flip.
  world: { src: asset('/models/bloom-fragment.sog'), upright: true }
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
  // "Forest path" by tanha (superspl.at/scene/2be1a75a, CC BY 4.0) while we
  // test navigation. Set in .env.development.local and undefined in any build,
  // so the button stays hidden in production until this piece has its own splat.
  // No `upright`: SuperSplat publishes in the trainer's Y-down convention
  // (checked against their own viewer), so the default flip applies.
  // Start pose lifted from the scene's published settings.json, so the walk
  // opens on the path exactly like the SuperSplat viewer does.
  world: import.meta.env.VITE_WORLD_NAVANA ?
  {
    src: import.meta.env.VITE_WORLD_NAVANA,
    travel: 'walk' as const,
    eye: [0.105, 0.2, -3.116] as [number, number, number],
    look: [0.037, 0.322, -0.958] as [number, number, number],
    fov: 60
  } :
  undefined,
  gallery: [
  {
    src: asset('/gallery/navana-landscape.webp'),
    label: 'Landscape',
    size: '1920 × 1080'
  },
  {
    src: asset('/gallery/navana-concept.webp'),
    label: 'Concept',
    size: '862 × 1480'
  }],

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

},
{
  id: 'navana-desert',
  ref: 'PRJ—003',
  title: 'Navana / Desert',
  category: 'Environment',
  year: '2026',
  software: 'Blender · Cycles',
  description:
  'The dry side of the same world. Ribbon trunks arc over red rock and shallow pools, with a second planet sitting low behind the ridge.',
  image: asset('/process/desert-render.webp'),
  spec: 'Still · 1080 × 1920',
  frameAspect: 'aspect-[3/4]',
  gallery: [
  {
    src: asset('/gallery/desert-portrait.webp'),
    label: 'Portrait',
    size: '1080 × 1920'
  },
  {
    src: asset('/gallery/desert-clown.webp'),
    label: 'Clown pass',
    size: '912 × 1622'
  }],

  stages: [
  {
    index: '01',
    label: 'Clown pass',
    tool: 'Blender · random colour',
    caption:
    'Every asset gets its own flat colour. Nothing to do with the final look — it is there to check that each element still reads as separate once they overlap.',
    image: asset('/process/desert-clown.webp')
  },
  {
    index: '02',
    label: 'Render',
    tool: 'Blender · Cycles',
    caption:
    'Shaded, lit and graded from the same camera, so the two passes can be read against each other.',
    image: asset('/process/desert-render.webp')
  }]

}];
