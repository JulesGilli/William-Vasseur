import { asset } from '../lib/asset';
import { content, site } from './content';

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

/**
 * The families the work is filed under. Fixed rather than derived from what
 * happens to be on the sheet, so the filters describe the body of work William
 * is building — an empty one says "nothing here yet" rather than not existing.
 */
export const categories = ["Nature", "Civilisation", "Characters"] as const;

export type Category = (typeof categories)[number];

export interface Project {
  id: string;
  ref: string;
  title: string;
  category: Category;
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
  /**
   * Where the finished render can be bought, by product id in `products`.
   * Only the forms named here get a button, so a piece sold as a print and
   * not as a figurine offers one link, and a piece sold as neither offers
   * none.
   */
  shop?: {poster?: string;figurine?: string;};
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
 * The piece the home page leads on. Deliberately not a `projects` entry: the
 * hero is a shop window and the sheet below it is the catalogue, so putting
 * the signature model in both would list the same piece twice.
 */
export const heroPiece = {
  title: site.hero.piece.title,
  spec: site.hero.piece.spec,
  model: asset(site.hero.piece.model),
  image: asset(site.hero.piece.poster)
};

/**
 * The bench the splat viewer is exercised on: "Forest path" by tanha
 * (superspl.at/scene/2be1a75a, CC BY 4.0). Set in .env.development.local and
 * undefined in any build, so it never reaches the public site — the licence
 * is fine for local work but this is not our asset to publish. Splatting is
 * parked for a future piece; see docs/gaussian-splatting.md.
 */
const benchWorld: SplatWorld | undefined = import.meta.env.VITE_WORLD_NAVANA ?
{
  src: import.meta.env.VITE_WORLD_NAVANA,
  travel: 'walk',
  // Published pose raised a touch: the capture's own camera hugs the ground.
  eye: [0.105, 0.6, -3.116],
  look: [0.037, 0.72, -0.958],
  fov: 60
} :
undefined;

/**
 * Portfolio work only, in the order William set. The pieces sold as prints,
 * figurines and dioramas live in `products`, so the Projects sheet stays a
 * body of work rather than a second shop window.
 */
export const projects: Project[] = content.projects.map((p) => ({
  id: p.id,
  ref: p.ref,
  title: p.title,
  category: p.category as Category,
  year: p.year,
  software: p.software,
  description: p.description,
  image: asset(p.poster),
  model: p.model ? asset(p.model) : undefined,
  spec: p.spec,
  // Empty lists stay undefined: the sheet treats "no renders" and "no stages"
  // as reasons to fall back, not as things to draw empty.
  gallery: p.renders.length ? p.renders.map((r) => ({ ...r, src: asset(r.src) })) : undefined,
  stages: p.stages.length ? p.stages.map((s) => ({ ...s, image: asset(s.image) })) : undefined,
  shop: p.shop_poster || p.shop_figurine ?
  { poster: p.shop_poster ?? undefined, figurine: p.shop_figurine ?? undefined } :
  undefined,
  world: p.id === 'navana' ? benchWorld : undefined
}));
