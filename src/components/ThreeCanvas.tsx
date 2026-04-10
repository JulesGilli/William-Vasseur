import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
interface ThreeCanvasProps {
  geometryType:
  'box' |
  'sphere' |
  'torus' |
  'icosahedron' |
  'octahedron' |
  'dodecahedron' |
  'torusKnot';
  wireframe?: boolean;
  color?: string;
  scrollProgress?: number;
  className?: string;
  speed?: number;
}
export function ThreeCanvas({
  geometryType,
  wireframe = true,
  color = '#ffffff',
  scrollProgress = 0,
  className = '',
  speed = 1
}: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number>(0);
  useEffect(() => {
    if (!containerRef.current) return;
    // Setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    // Geometry
    let geometry: THREE.BufferGeometry;
    switch (geometryType) {
      case 'box':
        geometry = new THREE.BoxGeometry(3, 3, 3);
        break;
      case 'sphere':
        geometry = new THREE.IcosahedronGeometry(3, 2); // Low poly sphere look
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(3, 0);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(3, 0);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(3, 0);
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(2, 0.6, 100, 16);
        break;
      default:
        geometry = new THREE.BoxGeometry(3, 3, 3);
    }
    // Material
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: wireframe,
      transparent: true,
      opacity: 0.8
    });
    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;
    // Animation Loop
    const animate = () => {
      if (meshRef.current) {
        // Base rotation
        meshRef.current.rotation.x += 0.002 * speed;
        meshRef.current.rotation.y += 0.003 * speed;
        // Scroll influence
        // We add the scrollProgress to the rotation to make it reactive
        // Using a multiplier to make the effect noticeable
        meshRef.current.rotation.x += scrollProgress * 0.05;
        meshRef.current.rotation.y += scrollProgress * 0.05;
      }
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
      return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [geometryType, wireframe, color, speed]); // Re-run if these props change
  // Update rotation based on scroll prop changes without full re-render
  useEffect(() => {
    if (meshRef.current) {
      // Add a little extra rotation impulse on scroll update
      meshRef.current.rotation.z = scrollProgress * Math.PI;
    }
  }, [scrollProgress]);
  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
}