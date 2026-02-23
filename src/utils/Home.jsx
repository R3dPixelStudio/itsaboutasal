import { Suspense, useMemo, memo, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { ScrollControls, Scroll, Preload, useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Hooks
import { useDeviceType } from './useDeviceType.js';
import { useBookStore } from './store';
import { collectAssetPaths } from '../assetCollector.js';

// Components
import Header from './Header.jsx';
import ScenePrecompiler from '../ScenePrecompiler.jsx';
import { LAMP_LAYOUTS, BG_LAYOUTS } from './Configs.js'; 
import { CameraRig } from './CameraRig.jsx';
import ScrollHandler from './ScrollHandler.jsx';
import MyWorksFinal from './section2/MyWorksFinal.jsx';
import SvgDraw from './section1/SvgDraw.jsx';
import HtmlContent from './HtmlContent.jsx';
import { Lamp } from './section1/Lamp.jsx';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf'


// --- BACKGROUND COMPONENT ---
const ConcreteBackground = memo(({ assetMap, device }) => {
  const bgConfig = BG_LAYOUTS[device] || BG_LAYOUTS.desktop; 
  const map = assetMap?.get(bgConfig?.map);
  const normalMap = assetMap?.get(bgConfig?.normalMap);
  const roughnessMap = assetMap?.get(bgConfig?.roughnessMap);

  const position = bgConfig?.position || [0, 0, -1.4];
  const scale = bgConfig?.scale || [20, 20, 1];

  if (!map) return null;

  return (
    <mesh position={position} scale={scale} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial 
        map={map} normalMap={normalMap} roughnessMap={roughnessMap} 
        roughness={0.8} envMapIntensity={0.5} color="#ffffff" 
      />
    </mesh>
  );
});
ConcreteBackground.displayName = "ConcreteBackground";

// --- SCENE CONTENT ---
const SceneContent = memo(({ assetMap, device }) => {
  const boardLayouts = LAMP_LAYOUTS[device] || LAMP_LAYOUTS.desktop; 
  const isMobile = device === 'mobile';

  return (
    <>
      <ScrollHandler />
      <CameraRig />
      <ConcreteBackground assetMap={assetMap} device={device} />

      <Scroll>
        <group>
           <SvgDraw assetMap={assetMap} />
           <Lamp {...boardLayouts} assetMap={assetMap} />
        </group>
        {!isMobile && <MyWorksFinal assetMap={assetMap} />}
      </Scroll>
      <Scroll html style={{ width: '100%', height: '100%' }}>
        <HtmlContent />
      </Scroll>
    </>
  );
});
SceneContent.displayName = "SceneContent";

// --- SCENE LOADER ---
const SceneLoader = memo(({ device }) => {
  const setDeviceType = useBookStore((state) => state.setDeviceType);
  useEffect(() => { setDeviceType(device); }, [device, setDeviceType]);

  const { texturePaths, modelPaths, svgPaths } = useMemo(() => collectAssetPaths(device), [device]);

  useGLTF.preload(modelPaths);
  const textures = useTexture(texturePaths);
  const svgs = useLoader(SVGLoader, svgPaths);

  const assetMap = useMemo(() => {
    const map = new Map();
    const texArray = Array.isArray(textures) ? textures : [textures];
    const svgArray = Array.isArray(svgs) ? svgs : [svgs];
    texturePaths.forEach((path, i) => { if(texArray[i]) map.set(path, texArray[i]); });
    svgPaths.forEach((path, i) => { if(svgArray[i]) map.set(path, svgArray[i]); });
    return map;
  }, [texturePaths, textures, svgPaths, svgs]);

  return <SceneContent assetMap={assetMap} device={device} />;
});
SceneLoader.displayName = "SceneLoader";

// --- MAIN COMPONENT ---
export default function Home() {
  const isLoadedAndStarted = useBookStore((state) => state.isLoadedAndStarted);
  const device = useDeviceType();
  const isMobile = device === 'mobile';
  

  return (
    <>
      <Header />
      
      
      {/* 1. Fixed Position Wrapper 
          2. z-0 Ensures it sits BEHIND the Header (which is z-50)
          3. bg-zinc-900 handles the "dark mode" pre-load look
      */}
      <div className={`fixed top-0 left-0 w-full h-full z-0 transition-colors duration-1000 ${isLoadedAndStarted ? 'bg-white' : 'bg-zinc-900'}`}>
        <Canvas
          flat 
          shadows={!isMobile} 
          dpr={[1, 1.5]} 
          camera={{ position: [0, 0, 5], fov: 50, far: 20, near: 0.1 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
          // Only render fully when started (saves battery), but keep loop for loader
          frameloop={isLoadedAndStarted ? "always" : "demand"}
        >
           {/* <Perf position="bottom-left" /> */}
          <ambientLight intensity={1.2} />
          <directionalLight castShadow={!isMobile} position={[5, 2, 5]} intensity={1.2} shadow-bias={-0.0005} shadow-mapSize={[1024, 1024]} />
          
          <Suspense fallback={null}>
            {/* CRITICAL FIX: 
                enabled={isLoadedAndStarted} -> Locks scroll until user enters.
                style={{ height: '100svh' }} -> Fixes mobile address bar resizing issues.
            */}
            <ScrollControls 
                pages={4} 
                damping={0.2} 
                enabled={isLoadedAndStarted}
                style={{ height: '100svh' }}
            >
              <SceneLoader device={device} />
            </ScrollControls>
            <ScenePrecompiler /> 
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}