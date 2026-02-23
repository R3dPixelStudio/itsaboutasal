import { Plane, Box } from '@react-three/drei';
import * as THREE from 'three';

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const COVER_THICKNESS = 0.02;

export function Cover({  config, side, assetMap }) {
    const artTexture = assetMap.get(side === 'front' ? config.coverMap : config.backMap);
    const trickTexture = assetMap.get(config.coverTrickMap);

    if (artTexture) artTexture.colorSpace = THREE.SRGBColorSpace;
    if (trickTexture) trickTexture.colorSpace = THREE.SRGBColorSpace;

   const isFront = side === 'front';
   const glassColor = new THREE.Color(config.color).lerp(new THREE.Color("white"), 0.7);
   const groupPosition = isFront ? [PAGE_WIDTH / 2, 0, 0] : [0, 0, 0];

    return (
        <group position={groupPosition}>
            <Box args={[PAGE_WIDTH, PAGE_HEIGHT, COVER_THICKNESS]} >
                <meshPhysicalMaterial
                    color={glassColor}
                    transmission={1}
                    opacity={0.8}
                    roughness={0.15}
                    // INTEL GPU FIX: Set thickness to 0 to disable heavy volumetric refraction. 
                    // Keeps the glass look, drops the 40 FPS tax.
                    thickness={0} 
                    ior={1.42}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    specularIntensity={1}
                    clearcoat={1.0}
                    clearcoatRoughness={0.05}
                />
            </Box>
            {side === 'front' && (
                <>
                    <Plane args={[PAGE_WIDTH, PAGE_HEIGHT]} position-z={0.02}>
                        <meshBasicMaterial  map={artTexture} transparent depthWrite={false} side={THREE.DoubleSide} />
                    </Plane>
                </>
            )}
        </group>
    );
}

export function Spine({ config, assetMap  }) {
    const spineTexture = assetMap.get(config.spineMap);
    if(spineTexture) spineTexture.colorSpace = THREE.SRGBColorSpace;
    return (
        <mesh>
            <boxGeometry args={config.spineSize} />
            <meshStandardMaterial map={spineTexture} metalness={0.1} roughness={0.5} />
        </mesh>
    );
};