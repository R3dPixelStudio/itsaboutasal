import { useState, useRef, useMemo, useEffect } from 'react';
import { Plane, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber'; // <-- MAGIC: Imported useThree!
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SvgToMeshline from "./loadSVG.jsx";
import BackgroundImage from './BackgroundImage.jsx';
import { 
  BOARD_LAYOUTS, 
  SVG_DRAW_BG_IMAGES, 
  SVG_DRAW_GROUPS, 
  SVG_DRAW_LAYOUTS,
  HTML_PUPPET_LAYOUTS 
} from '../Configs.js';
import { useBookStore } from '../store.js';

// --- Shared Group Component ---
function StandardGroup({ group, groupIndex, bgConfig, bgLayout, groupPartsLayout, assetMap, isStarted, activeGroup, activePart, handleSvgComplete, baseScaleFactor }) {
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef(null);

    const activate = (e) => {
        if (e) e.stopPropagation();
        setIsHovered(true);
        if (e && e.pointerType === 'touch') {
            if (timerRef.current) clearTimeout(timerRef.current);
            
            // MAGIC FIX: The Turbine is groupIndex === 1
            if (groupIndex === 1) {
                // Drop the hover state after 100ms so they can tap it like a madman!
                timerRef.current = setTimeout(() => setIsHovered(false), 100);
            } else {
                // Keep the standard 3-second hold for everything else (like Azadi Tower)
                timerRef.current = setTimeout(() => setIsHovered(false), 3000);
            }
        }
    };

    const deactivate = (e) => {
        if (e) e.stopPropagation();
        if (e && e.pointerType === 'touch') return; 
        setIsHovered(false);
    };

    return (
        <group 
            onPointerEnter={activate} 
            onPointerLeave={deactivate}
            onPointerDown={activate} 
        > 
          {bgLayout && (
            <BackgroundImage 
              url={bgConfig.url} 
              position={bgLayout.position} 
              scale={bgLayout.scale}  
              assetMap={assetMap} 
              isHovered={isHovered} 
            />
          )} 
          
          {group.parts.map((part, partIndex) => { 
             const layout = groupPartsLayout[partIndex] || { position: [0, 0, 0], scale: 1 }; 
             const { position, scale, pivot, hoverAnimation } = layout; 
             const customPivot = pivot ? { x: pivot[0], y: pivot[1] } : undefined; 
             const url = typeof part === 'string' ? part : part.url;
             const svgData = assetMap?.get(url);

             const isTurbineHandle = url.includes('Turbine main line');

             const isActive = isStarted && groupIndex === activeGroup && partIndex === activePart;
             const forceComplete = groupIndex < activeGroup || (groupIndex === activeGroup && partIndex < activePart);
             
             return (
              <group key={partIndex} position={position} scale={[scale, scale, scale]}>
                <SvgToMeshline 
                  svgData={svgData}
                  isActive={isActive} 
                  forceComplete={forceComplete} 
                  onComplete={handleSvgComplete} 
                  baseScaleFactor={baseScaleFactor} 
                  customPivot={customPivot} 
                  hoverAnimation={hoverAnimation} 
                  isGroupHovered={isHovered} 
                  disableHitArea={isTurbineHandle}
                />
              </group>
            ); 
          })}
        </group>
    );
}

// --- Anchored Lottie Component ---
function PuppetLottie({ url, deviceType }) {
  const setPuppetReady = useBookStore((state) => state.setPuppetReady);
  const isPuppetReady = useBookStore((state) => state.isPuppetReady);
  const [dotLottie, setDotLottie] = useState(null);
  const isHoveringRef = useRef(false);

  // MAGIC: Grab the actual WebGL canvas context!
  const { gl } = useThree();

  const puppetLayout = HTML_PUPPET_LAYOUTS[deviceType] || { width: '500px', scale: 0.35 };

  useEffect(() => {
    if (!dotLottie) return;

    const onLoad = () => setPuppetReady(true);
    const onLoop = () => {
        if (!isHoveringRef.current) dotLottie.pause();
    };

    if (dotLottie.isReady || dotLottie.isLoaded) {
       setPuppetReady(true);
    } else {
       dotLottie.addEventListener('load', onLoad);
       dotLottie.addEventListener('ready', onLoad);
    }

    dotLottie.addEventListener('loop', onLoop);

    return () => {
        dotLottie.removeEventListener('load', onLoad);
        dotLottie.removeEventListener('ready', onLoad);
        dotLottie.removeEventListener('loop', onLoop);
    };
  }, [dotLottie, setPuppetReady]);

  return (
    <Html 
        transform 
        center 
        // THE ULTIMATE SHIELD: We physically portal the HTML element into the Canvas's non-scrolling parent container!
        // This makes it 100% immune to native browser scrolling.
        portal={{ current: gl.domElement.parentNode }} 
        zIndexRange={[100, 0]}
        position={[puppetLayout.offsetX || 0, puppetLayout.offsetY || 0, 0.1]} // Slight Z offset to prevent clipping into the board
        scale={puppetLayout.scale || 0.35}
    >
      <div
        className="flex items-center justify-center" // FIX: Centers the lottie so it anchors perfectly
        style={{
          width: puppetLayout.width || '500px',
          height: puppetLayout.width || '500px',
          opacity: isPuppetReady ? 1 : 0,
          transition: 'opacity 0.2s ease-in',
          pointerEvents: isPuppetReady ? 'auto' : 'none',
        }}
        onMouseEnter={() => { isHoveringRef.current = true; dotLottie?.play(); }}
        onMouseLeave={() => { isHoveringRef.current = false; }}
      >
         <DotLottieReact
            src={url}
            loop
            autoplay={false}
            dotLottieRefCallback={setDotLottie}
            backgroundColor="transparent"
            style={{ width: '100%', height: '100%' }}
         />
      </div>
    </Html>
  );
}

export default function SvgDraw({ assetMap }) {
  const isStarted = useBookStore((state) => state.isLoadedAndStarted);
  const deviceType = useBookStore((state) => state.deviceType);
  const setPuppetDrawn = useBookStore((state) => state.setPuppetDrawn);
  const isPuppetReady = useBookStore((state) => state.isPuppetReady);  
  const isPuppetDrawn = useBookStore((state) => state.isPuppetDrawn); 

  const [activeGroup, setActiveGroup] = useState(0);
  const [activePart, setActivePart] = useState(0);
  
  // State for the Tap Helper text
  const [hasTappedBoard, setHasTappedBoard] = useState(false);
  
  const layouts = useMemo(() => SVG_DRAW_LAYOUTS[deviceType], [deviceType]);
  const boardLayouts = useMemo(() => BOARD_LAYOUTS[deviceType], [deviceType]);

  const handleSvgComplete = () => {
    const currentGroup = SVG_DRAW_GROUPS[activeGroup];
    
    if (currentGroup.isPuppet && activePart === currentGroup.parts.length - 1) {
       setPuppetDrawn(true);
    }

    if (activePart < currentGroup.parts.length - 1) {
      setActivePart(prev => prev + 1);
    } else {
      if (activeGroup < SVG_DRAW_GROUPS.length - 1) {
        setActiveGroup(prev => prev + 1);
        setActivePart(0);
      }
    }
  };

  return (
    <>
      <group onPointerDown={() => setHasTappedBoard(true)}>
        {/* Fake Drop Shadow Plane! */}
        <Plane scale={[boardLayouts.scale[0] * 1.02, boardLayouts.scale[1] * 1.01, 1]} position={[boardLayouts.position[0], boardLayouts.position[1] - 0.03, boardLayouts.position[2] - 0.01]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.15} depthWrite={false} />
        </Plane>

        <Plane scale={boardLayouts.scale} position={boardLayouts.position} receiveShadow>
          <meshStandardMaterial color="white" roughness={0.5} />
        </Plane>

        {/* Disappearing Tap Helper for Mobile */}
        {deviceType === 'mobile' && !hasTappedBoard && isStarted && (
           <Html position={[boardLayouts.position[0], boardLayouts.position[1] - 1, boardLayouts.position[2] + 0.05]} center transform scale={0.12}>
               <div className="bg-black/60 text-white px-6 py-3 rounded-full text-lg tracking-wide animate-pulse shadow-lg pointer-events-none select-none whitespace-nowrap">
                   Tap drawings to interact
               </div>
           </Html>
        )}
      </group>

      {SVG_DRAW_GROUPS.map((group, groupIndex) => {
        const groupLayoutConfig = layouts[groupIndex];
        if (!groupLayoutConfig) return null;
        
        const baseScaleFactor = groupLayoutConfig.baseScaleFactor;

        if (group.isPuppet) {
          const partUrl = group.parts[0]; 
          const svgData = assetMap?.get(partUrl);
          const pos = groupLayoutConfig.position || [0, 0, 0];
          const scl = groupLayoutConfig.scale || 1;

          const isActive = isStarted && groupIndex === activeGroup;
          const forceComplete = groupIndex < activeGroup;

          return (
            <group key={groupIndex} position={pos} scale={[scl, scl, scl]}>
              {!isPuppetReady && (
                <SvgToMeshline 
                    svgData={svgData} 
                    isActive={isActive} 
                    forceComplete={forceComplete} 
                    onComplete={handleSvgComplete} 
                    baseScaleFactor={baseScaleFactor} 
                    isPuppetPart={true}
                    onPuppetHover={() => {}} 
                />
              )}
              {isPuppetDrawn && group.lottieUrl && (
                  <PuppetLottie url={group.lottieUrl} deviceType={deviceType} />
              )}
            </group>
          );
        }

        const bgConfig = SVG_DRAW_BG_IMAGES[groupIndex];
        const bgLayout = bgConfig ? bgConfig.layouts[deviceType] : null;
        const groupPartsLayout = groupLayoutConfig.parts || [];
        
        return (
            <StandardGroup 
                key={groupIndex}
                group={group}
                groupIndex={groupIndex}
                bgConfig={bgConfig}
                bgLayout={bgLayout}
                groupPartsLayout={groupPartsLayout}
                assetMap={assetMap}
                isStarted={isStarted}
                activeGroup={activeGroup}
                activePart={activePart}
                handleSvgComplete={handleSvgComplete}
                baseScaleFactor={baseScaleFactor}
            />
        );
      })}
    </>
  );
}