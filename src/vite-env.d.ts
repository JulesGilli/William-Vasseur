/// <reference types="vite/client" />

/**
 * PlayCanvas ships its stock scripts as plain ESM with JSDoc types and no
 * declaration files, so only the shape we actually use is declared here.
 */
declare module 'playcanvas/scripts/esm/camera-controls.mjs' {
  import type { Script } from 'playcanvas';
  export const CameraControls: typeof Script;
}
