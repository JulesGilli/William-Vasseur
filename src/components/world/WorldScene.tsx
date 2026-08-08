import { useEffect, useRef } from 'react';
import {
  Application,
  Asset,
  AssetListLoader,
  Entity,
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO } from
'playcanvas';
// Bundled rather than pulled from a CDN, so the world still works offline and
// nothing third-party is fetched at runtime.
import cameraControlsUrl from 'playcanvas/scripts/esm/camera-controls.mjs?url';

/**
 * Default export so the whole PlayCanvas runtime lands in its own lazy chunk.
 * It is deliberately a separate engine from the three.js used elsewhere: this
 * is a full-screen takeover that composes with nothing, and it brings the
 * WebGPU compute path and streamed level-of-detail that splats need on phones.
 */
export interface WorldSceneProps {
  src: string;
  /** Skip the Y-down correction for splats that are already the right way up. */
  upright?: boolean;
  onReady?: () => void;
  onError?: (message: string) => void;
}

export default function WorldScene({ src, upright, onReady, onError }: WorldSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  // Callbacks are read through refs so re-renders never restart the engine.
  const ready = useRef(onReady);
  const failed = useRef(onError);
  ready.current = onReady;
  failed.current = onError;

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.touchAction = 'none';
    mount.appendChild(canvas);

    let app: Application | null = null;
    let disposed = false;

    try {
      // Antialiasing buys nothing on splats and costs fill rate.
      app = new Application(canvas, { graphicsDeviceOptions: { antialias: false } });
      app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
      app.setCanvasResolution(RESOLUTION_AUTO);
      app.start();
    } catch (e) {
      failed.current?.(e instanceof Error ? e.message : String(e));
      return;
    }

    const onResize = () => app?.resizeCanvas();
    window.addEventListener('resize', onResize);

    const assets = [
    new Asset('camera-controls', 'script', { url: cameraControlsUrl }),
    new Asset('world', 'gsplat', { url: src })];


    const loader = new AssetListLoader(assets, app.assets);
    loader.load((err?: string | null) => {
      if (disposed || !app) return;
      if (err) {
        failed.current?.(err);
        return;
      }

      const camera = new Entity('Camera');
      camera.addComponent('camera', { clearColor: new Float32Array([0, 0, 0, 0]) } as never);
      camera.setPosition(0, 0, 3);
      camera.addComponent('script');
      camera.script?.create('cameraControls');
      app.root.addChild(camera);

      const world = new Entity('World');
      // Trained splats arrive Y-down; mesh-derived ones do not.
      if (!upright) world.setEulerAngles(0, 0, 180);
      world.addComponent('gsplat', { asset: assets[1] });
      app.root.addChild(world);

      ready.current?.();
    });

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      app?.destroy();
      canvas.remove();
    };
  }, [src, upright]);

  return <div ref={host} className="h-full w-full" />;
}
