// src/utils/CameraRig.jsx
import { useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react'; // Make sure to install/import this
import gsap from 'gsap';
import { useBookStore } from './store';
import { useShallow } from 'zustand/react/shallow';

export function CameraRig() {
  const { camera } = useThree();
  
  // 1. OPTIMIZATION: Select only what we need to avoid re-running logic unnecessarily
  const { currentSection, deviceType, exitMode } = useBookStore(
    useShallow((state) => ({
      currentSection: state.currentSection,
      deviceType: state.deviceType,
      exitMode: state.exitMode
    }))
  );

  useGSAP(() => {
    // Mobile Check - Keep it simple
    if (deviceType === 'mobile') {
      gsap.to(camera.position, { x: 0, duration: 0.5, overwrite: true });
      return;
    }

    let targetX = 0;

    // --- LOGIC TARGETS ---
    if (currentSection === 0 || currentSection === 3) {
      targetX = 0;
    } 
    else if (currentSection === 1) { // Section 2 (Bookshelf)
      // If we are exiting up or down, center the camera
      if (exitMode && (exitMode.includes('UP') || exitMode.includes('DOWN'))) {
        targetX = 0;
      } else {
        targetX = -1.5; // Pan Left to show shelf
      }
    } 
    else if (currentSection === 2) { // Section 3 (Contact)
       if (exitMode === 'EXIT_SEC_3_UP') targetX = 0;
       else targetX = 0; // Pan Right for contact panel
    }

    // --- EXECUTE ANIMATION ---
    // overwrite: true is the key to fixing "Teleporting". 
    // It kills any active animation on camera.position and starts fresh from current spot.
    gsap.to(camera.position, {
      x: targetX,
      duration: 1.5, // Nice and slow cinematic pan
      ease: "power2.inOut",
      overwrite: true 
    });

  }, [currentSection, exitMode, deviceType]); // Rerun whenever these change

  return null;
}