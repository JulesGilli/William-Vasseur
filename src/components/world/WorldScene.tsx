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
  /** Idle camera path: circle an object, or wander into an environment. */
  travel?: 'orbit' | 'walk';
  onReady?: () => void;
  onError?: (message: string) => void;
}

/** Physical key positions, so ZQSD on an AZERTY keyboard maps like WASD. */
const MOVE_CODES = new Set([
'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE',
'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
);

export default function WorldScene({ src, upright, travel = 'orbit', onReady, onError }: WorldSceneProps) {
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


    let cleanupHandover: (() => void) | null = null;

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
      app.root.addChild(camera);

      const world = new Entity('World');
      // Trained splats arrive Y-down; mesh-derived ones do not.
      if (!upright) world.setEulerAngles(0, 0, 180);
      world.addComponent('gsplat', { asset: assets[1] });
      app.root.addChild(world);

      // The camera travels on its own until the visitor reaches for it. The
      // controls script is only created at that moment: while it exists it
      // writes the camera pose every frame, so the two can never coexist.
      const startPos = camera.getPosition().clone();
      const fwd = camera.forward.clone();
      const side = camera.right.clone();
      let elapsed = 0;
      const travelTick = (dt: number) => {
        elapsed += dt;
        if (travel === 'walk') {
          // Ease down the path and back, with a sway and bob that read as
          // footsteps rather than a camera on rails.
          const along = 3 * (1 - Math.cos(elapsed / 40 * Math.PI * 2));
          const sway = 0.35 * Math.sin(elapsed / 13 * Math.PI * 2);
          const bob = 0.05 * Math.sin(elapsed / 3.1 * Math.PI * 2);
          camera.setPosition(
            startPos.x + fwd.x * along + side.x * sway,
            startPos.y + bob,
            startPos.z + fwd.z * along + side.z * sway
          );
          camera.lookAt(
            startPos.x + fwd.x * (along + 8),
            startPos.y,
            startPos.z + fwd.z * (along + 8)
          );
        } else {
          const radius = startPos.length() || 3;
          const angle = elapsed * 0.08;
          camera.setPosition(Math.sin(angle) * radius, startPos.y, Math.cos(angle) * radius);
          camera.lookAt(0, 0, 0);
        }
      };
      app.on('update', travelTick);

      const takeOver = (e?: Event) => {
        if (disposed || !app) return;
        app.off('update', travelTick);
        removeHandover();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const controls = camera.script?.create('cameraControls') as any;
        if (travel === 'walk' && controls) {
          // In an environment there is nothing to orbit: orbiting recentres
          // on the world origin and yanks the camera back to the start. With
          // orbit off every input coerces to fly — mouse looks, keys walk.
          controls.enableOrbit = false;
          // The script initialised itself aimed at the origin; hand it the
          // travel's actual pose (snap, not smooth) so nothing visibly turns.
          const focus = camera.getPosition().
          clone().
          add(camera.forward.clone().mulScalar(8));
          controls._pose.look(camera.getPosition(), focus);
          controls._controller.attach(controls._pose, false);
        }
        // For orbit worlds the script's own init — orbit the origin from the
        // camera's current spot — is exactly where the travel left it.
        // The script attached its listeners just now, after this pointerdown
        // had already fired; replaying it lets the very first drag connect.
        if (e instanceof PointerEvent && e.type === 'pointerdown') {
          canvas.dispatchEvent(new PointerEvent('pointerdown', e));
        }
      };
      const onPointer = (e: PointerEvent) => takeOver(e);
      const onWheel = () => takeOver();
      const onKey = (e: KeyboardEvent) => {
        if (MOVE_CODES.has(e.code)) takeOver();
      };
      canvas.addEventListener('pointerdown', onPointer, true);
      canvas.addEventListener('wheel', onWheel, { capture: true, passive: true });
      window.addEventListener('keydown', onKey, true);
      const removeHandover = () => {
        canvas.removeEventListener('pointerdown', onPointer, true);
        canvas.removeEventListener('wheel', onWheel, true);
        window.removeEventListener('keydown', onKey, true);
      };
      cleanupHandover = removeHandover;

      ready.current?.();
    });

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      cleanupHandover?.();
      app?.destroy();
      canvas.remove();
    };
  }, [src, upright, travel]);

  return <div ref={host} className="h-full w-full" />;
}
