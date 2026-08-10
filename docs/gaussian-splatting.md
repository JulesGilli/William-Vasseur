# Gaussian splatting — parked, not removed

No current project ships a splat: William wants this for a future piece. The
viewer, the loader, the camera handover and the asset pipeline are all still in
the tree and still build. Turning it back on is a data change, not a rebuild.

## Switching a project on

Add a `world` to its entry in `src/data/projects.ts`:

```ts
world: {
  src: asset('/models/my-scene.sog'),
  travel: 'walk',       // 'orbit' circles an object; 'walk' wanders an environment
  upright: true,        // omit for anything a trainer produced — see below
  eye: [0, 1.6, -3],    // where the camera starts
  look: [0, 1.6, 0],    // what it looks at
  fov: 60,              // environments want a wider lens than objects
}
```

`src/pages/Projects.tsx` renders the "VISIT THIS WORLD" button only for projects
that have one, so nothing else needs touching. `WorldViewer` opens full-screen
through a portal; `WorldScene` is a `React.lazy` chunk, so the PlayCanvas
runtime (~2.0 MB, 512 KB gzipped) is only fetched once a visitor clicks.

**`upright`.** Trainers emit Y-down, so a trained capture arrives upside down and
the scene is flipped 180° on Z by default. A splat derived from a mesh is
already the right way up and sets `upright: true`. Getting this wrong is
obvious — the world hangs from the ceiling.

## Format

SOG, produced from a `.ply` by `npx @playcanvas/splat-transform in.ply out.sog`.
It is a ZIP of WebP planes, and it compresses roughly 16× against the PLY: on
the bench scene, 1.09 M gaussians went from 258 MB to 15.8 MB.

That ratio is what makes GitHub Pages viable. Pages serves `.sog` as
`application/octet-stream` with `Accept-Ranges`, no LFS and no external host
needed — verified against the live deployment. Anything under ~20 MB is fine;
past that, reach for a CDN before reaching for a smaller scene.

## Engine

PlayCanvas 2.21, deliberately a second engine alongside the three.js used for
the mesh viewers. The world is a full-screen takeover that composes with
nothing else, so the duplication buys real things: the WebGPU compute path and
streamed level-of-detail that splats need on phones.

Spark 2.1 was benchmarked as the three.js-native alternative and does read our
SOG, but it needs three ≥ 0.180 against the 0.169 that `@react-three/fiber` v8
and `drei` v9 are pinned to. Bench, desktop, first frame: PlayCanvas 681 ms,
Spark 1496 ms. If the mesh viewers are ever moved to a newer three, revisit —
one engine would be better than two.

**Do not load PlayCanvas's stock scripts by URL.** `camera-controls.mjs` imports
`playcanvas` by bare specifier. Vite's `?url` ships the file untouched, which
works in dev (the dev server rewrites such imports as it transforms the module)
and fails in every build. Import it as a module so Vite resolves and bundles it,
and create it from the class rather than by name.

## Producing a splat

The real path is photogrammetry-style training from a Blender scene —
Postshot or Nerfstudio, on a GPU: render an orbit of frames, train, export PLY,
convert to SOG. **This is the one step never run here**; everything downstream
of it is proven.

`tools/mesh-to-splat.mjs` is the stopgap that made that provable without a GPU:

```bash
node tools/mesh-to-splat.mjs public/models/mossy-log.glb out.ply 600000
npx @playcanvas/splat-transform out.ply public/models/my-scene.sog
```

It samples a textured mesh's surface — area-weighted triangle picking,
barycentric UV interpolation, texture lookup for `f_dc`. It is **not** a trained
splat: no view-dependent lighting, no optimisation, and it looks like what it
is. It exists so the viewer could be exercised on an asset we own rather than a
research capture we are not licensed to host.

The 5 MB splat it produced for Bloom Fragment was removed once splatting was
parked, rather than shipped on every deploy for nothing. Regenerate it with the
two commands above, or recover it from git at `4ab2d09`.

## Licensing

The bench scene wired behind `VITE_WORLD_NAVANA` is "Forest path" by tanha
(CC BY 4.0). It lives in `.env.development.local` and is undefined in any build,
so it cannot reach the public site. Keep it that way: it is fine to develop
against and not ours to publish.
