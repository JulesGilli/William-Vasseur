/**
 * Usage: node tools/pull-content.mjs
 *
 * Runs before every build. Fetches what William has published — projects and
 * the home page's text — writes it to src/data/content.json, and brings every
 * uploaded file the content mentions into public/media/, optimising raw 3D
 * exports on the way with tools/optimise-model.mjs.
 *
 * The site never talks to the database at runtime: it is built from this
 * file, so it stays static, fast, and up while the database sleeps.
 *
 * Media references: a value starting with "/" is a file already in the
 * repository and passes through untouched; anything else is a key in the
 * "media" storage bucket, downloaded here and rewritten to "/media/<key>".
 *
 * When the database cannot be reached: in CI the build fails, so a stale
 * snapshot is never deployed over newer published content; locally it warns
 * and keeps the committed content.json, so the site still runs offline.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

// Both are public by design — the publishable key ships in every page.
const URL = process.env.SUPABASE_URL ?? 'https://jgxguuviojnwjideytyb.supabase.co';
const KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_BQ-X9n353xfbdy-CqFqeVg_0E4s2YXW';

const OUT = 'src/data/content.json';
const MEDIA = 'public/media';
const strict = Boolean(process.env.CI);

async function rest(path) {
  const res = await fetch(`${URL}/rest/v1/${path}`, { headers: { apikey: KEY } });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

/** Bring one storage object into public/media, once. Returns its site path. */
async function fetchMedia(key, { optimise = false } = {}) {
  const target = join(MEDIA, key);
  if (!existsSync(target)) {
    const res = await fetch(`${URL}/storage/v1/object/public/media/${encodeURI(key)}`);
    if (!res.ok) throw new Error(`media "${key}" → HTTP ${res.status}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(target), { recursive: true });

    if (optimise) {
      // A raw Blender export goes through the same pipeline as every model
      // already on the site, so an upload lands in the same weight class.
      const raw = join(tmpdir(), `raw-${process.pid}-${key.replace(/[^\w.-]/g, '_')}`);
      await writeFile(raw, bytes);
      execFileSync(process.execPath, ['tools/optimise-model.mjs', raw, target], { stdio: 'inherit' });
    } else {
      await writeFile(target, bytes);
    }
    console.log(`  media  ${key}${optimise ? ' (optimised)' : ''}`);
  }
  return `/media/${key}`;
}

const resolve = (ref, options) => (!ref || ref.startsWith('/') ? ref : fetchMedia(ref, options));

async function pull() {
  const [projects, blocks] = await Promise.all([
    rest('projects?select=*&published=eq.true&order=position'),
    rest('site_content?select=key,value')
  ]);

  const site = Object.fromEntries(blocks.map((b) => [b.key, b.value]));

  for (const p of projects) {
    p.poster = await resolve(p.poster);
    p.model = await resolve(p.model, { optimise: true });
    for (const r of p.renders) r.src = await resolve(r.src);
    for (const s of p.stages) s.image = await resolve(s.image);
  }

  if (site.hero?.piece) {
    site.hero.piece.poster = await resolve(site.hero.piece.poster);
    site.hero.piece.model = await resolve(site.hero.piece.model, { optimise: true });
  }
  if (site.about) site.about.portrait = await resolve(site.about.portrait);
  for (const s of site.process?.stages ?? []) {
    s.image = await resolve(s.image);
    if (s.video) s.video = await resolve(s.video);
  }

  // Only the fields the site renders: no timestamps, so an unchanged
  // publish produces an unchanged file.
  const clean = projects.map(({ updated_at, published, position, ...rest }) => rest);
  await writeFile(OUT, JSON.stringify({ projects: clean, site }, null, 2) + '\n');
  console.log(`content: ${clean.length} projects, ${blocks.length} text blocks → ${OUT}`);
}

try {
  await pull();
} catch (error) {
  if (strict) {
    console.error(`content: could not pull published content (${error.message}).`);
    console.error('Refusing to build from a snapshot that may be older than what is published.');
    process.exit(1);
  }
  console.warn(`content: ${error.message} — keeping the committed ${OUT}.`);
}
