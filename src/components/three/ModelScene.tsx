import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import { Vector3, type Group } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const UP = new Vector3(0, 1, 0);

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
}

function Model({ url, onReady }: {url: string;onReady?: () => void;}) {
  const { scene } = useGLTF(url);
  // useGLTF caches per URL, so each mount needs its own copy of the graph.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Runs only after Suspense resolves, which is exactly "the model is here".
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return <primitive object={model} />;
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
}: ModelSceneProps) {
  const dark = theme === 'dark';

  return (
    <Canvas
      // 'never' fully parks the render loop for offscreen viewers.
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 32, position: [0, 0.6, 4.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}>

      <ambientLight intensity={dark ? 0.85 : 1.15} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={dark ? 1.6 : 2.1}
        color={dark ? '#dfe6f0' : '#ffffff'} />

      <directionalLight
        position={[-4, 2, -3]}
        intensity={dark ? 0.7 : 0.5}
        color={dark ? '#7f8ea3' : '#cdd6e2'} />


      {/* Built in-scene from lightformers — no HDRI fetched over the network. */}
      <Environment resolution={192}>
        <Lightformer
          intensity={dark ? 1.5 : 2.4}
          position={[0, 4, 2]}
          scale={[8, 4, 1]}
          color="#ffffff" />

        <Lightformer
          intensity={dark ? 0.8 : 1.1}
          position={[-4, 1, 2]}
          scale={[4, 6, 1]}
          color="#b9c6d6" />

        <Lightformer
          intensity={dark ? 0.55 : 0.8}
          position={[4, -1, -2]}
          scale={[4, 4, 1]}
          color="#8f9bad" />

      </Environment>

      <Suspense fallback={null}>
        {/* Tight fit: the canvas overspills its frame, so filling the canvas is
            what pushes the mesh past the border. */}
        <Bounds fit clip observe margin={1}>
          <Center>
            <Float>
              <Model url={url} onReady={onReady} />
            </Float>
          </Center>
        </Bounds>
      </Suspense>

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={dark ? 0.4 : 0.32}
        scale={9}
        blur={2.6}
        far={4}
        color={dark ? '#000000' : '#0c0c0c'} />


      <Rig resetKey={resetKey} />
      <AutoOrbit enabled={autoRotate && active} />
    </Canvas>);

}

export { useGLTF };
