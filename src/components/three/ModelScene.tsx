import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Bounds,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import { Box3, DirectionalLight, Vector3, type Group } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const UP = new Vector3(0, 1, 0);

/**
 * A Poly Haven sky (CC0, see public/env/LICENSE.txt), 512px and 254kB. Served
 * from the site as a file rather than inlined into this chunk, where base64
 * would have made it a third larger and held up the viewer's code.
 */
const ENVIRONMENT = `${import.meta.env.BASE_URL}env/esplanade.exr`;

/**
 * Default export so the whole three.js runtime lands in its own lazy chunk —
 * visitors who never scroll to a viewer never download it.
 */
export interface ModelSceneProps {
  url: string;
  theme: 'light' | 'dark';
  /** Pause rendering entirely when the viewer scrolls out of the viewport. */
  active: boolean;
  autoRotate: boolean;
  /** Bumping this resets the camera back to its framed default. */
  resetKey: number;
  /** Fires once the glTF has finished streaming and is on screen. */
  onReady?: () => void;
  /**
   * Bounds margin. Above 1 pulls the camera back; below 1 pushes in so the
   * mesh over-fills the canvas. Only go below 1 where the canvas has bleed to
   * spare, otherwise the silhouette gets cut at the canvas edge.
   */
  fit?: number;
}

/** Every model ends up with its longest side spanning this many units. */
const NORMALISED_SIZE = 2;

function Model({ url, onReady }: {url: string;onReady?: () => void;}) {
  const { scene } = useGLTF(url);

  // These arrive from the generator at wildly different scales. Normalising to
  // a common box is what makes one camera fit margin safe for every piece —
  // otherwise the framing is a guess per model and the silhouette gets clipped.
  const { model, scale, offset } = useMemo(() => {
    // useGLTF caches per URL, so each mount needs its own copy of the graph.
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const centre = box.getCenter(new Vector3());
    return {
      model: clone,
      scale: NORMALISED_SIZE / Math.max(size.x, size.y, size.z, 1e-6),
      offset: centre.clone().multiplyScalar(-1)
    };
  }, [scene]);

  // Runs only after Suspense resolves, which is exactly "the model is here".
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <group scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>);

}

/**
 * A light that rides with the camera, so whichever side the visitor turns to
 * is the lit one. Placed up and to the right of the lens, as glTF viewers do.
 */
function Headlight({ intensity }: {intensity: number;}) {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const light = new DirectionalLight('#ffffff', intensity);
    light.position.set(0.5, 0, 0.866);
    camera.add(light);
    // A camera only carries children into the render once it is in the scene.
    scene.add(camera);
    return () => {
      camera.remove(light);
      scene.remove(camera);
    };
  }, [camera, scene, intensity]);

  return null;
}

/** A slow drift that keeps the object alive even while the orbit is idle. */
function Float({ children }: {children: React.ReactNode;}) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.55) * 0.045;
    ref.current.rotation.z = Math.sin(t * 0.35) * 0.015;
  });

  return <group ref={ref}>{children}</group>;
}

function Rig({ resetKey }: {resetKey: number;}) {
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (resetKey > 0) controls.current?.reset();
  }, [resetKey]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom
      minDistance={1.4}
      maxDistance={9}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 1.75}
      autoRotate={false}
      dampingFactor={0.08}
      rotateSpeed={0.65} />);


}

/** Auto-rotation lives here rather than on OrbitControls so it can ease in. */
function AutoOrbit({ enabled }: {enabled: boolean;}) {
  const speed = useRef(0);

  useFrame((state, delta) => {
    const target = enabled ? 1 : 0;
    speed.current += (target - speed.current) * Math.min(1, delta * 3);
    if (speed.current < 0.001) return;

    const controls = state.controls as OrbitControlsImpl | null;
    if (!controls) return;
    // Orbit the camera around the target rather than spinning the model,
    // so the contact shadow and lighting stay put.
    const offset = state.camera.position.clone().sub(controls.target);
    const angle = delta * 0.22 * speed.current;
    offset.applyAxisAngle(UP, angle);
    state.camera.position.copy(controls.target).add(offset);
    state.camera.lookAt(controls.target);
  });

  return null;
}

export default function ModelScene({
  url,
  theme,
  active,
  autoRotate,
  resetKey,
  onReady,
  fit = 1.18,
}: ModelSceneProps) {
  // The same light in both themes: the model is William's work, and it should
  // look the way he lit it, whatever the page around it is doing.
  void theme;

  return (
    <Canvas
      // No tone mapping. The default (ACES) dulls saturated colour and
      // crushes highlights — the crystals came out grey-blue and the flowers
      // flat. Linear output is what William checks his exports in.
      flat
      // 'never' fully parks the render loop for offscreen viewers.
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 32, position: [0, 0.6, 4.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}>

      {/* The rig William previews his models in (gltf-viewer.donmccurdy.com):
          a real sky for reflections, a soft fill, one key light. A sky is what
          the crystals need — lightformers gave them nothing to reflect. */}
      <Environment files={ENVIRONMENT} />
      <ambientLight intensity={0.3} />
      <Headlight intensity={2.5} />

      <Suspense fallback={null}>
        {/* Bounds fits a cube of the model's longest side against the canvas's
            shorter axis, so on a wide frame it under-fills horizontally. `fit`
            is what compensates. No `clip`: it rewrites controls.maxDistance to
            10× the fitted distance, letting visitors zoom out until the model
            is a speck. The default near/far already cover a 2-unit scene. */}
        <Bounds fit observe margin={fit}>
          <Float>
            <Model url={url} onReady={onReady} />
          </Float>
        </Bounds>
      </Suspense>

      {/* No contact shadow on purpose: grounding the mesh to a floor plane
          fights the effect of it lifting out of its frame. */}

      <Rig resetKey={resetKey} />
      <AutoOrbit enabled={autoRotate && active} />
    </Canvas>);

}

export { useGLTF };
