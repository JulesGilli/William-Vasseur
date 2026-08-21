/**
 * Usage:
 *   npm i --no-save @gltf-transform/core @gltf-transform/extensions \
 *                   @gltf-transform/functions sharp meshoptimizer
 *   node tools/optimise-model.mjs in.glb public/models/out.glb
 *
 * Turns an authoring export into something worth downloading.
 *
 * Sculpting tools hand out 2K PNGs on every material slot, which is most of a
 * 20MB file and none of what a viewer at 500px can show. Each slot is resized
 * to what it can actually carry — colour reads at 1K, a normal at 512, the
 * packed roughness/metal/occlusion at 256 — re-encoded as WebP, and the
 * geometry is quantised and meshopt-compressed. Slot budgets match the models
 * already on the site, so a new piece sits in the same weight class.
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, meshopt, prune } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import { statSync } from 'node:fs';

const [IN, OUT, ...rest] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!IN || !OUT || rest.length) {
  console.error('usage: node tools/optimise-model.mjs in.glb out.glb [--slot=px ...]');
  process.exit(1);
}

/**
 * Longest edge, in pixels, each material slot is allowed to keep. These are
 * where the models already on the site sit; override per asset, because what a
 * slot can afford to lose depends on the map. A packed roughness/metal map
 * with real detail in it goes visibly wrong at 256 — the detail averages out
 * and the whole surface turns glossy — while a near-flat one never notices.
 */
const BUDGET = {
  baseColor: 1024,
  normal: 512,
  emissive: 256,
  metallicRoughness: 256,
  occlusion: 256
};
for (const arg of process.argv.slice(2).filter((a) => a.startsWith('--'))) {
  const [slot, px] = arg.slice(2).split('=');
  if (!(slot in BUDGET)) {
    console.error('unknown slot: ' + slot + ' (' + Object.keys(BUDGET).join(', ') + ')');
    process.exit(1);
  }
  BUDGET[slot] = Number(px);
}

await MeshoptEncoder.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder
});
const doc = await io.read(IN);

// A texture can sit in more than one slot — occlusion and roughness usually
// share one map — so it is kept at the largest size any of its slots asks for.
const wanted = new Map();
const colour = new Set();
for (const material of doc.getRoot().listMaterials()) {
  const slots = {
    baseColor: material.getBaseColorTexture(),
    normal: material.getNormalTexture(),
    emissive: material.getEmissiveTexture(),
    metallicRoughness: material.getMetallicRoughnessTexture(),
    occlusion: material.getOcclusionTexture()
  };
  for (const [slot, texture] of Object.entries(slots)) {
    if (!texture) continue;
    wanted.set(texture, Math.max(wanted.get(texture) ?? 0, BUDGET[slot]));
    if (slot === 'baseColor') colour.add(texture);
  }
}

for (const texture of doc.getRoot().listTextures()) {
  const image = texture.getImage();
  const limit = wanted.get(texture);
  if (!image || !limit) continue;

  const before = await sharp(image).metadata();
  const pipeline = sharp(image).resize({
    width: Math.min(before.width, limit),
    height: Math.min(before.height, limit),
    fit: 'inside',
    // Textures wrap; letting the resampler reach past the edge would bleed the
    // opposite side of the map into the seam.
    kernel: 'lanczos3'
  });
  // Colour maps can carry cut-outs for foliage; the packed maps never do.
  const alpha = before.channels === 4 && colour.has(texture);
  const out = await pipeline.webp({ quality: 82, alphaQuality: 90, effort: 6 }).toBuffer();

  texture.setImage(out).setMimeType('image/webp');
  const after = await sharp(out).metadata();
  console.log(
    `  ${(texture.getName() || 'texture').padEnd(34)} ` +
    `${before.width}x${before.height} ${before.format} -> ${after.width}x${after.height} webp` +
    `${alpha ? ' +alpha' : ''}  ${(out.length / 1024).toFixed(0)}kB`
  );
}

await doc.transform(
  dedup(),
  prune(),
  meshopt({ encoder: MeshoptEncoder, level: 'high' })
);

await io.write(OUT, doc);

const from = statSync(IN).size;
const to = statSync(OUT).size;
console.log(
  `\n${IN} ${(from / 1048576).toFixed(1)}MB -> ${OUT} ` +
  `${(to / 1024).toFixed(0)}kB  (${(from / to).toFixed(0)}x smaller)`
);
