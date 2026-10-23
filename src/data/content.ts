import raw from './content.json';
import type { Product } from '../lib/shop/types';

/**
 * Everything William edits, as the build pulled it from the database
 * (tools/pull-content.mjs). The site renders from this and nothing else, so
 * it never needs the database to be awake.
 *
 * Every media path here starts with "/": the pull rewrites uploaded files to
 * where it saved them under public/media, so `asset()` resolves all of them
 * the same way.
 */

export interface RenderRecord {
  src: string;
  label: string;
  size: string;
}

export interface StageRecord {
  index: string;
  label: string;
  tool: string;
  caption: string;
  image: string;
}

export interface ProjectRecord {
  id: string;
  ref: string;
  title: string;
  category: string;
  year: string;
  software: string;
  description: string;
  spec: string;
  poster: string;
  model: string | null;
  renders: RenderRecord[];
  stages: StageRecord[];
  shop_poster: string | null;
  shop_figurine: string | null;
}

export type ToolIcon = 'blender' | 'unreal' | 'resolve' | 'nomad';

export interface SiteContent {
  hero: {
    tagline: string;
    location: string;
    piece: {title: string;spec: string;model: string;poster: string;};
  };
  band: {words: string[];};
  about: {
    title: string;
    portrait: string;
    portraitLabel: string;
    paragraphs: string[];
    stats: {term: string;value: string;}[];
  };
  tools: {
    title: string;
    intro: string;
    tools: {name: string;role: string;icon: ToolIcon;}[];
  };
  process: {
    title: string;
    project: string;
    stages: {label: string;tool: string;caption: string;image: string;video?: string;}[];
  };
  physical: {title: string;intro: string;};
  cta: {title: string;text: string;button: string;};
  contact: {email: string;artstation: string;instagram: string;};
}

export interface ContentFile {
  projects: ProjectRecord[];
  site: SiteContent;
  /** The shop's catalogue at publish time, as the shop function serves it. */
  products: Product[];
}

export const content = raw as ContentFile;
export const site = content.site;
