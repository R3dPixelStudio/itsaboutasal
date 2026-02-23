import { useRef, useMemo, useEffect } from 'react';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { useFrame, extend } from '@react-three/fiber';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function MeshlinePath({
   path, cx, cy, isActive, onComplete, scaleFactor, 
   forceComplete = false, zOffset = 0.001
  }) {
  const meshRef = useRef();
  const progress = useRef(1);
  const hasCompleted = useRef(false);

  const points = useMemo(() => {
    if (!path) return [];
    const rawPoints = path.subPaths.flatMap((subPath) =>
      subPath.getPoints().map((p) => {
        const x = (p.x - cx) * scaleFactor;
        const y = -(p.y - cy) * scaleFactor;
        return new THREE.Vector3(x, y, zOffset);
      })
    );
    return rawPoints.reverse(); 
  }, [path, scaleFactor, zOffset, cx, cy]);

  const geometry = useMemo(() => {
    const geom = new MeshLineGeometry();
    if (points.length > 0) geom.setPoints(points.flatMap((p) => [p.x, p.y, p.z]));
    return geom;
  }, [points]);

  const material = useMemo(() => new MeshLineMaterial({
        color: 'black', lineWidth: 0.012, transparent: true,
        dashArray: 1, dashOffset: 0, dashRatio: 1, depthTest: false,
        onBeforeCompile: (shader) => {
          shader.uniforms.time = { value: 0 };
          shader.vertexShader = `uniform float time; varying vec3 vPosition; ${shader.vertexShader}`
            .replace(`void main() {`, `void main() { vec3 pos = position; pos.y += sin(time + position.x * 10.0) * 0.02; vPosition = pos;`);
          material.userData.shader = shader;
        },
      }), []);

  useEffect(() => { return () => { geometry.dispose(); material.dispose(); }; }, [geometry, material]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material;
    const speed = 1.5; 

    if (forceComplete) {
       if (mat.dashRatio !== 0) mat.dashRatio = 0;
       if (!hasCompleted.current) { hasCompleted.current = true; if (onComplete) onComplete(); }
    } else if (isActive && !hasCompleted.current) {
      if (progress.current > 0) {
        progress.current -= speed * delta;
        mat.dashRatio = Math.max(0, progress.current);
      } else {
        hasCompleted.current = true;
        if (onComplete) onComplete();
      }
    }

    if (mat.userData.shader) {
      mat.userData.shader.uniforms.time.value += delta * 2.0; 
    }
  });

  if (points.length === 0) return null;

  return (
    <mesh 
      ref={meshRef} 
      // CRITICAL: Disables raycasting on thousands of lines to save 100+ FPS on Intel GPUs
      raycast={() => null} 
    >
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  );
}