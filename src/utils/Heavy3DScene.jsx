// src/utils/Heavy3DScene.jsx
import { memo, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Scroll, useTexture, useGLTF } from '@react-three/drei';

// Import your assets and components
import { collectAssetPaths } from '../assetCollector.js';
import { LAMP_LAYOUTS, BG_LAYOUTS } from './Configs.js';
import { CameraRig } from './CameraRig.jsx';
import ScrollHandler from './ScrollHandler.jsx';
import MyWorksFinal from './section2/MyWorksFinal.jsx';
import SvgDraw from './section1/SvgDraw.jsx';
import HtmlContent from './HtmlContent.jsx';
import { Lamp } from './section1/Lamp.jsx';

// ==============================================
// 1. THE CONCRETE WALL
// ==============================================
const ConcreteBackground = memo(({ assetMap, device }) => {
  const bgConfig = BG_LAYOUTS[device]; 
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
        map={map}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        roughness={0.8} 
        envMapIntensity={0.5}
        color="#ffffff" 
      />
    </mesh>
  );
});
ConcreteBackground.displayName = "ConcreteBackground";

// ==============================================
// 2. THE MAIN HEAVY SCENE COMPONENT
// ==============================================
const Heavy3DScene = memo(({ device }) => {
  // Collect paths ONLY when this component is mounted (Desktop/Tablet)
  const { texturePaths, modelPaths, svgPaths } = useMemo(() => collectAssetPaths(device), [device]);

  // Preload and Load Assets
  useGLTF.preload(modelPaths);
  const textures = useTexture(texturePaths);
  const svgs = useLoader(SVGLoader, svgPaths);

  // Map assets for easy access
  const assetMap = useMemo(() => {
    const map = new Map();
    const texArray = Array.isArray(textures) ? textures : [textures];
    const svgArray = Array.isArray(svgs) ? svgs : [svgs];

    texturePaths.forEach((path, i) => { if(texArray[i]) map.set(path, texArray[i]); });
    svgPaths.forEach((path, i) => { if(svgArray[i]) map.set(path, svgArray[i]); });
    return map;
  }, [texturePaths, textures, svgPaths, svgs]);

  const boardLayouts = LAMP_LAYOUTS[device];

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
        <MyWorksFinal assetMap={assetMap} />
      </Scroll>
      
      <Scroll html>
        <HtmlContent />
      </Scroll>
    </>
  );
});

Heavy3DScene.displayName = "Heavy3DScene";
export default Heavy3DScene;