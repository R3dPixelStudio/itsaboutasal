import { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import MeshlinePath from './MeshlinePath.jsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function SvgToMeshline({
  svgData,
  isActive,
  onComplete,
  forceComplete = false,
  baseScaleFactor,
  customPivot,
  hoverAnimation,
  isPuppetPart = false,
  onPuppetHover,
  isGroupHovered = false, 
  disableHitArea = false,
}) {
  const scaleFactor = baseScaleFactor !== undefined ? baseScaleFactor : 0.006;
 
  const [completedPaths, setCompletedPaths] = useState(0);
  const [isDrawn, setIsDrawn] = useState(forceComplete);

  const animationTimeline = useRef();
  
  // THE GAME DEV FIX: A proxy object that GSAP can safely mutate without breaking Three.js!
  const targetRotation = useRef(0);
  const proxyRotation = useRef({ z: 0 }); 
  const hasTriggeredGroupHover = useRef(false);

  const containerRef = useRef();
  const hitAreaRef = useRef();
  const drawingRef = useRef(); 
  const animationRef = useRef(); 

  const { paths, cx, cy, width, height } = useMemo(() => {
    if (!svgData?.paths) return { paths: [], cx: 0, cy: 0, width: 1, height: 1 };
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    svgData.paths.forEach((path) =>
      path.subPaths.forEach((subPath) =>
        subPath.getPoints().forEach((p) => {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        })
      )
    );

    const w = (maxX - minX) * scaleFactor;
    const h = (maxY - minY) * scaleFactor;
    return { 
      paths: svgData.paths, 
      cx: (minX + maxX) / 2, 
      cy: (minY + maxY) / 2, 
      width: w, 
      height: h 
    };
  }, [svgData, scaleFactor]);

  const pivotOffset = customPivot ? [(cx - customPivot.x) * scaleFactor, -(cy - customPivot.y) * scaleFactor, 0] : [0, 0, 0];

  // Grab contextSafe from GSAP so our click/hover events animate safely within React's lifecycle
  const { contextSafe } = useGSAP(() => {
    if (hoverAnimation === "earthOrbit") {
      const dummy = { t: 0 };
      
      const applyOrbitParams = (angle) => {
          if (!animationRef.current) return;
          
          animationRef.current.position.x = 0.9 * Math.cos(angle); 
          animationRef.current.position.y = 0.3 * Math.sin(angle); 
          animationRef.current.position.z = Math.sin(angle) * 0.1; 
          
          const depthScale = Math.sin(angle) * 0.3 + 0.7; 
          animationRef.current.scale.set(depthScale, depthScale, depthScale);

          const vx = -1.4 * Math.sin(angle);
          const vy = 0.3 * Math.cos(angle);
          animationRef.current.rotation.z = Math.atan2(vy, vx);
      };

      applyOrbitParams(dummy.t);

      animationTimeline.current = gsap.to(dummy, {
        t: dummy.t + 2 * Math.PI,
        duration: 3,
        ease: "none",
        repeat: -1,
        paused: true,
        onUpdate: () => applyOrbitParams(dummy.t)
      });
    } 
  }, { dependencies: [hoverAnimation] });

  // THE NEW TURBINE PHYSICS ENGINE
  const triggerTurbineSpin = contextSafe(() => {
    if (hoverAnimation === 'turbine' && animationRef.current) {
        targetRotation.current -= Math.PI * 2; // Always exactly 360 degrees
        
        // Tween the proxy, and forcibly update the Three.js matrix on every frame
        gsap.to(proxyRotation.current, {
            z: targetRotation.current,
            duration: 2.5, 
            ease: "power2.out", 
            overwrite: "auto",
            onUpdate: () => {
                if (animationRef.current) {
                    animationRef.current.rotation.z = proxyRotation.current.z;
                }
            }
        });
    }
  });

  // Keep group animations (Earth) synced, and automatically spin the turbine if the group is hovered
  useEffect(() => {
    if (!isDrawn) return;
    
    if (isGroupHovered) {
      if (animationTimeline.current && hoverAnimation !== 'turbine') {
         animationTimeline.current.play();
      }
      if (hoverAnimation === 'turbine' && !hasTriggeredGroupHover.current) {
         triggerTurbineSpin();
         hasTriggeredGroupHover.current = true;
      }
    } else {
      hasTriggeredGroupHover.current = false;
      if (animationTimeline.current && hoverAnimation !== 'turbine') {
         animationTimeline.current.pause();
      }
    }
  }, [isGroupHovered, isDrawn, hoverAnimation]);

  useEffect(() => {
    if (forceComplete && !isDrawn) {
        setIsDrawn(true);
        setCompletedPaths(paths.length);
    }
  }, [forceComplete, isDrawn, paths.length]);
  
  useEffect(() => {
    if (isActive && !forceComplete && !isDrawn && paths.length > 0 && completedPaths >= paths.length) {
      setIsDrawn(true);
      if (onComplete) onComplete();
    }
  }, [completedPaths, isActive, paths.length, onComplete, forceComplete, isDrawn]);

  // Handle direct precise interactions on the SVG mesh itself
  const handlePointerEnter = () => {
    if (!isDrawn) return;
    if (isPuppetPart) onPuppetHover(true);
    triggerTurbineSpin(); 
  };

  const handlePointerLeave = () => {
    if (!isDrawn) return;
    if (isPuppetPart) onPuppetHover(false);
  };

  const handlePointerDown = (e) => {
    if (!isDrawn) return;
    
    // MAGIC FIX: If they physically hit the turbine mesh, stop the event from bubbling!
    // This lets them spam the tap purely through the GSAP physics engine.
    if (hoverAnimation === 'turbine' && e) {
        e.stopPropagation();
    }
    
    triggerTurbineSpin(); 
  };

  if (!svgData) return null;

  return (
    <Suspense fallback={null}>
      <group ref={containerRef}>
        
        <group ref={drawingRef} position={pivotOffset}>
            <mesh 
                ref={hitAreaRef} 
                onPointerEnter={handlePointerEnter} 
                onPointerLeave={handlePointerLeave}
                onPointerDown={handlePointerDown} 
                raycast={disableHitArea ? () => null : undefined} 
            >
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            
            <group ref={animationRef}>
              {paths.map((path, index) => (
                <MeshlinePath
                  key={index}
                  path={path}
                  cx={cx}
                  cy={cy}
                  isActive={isActive}
                  forceComplete={forceComplete}
                  scaleFactor={scaleFactor}
                  onComplete={() => setCompletedPaths((prev) => prev + 1)}
                />
              ))}
            </group>
        </group>

      </group>
    </Suspense>
  );
}