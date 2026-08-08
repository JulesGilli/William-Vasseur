/**
 * Usage:
 *   npm i -D @gltf-transform/core @gltf-transform/extensions sharp
 *   node tools/mesh-to-splat.mjs in.glb out.ply [count]
 *   npx @playcanvas/splat-transform out.ply out.sog
 *
 * Turns a textured mesh into a 3DGS point cloud by sampling its surface.
 *
 * This is not a trained splat — there is no view-dependent lighting and no
 * optimisation. It exists so the world viewer can be exercised with an asset
 * we actually own, instead of a research capture we are not licensed to host.
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const [, , IN, OUT, COUNT = '600000'] = process.argv;
const TARGET = Number(COUNT);

// Spherical-harmonic DC term: the constant that maps linear colour to f_dc.
const SH_C0 = 0.28209479177387814;
const logit = (p) => Math.log(p / (1 - p));

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(IN);
const root = doc.getRoot();

// Collect every primitive with its own base-colour texture, decoded once.
const prims = [];
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    const uv = prim.getAttribute('TEXCOORD_0');
    const idx = prim.getIndices();
    if (!pos || !idx) continue;

    const tex = prim.getMaterial()?.getBaseColorTexture();
    let image = null;
    if (tex?.getImage()) {
      const { data, info } = await sharp(Buffer.from(tex.getImage()))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      image = { data, w: info.width, h: info.height, ch: info.channels };
    }
    prims.push({ pos, uv, idx, image });
  }
}
if (!prims.length) throw new Error('no drawable primitive found');

// Area-weight every triangle so sampling is uniform over the surface, not
// over the triangle list — dense small triangles would otherwise dominate.
const tris = [];
let totalArea = 0;
for (const p of prims) {
  const P = p.pos.getArray();
  const I = p.idx.getArray();
  for (let i = 0; i < I.length; i += 3) {
    const a = I[i] * 3, b = I[i + 1] * 3, c = I[i + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    const area = 0.5 * Math.hypot(cx, cy, cz);
    if (!(area > 0)) continue;
    totalArea += area;
    tris.push({ p, a: I[i], b: I[i + 1], c: I[i + 2], area, cum: totalArea });
  }
}

const pickTriangle = (r) => {
  let lo = 0, hi = tris.length - 1;
  const t = r * totalArea;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (tris[mid].cum < t) lo = mid + 1; else hi = mid;
  }
  return tris[lo];
};

const sampleTexture = (image, u, v) => {
  if (!image) return [0.7, 0.7, 0.7];
  // glTF UVs run top-down; wrap so values outside 0..1 still land on the map.
  const x = Math.min(image.w - 1, Math.max(0, Math.floor(((u % 1) + 1) % 1 * image.w)));
  const y = Math.min(image.h - 1, Math.max(0, Math.floor(((v % 1) + 1) % 1 * image.h)));
  const o = (y * image.w + x) * image.ch;
  return [image.data[o] / 255, image.data[o + 1] / 255, image.data[o + 2] / 255];
};

// One gaussian per sample, sized to just overlap its neighbours so the surface
// reads as solid rather than as separate dots.
const spacing = Math.sqrt(totalArea / TARGET);
const logScale = Math.log(spacing * 0.62);
const opacity = logit(0.985);

const FIELDS = [
'x', 'y', 'z', 'nx', 'ny', 'nz',
'f_dc_0', 'f_dc_1', 'f_dc_2', 'opacity',
'scale_0', 'scale_1', 'scale_2',
'rot_0', 'rot_1', 'rot_2', 'rot_3'];

const header =
`ply
format binary_little_endian 1.0
element vertex ${TARGET}
${FIELDS.map((f) => `property float ${f}`).join('\n')}
end_header
`;

const body = Buffer.alloc(TARGET * FIELDS.length * 4);
let off = 0;
const put = (v) => { body.writeFloatLE(v, off); off += 4; };

for (let i = 0; i < TARGET; i++) {
  const tri = pickTriangle(Math.random());
  // Uniform barycentric point inside the triangle.
  let s = Math.random(), t = Math.random();
  if (s + t > 1) { s = 1 - s; t = 1 - t; }
  const w = 1 - s - t;

  const P = tri.p.pos.getArray();
  const a = tri.a * 3, b = tri.b * 3, c = tri.c * 3;
  put(P[a] * w + P[b] * s + P[c] * t);
  put(P[a + 1] * w + P[b + 1] * s + P[c + 1] * t);
  put(P[a + 2] * w + P[b + 2] * s + P[c + 2] * t);
  put(0); put(0); put(0); // normals unused by the renderer

  let rgb = [0.7, 0.7, 0.7];
  if (tri.p.uv) {
    const U = tri.p.uv.getArray();
    const ua = tri.a * 2, ub = tri.b * 2, uc = tri.c * 2;
    rgb = sampleTexture(
      tri.p.image,
      U[ua] * w + U[ub] * s + U[uc] * t,
      U[ua + 1] * w + U[ub + 1] * s + U[uc + 1] * t
    );
  }
  put((rgb[0] - 0.5) / SH_C0);
  put((rgb[1] - 0.5) / SH_C0);
  put((rgb[2] - 0.5) / SH_C0);
  put(opacity);
  put(logScale); put(logScale); put(logScale);
  put(1); put(0); put(0); put(0); // identity rotation: isotropic blobs
}

writeFileSync(OUT, Buffer.concat([Buffer.from(header, 'ascii'), body]));
console.log(
  `${tris.length.toLocaleString()} triangles, area ${totalArea.toFixed(2)} → ` +
  `${TARGET.toLocaleString()} gaussians, spacing ${spacing.toFixed(4)}`
);
