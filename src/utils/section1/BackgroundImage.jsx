import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function BackgroundImage({ url, position = [0,0,0], scale = [1,1,1], assetMap, isHovered }) {
  const texture = assetMap.get(url);
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0;
    }
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.material, { 
        opacity: isHovered ? 1 : 0, 
        duration: 0.5,
        overwrite: "auto" // Stops flickering if you swipe your mouse wildly
      });
    }
  }, [isHovered]);

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      renderOrder={-1}
      raycast={() => null} // <--- MAGIC: The raycaster completely ignores this mesh!
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}