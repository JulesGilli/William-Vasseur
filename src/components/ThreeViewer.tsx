import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
interface ThreeViewerProps {
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
  className?: string;
}
export function ThreeViewer({
  geometryType,
  wireframe = true,
  color = '#ffffff',
  className = ''
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number>(0);
  const isDragging = useRef(false);
  const previousMouse = useRef({
    x: 0,
    y: 0
  });
  const targetRotation = useRef({
    x: 0,
    y: 0
  });
  const currentRotation = useRef({
    x: 0,
    y: 0
  });
  const isWireframe = useRef(wireframe);
  const autoRotateSpeed = useRef(0.003);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    // Geometry
    let geometry: THREE.BufferGeometry;
    switch (geometryType) {
      case 'box':
        geometry = new THREE.BoxGeometry(3, 3, 3, 4, 4, 4);
        break;
      case 'sphere':
        geometry = new THREE.IcosahedronGeometry(3, 2);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(2.5, 0.8, 24, 64);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(3, 1);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(3, 1);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(3, 1);
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(2, 0.6, 128, 32);
        break;
      default:
        geometry = new THREE.BoxGeometry(3, 3, 3);
    }
    // Wireframe material
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    // Solid material with lighting
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      wireframe: false,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    // Add lights for solid mode
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0xff0000, 3, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xffffff, 2, 20);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);
    const mesh = new THREE.Mesh(
      geometry,
      isWireframe.current ? wireMaterial : solidMaterial
    );
    scene.add(mesh);
    meshRef.current = mesh;
    // Edge lines for extra brutalist detail
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.3
    });
    const lineSegments = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(lineSegments);
    // Mouse/touch handlers for drag rotation
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousMouse.current = {
        x: e.clientX,
        y: e.clientY
      };
      autoRotateSpeed.current = 0.001;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      targetRotation.current.y += deltaX * 0.008;
      targetRotation.current.x += deltaY * 0.008;
      previousMouse.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    const onPointerUp = () => {
      isDragging.current = false;
      autoRotateSpeed.current = 0.003;
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    // Animation loop
    const animate = () => {
      if (meshRef.current) {
        // Auto-rotate
        targetRotation.current.y += autoRotateSpeed.current;
        // Smooth interpolation (lerp)
        currentRotation.current.x +=
        (targetRotation.current.x - currentRotation.current.x) * 0.08;
        currentRotation.current.y +=
        (targetRotation.current.y - currentRotation.current.y) * 0.08;
        meshRef.current.rotation.x = currentRotation.current.x;
        meshRef.current.rotation.y = currentRotation.current.y;
      }
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    // Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    // Toggle wireframe handler
    const toggleWireframe = () => {
      if (!meshRef.current) return;
      isWireframe.current = !isWireframe.current;
      meshRef.current.material = isWireframe.current ?
      wireMaterial :
      solidMaterial;
    };
    (container as any).__toggleWireframe = toggleWireframe;
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(frameIdRef.current);
      if (container && rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      wireMaterial.dispose();
      solidMaterial.dispose();
      lineMaterial.dispose();
      edges.dispose();
      renderer.dispose();
    };
  }, [geometryType, color]);
  const handleToggleWireframe = useCallback(() => {
    if (
    containerRef.current &&
    (containerRef.current as any).__toggleWireframe)
    {
      ;(containerRef.current as any).__toggleWireframe();
    }
  }, []);
  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          cursor: 'grab'
        }} />
      

      {/* Viewer Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="text-[10px] font-mono text-green-500 opacity-70">
          DRAG TO ROTATE // INTERACTIVE_MODE
        </div>
        <button
          onClick={handleToggleWireframe}
          className="text-[10px] font-mono text-white border border-[rgba(255,255,255,0.3)] px-3 py-1 hover:border-red-500 hover:text-red-500 transition-colors uppercase tracking-widest cursor-hover"
          style={{
            cursor: 'pointer'
          }}>
          
          Toggle Wireframe
        </button>
      </div>

      {/* Corner Markers */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-red-500 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-red-500 pointer-events-none" />
      <div className="absolute bottom-12 left-2 w-3 h-3 border-b border-l border-red-500 pointer-events-none" />
      <div className="absolute bottom-12 right-2 w-3 h-3 border-b border-r border-red-500 pointer-events-none" />
    </div>);

}