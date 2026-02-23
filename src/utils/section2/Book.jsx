import { useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import Pages from './FinalPage';
import { Cover, Spine } from './BookParts.jsx';
import { BOOK_TARGETS } from '../Configs.js';
import { useBookStore } from '../store.js';

const PAGE_WIDTH = 1.28;

export default function Book({ config, assetMap }) {
    const groupRef = useRef();
    const frontCoverPivot = useRef();
    const backCoverPivot = useRef();
    const spinePivot = useRef();

    // --- ARMOR CHARMS: Safe fallbacks prevent crashes during frantic window resizing! ---
    const safePosition = config?.position || [0, 0, 0];
    const safeRotation = config?.rotation || [0, Math.PI / 2, 0];
    const safeCoverOffsetFront = config?.coverOffset?.front || [0, 0, 0];
    const safeCoverOffsetBack = config?.coverOffset?.back || [0, 0, 0];
    
    const initialPosition = useMemo(() => new THREE.Vector3(...safePosition), [safePosition]);
    const initialRotation = useMemo(() => new THREE.Euler(...safeRotation), [safeRotation]);
    const motion = config?.motion || { pullZ: 0.6, flyRotation: [0, Math.PI/2, 0] };

    const { 
        selectedBookId,
        currentPage,
        bookState,
        selectBook,
        deviceType,
        setBookInteractive,
        resetBookSelection,
        setBookStateToClosing
    } = useBookStore();

    const isSelected = selectedBookId === config?.id;
    // Fallback for target config as well!
    const targetConfig = BOOK_TARGETS[deviceType] || { position: [0,0,0], rotation: [0,0,0] };

    const handleSelect = () => {
        if (bookState === 'SHELF' && config) {
            selectBook(config.id, config.pages?.length || 0);
        }
    };

    const handleFlipBackComplete = useCallback(() => {
        setBookStateToClosing();
    }, [setBookStateToClosing]);

    useGSAP(() => {
        if (isSelected && bookState === 'OPENING') {
            const tl = gsap.timeline({ onComplete: () => setBookInteractive() });
            
            tl.to(groupRef.current.position, {
                z: initialPosition.z + motion.pullZ, 
                duration: 0.4,
                ease: "power2.out"
            });
            tl.to(groupRef.current.rotation, {
                x: motion.flyRotation[0],
                y: motion.flyRotation[1],
                z: motion.flyRotation[2],
                duration: 0.3
            }, "<"); 

            tl.to(groupRef.current.position, {
                x: targetConfig.position[0],
                y: targetConfig.position[1],
                duration: 0.8,
                ease: "power2.inOut"
            }, ">-0.1");
            
            tl.to(groupRef.current.rotation, {
                x: targetConfig.rotation[0],
                y: targetConfig.rotation[1],
                z: targetConfig.rotation[2],
                duration: 0.8,
                ease: "power2.inOut"
            }, "<"); 

            tl.to(groupRef.current.position, {
                z: targetConfig.position[2],
                duration: 0.6,
                ease: "power3.out"
            }, ">-0.4");

            tl.to(frontCoverPivot.current.rotation, { y: -Math.PI, duration: 1.2, ease: "power2.inOut" }, "-=0.8");
            tl.to(spinePivot.current.rotation, { y: 0, duration: 1.0, ease: "power2.inOut" }, "<" );
        } 
        
        else if (isSelected && bookState === 'CLOSING') {
            const tl = gsap.timeline({
                 onComplete: () => { resetBookSelection() }
            });

            tl.to(frontCoverPivot.current.rotation, { y: 0, duration: 0.8, ease: "power2.inOut" });
            tl.to(spinePivot.current.rotation, { y: -Math.PI / 2, duration: 0.5, ease: "power2.inOut" }, "<0.1");
            tl.to(frontCoverPivot.current.position, { z: safeCoverOffsetFront[2], duration: 0.1 }, "<");
            tl.to(backCoverPivot.current.position, { z: safeCoverOffsetBack[2], duration: 0.1 }, "<");

            tl.to(groupRef.current.position, {
                z: initialPosition.z + motion.pullZ, 
                duration: 0.5,
                ease: "power2.in"
            }, "<0.3");

            tl.to(groupRef.current.position, {
                x: initialPosition.x,
                y: initialPosition.y,
                duration: 0.7,
                ease: "power2.inOut"
            });
            tl.to(groupRef.current.rotation, {
                x: motion.flyRotation[0],
                y: motion.flyRotation[1],
                z: motion.flyRotation[2],
                duration: 0.7,
                ease: "power2.inOut"
            }, "<");

            tl.to(groupRef.current.position, {
                z: initialPosition.z,
                duration: 0.4,
                ease: "back.out(1.2)"
            });
            tl.to(groupRef.current.rotation, {
                x: initialRotation.x,
                y: initialRotation.y,
                z: initialRotation.z,
                duration: 0.4,
                ease: "power1.out"
            }, "<");
        }
    }, {dependencies: [isSelected, bookState, config, deviceType]});

    // If React throws us an empty shell during a rapid resize, we peacefully render nothing!
    if (!config) return null;

    return (
        <group 
            ref={groupRef} 
            position={initialPosition} 
            rotation={initialRotation}
            onClick={(e) => { e.stopPropagation(); handleSelect(); }}
        >
            <group ref={backCoverPivot} position={safeCoverOffsetBack}>
                 <Cover config={config} side="back" assetMap={assetMap} renderOrder={1} />
            </group>
            <group ref={frontCoverPivot} position={safeCoverOffsetFront} >
                <Cover  config={config} side="front" assetMap={assetMap} renderOrder={(config.pages?.length || 0) + 2} />
            </group>
            <group ref={spinePivot} rotation={[0,Math.PI/2,0]} position={[-PAGE_WIDTH/2,0,0]}>
                <Spine config={config} assetMap={assetMap} />
            </group>
            <group position={[-PAGE_WIDTH/2,0,0.05]} rotation={[0,0,0]}>
                <Pages config={config} assetMap={assetMap} currentPage={isSelected ? currentPage : 0} isBookClosed={!isSelected || bookState !== 'INTERACTIVE'} onFlipBackComplete={handleFlipBackComplete} bookState={bookState}  />
            </group>
        </group>
  );
}