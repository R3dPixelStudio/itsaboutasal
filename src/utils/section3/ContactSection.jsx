// src/utils/section3/ContactSection.jsx
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGesture } from '@use-gesture/react';
import { SECTION_3_ASSETS } from '../Configs';
import { useBookStore } from '../store';
import { useGSAP } from '@gsap/react';
import { useShallow } from 'zustand/react/shallow';

export function ContactSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false); 
  const containerRef = useRef(null);
  const zoomTargetRef = useRef(null); 
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  const transformState = useRef({ x: 0, y: 0, scale: 1 });

  const { deviceType, currentSection, exitMode, setScrollDisabled } = useBookStore(
    useShallow((state) => ({
      deviceType: state.deviceType,
      currentSection: state.currentSection,
      exitMode: state.exitMode,
      setScrollDisabled: state.setScrollDisabled 
    }))
  );

  useGSAP(() => {
    const panel = containerRef.current.querySelector('.white-panel');
    if (panel) gsap.set(panel, { x: '100%' }); 
  }, { scope: containerRef });

  // --- GESTURE LOGIC: Pinch & Pan ---
  const applyTransform = () => {
    if (zoomTargetRef.current) {
      zoomTargetRef.current.style.transform = `translate3d(${transformState.current.x}px, ${transformState.current.y}px, 0) scale(${transformState.current.scale})`;
    }
  };

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        if (!isOpen) return; 
        if (deviceType !== 'mobile' && !isZoomed) return; 
        
        transformState.current.x = dx;
        transformState.current.y = dy;
        applyTransform();
      },
      onPinch: ({ offset: [d] }) => {
        if (!isOpen || deviceType !== 'mobile') return; 
        transformState.current.scale = Math.max(1, Math.min(d, 4)); 
        applyTransform();
      }
    },
    {
      target: zoomTargetRef,
      eventOptions: { passive: false }, 
      drag: { from: () => [transformState.current.x, transformState.current.y] },
      pinch: { scaleBounds: { min: 1, max: 4 }, rubberband: true },
    }
  );

  // --- DESKTOP DOUBLE-CLICK LOGIC ---
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (deviceType === 'mobile' || !isOpen) return;

    if (isZoomed) {
      setIsZoomed(false);
      transformState.current = { x: 0, y: 0, scale: 1 };
      applyTransform();
    } else {
      setIsZoomed(true);
      transformState.current.scale = 1.6; 
      applyTransform();
    }
  };

  // --- ANIMATION LOOP ---
  useEffect(() => {
    const isMobile = deviceType === 'mobile';
    const isActive = currentSection === 2 && !exitMode;

    const q = (selector) => containerRef.current?.querySelector(selector);
    const targets = {
      panel: q('.white-panel'),
      leftCol: q('.left-column'),
      img: q('.profile-img'),
      content: q('.content-right'),
      textWrapper: q('.text-wrapper'),
      indicator: q('.zoom-indicator'),
      swipeButton: q('.swipe-button'),
      closeButton: q('.close-button')
    };

    if (!targets.panel) return;

    if (isActive && isOpen) {
      setScrollDisabled(true);
    } else {
      setScrollDisabled(false);
    }

    // --- CASE 1: EXIT (User scrolled away) ---
    if (!isActive) {
      gsap.to(targets.panel, { x: '130%', duration: 0.8, ease: 'power3.in', overwrite: true });
      gsap.to(targets.swipeButton, { autoAlpha: 1, duration: 0.8, overwrite: true });
      
      // MAGIC CLEANUP: Added targets.content to the kill-list using autoAlpha to ensure it vanishes perfectly
      gsap.to([targets.closeButton, targets.indicator, targets.content], { autoAlpha: 0, duration: 0.3, overwrite: true });
      
      if (!isMobile) {
        gsap.to(targets.leftCol, { width: '75%', opacity: 1, duration: 0.8, overwrite: true });
        gsap.to(targets.textWrapper, { scale: 1, x: 0, duration: 0.8, overwrite: true });
      } else {
        gsap.to(targets.textWrapper, { opacity: 1, duration: 0.6, overwrite: true });
      }
      if (isOpen) setIsOpen(false);
      return;
    }

    // --- CASE 2: ACTIVE (User is on Section 3) ---
    if (isOpen) {
      // MAGIC CLEANUP: Removed 'stagger' and replaced 'opacity' with 'autoAlpha' for robust rendering
      gsap.to(targets.content, { autoAlpha: 1, duration: 0.5, delay: 0.3, overwrite: true });
      gsap.to(targets.indicator, { autoAlpha: 1, duration: 0.5, delay: 0.6 }); 
      
      gsap.to(targets.swipeButton, { autoAlpha: 0, duration: 0.3, overwrite: true });
      gsap.to(targets.closeButton, { autoAlpha: 1, duration: 0.5, delay: 0.4, overwrite: true });

      if (!isMobile) {
        gsap.to(targets.panel, { x: '0%', width: '66.67%', duration: 1.0, ease: 'power2.inOut', overwrite: true });
        gsap.to(targets.leftCol, { width: '33.33%', duration: 1.0, ease: 'power2.inOut', overwrite: true });
        gsap.to(targets.textWrapper, { scale: 0.8, x: 0, duration: 1.0, ease: 'power2.inOut', overwrite: true });
      } else {
        gsap.to(targets.panel, { x: '0%', width: '100%', duration: 0.8, ease: 'power2.inOut', overwrite: true });
        gsap.to(targets.img, { x: '100%', opacity: 0, duration: 0.6, overwrite: true }); 
        gsap.to(targets.textWrapper, { opacity: 0, duration: 0.5, overwrite: true });
      }
    } 
    else {
      // === PREVIEW STATE ===
      // MAGIC CLEANUP: Used autoAlpha here as well to safely hide the SVG
      gsap.to(targets.content, { autoAlpha: 0, duration: 0.3, overwrite: true }); 
      gsap.to([targets.indicator, targets.closeButton], { autoAlpha: 0, duration: 0.2, overwrite: true }); 
      
      gsap.to(targets.swipeButton, { autoAlpha: 1, duration: 0.5, delay: 0.4, overwrite: true });

      setIsZoomed(false);
      transformState.current = { x: 0, y: 0, scale: 1 };
      applyTransform();

      if (!isMobile) {
        gsap.to(targets.panel, { x: 'calc(100% - 8rem)', width: '25%', duration: 1.2, ease: 'power3.out', overwrite: true });
        gsap.to(targets.leftCol, { width: '75%', duration: 1.2, overwrite: true });
        gsap.to(targets.textWrapper, { scale: 1, x: 0, duration: 1.2, overwrite: true });
        gsap.to(targets.img, { x: '0%', opacity: 1, duration: 0.6, overwrite: true });
      } else {
        gsap.to(targets.panel, { x: '70%', width: '100%', duration: 1.2, ease: 'power3.out', overwrite: true });
        gsap.to(targets.img, { x: '-50%', opacity: 1, duration: 0.6, overwrite: true });
        gsap.to(targets.textWrapper, { opacity: 1, duration: 1.2, overwrite: true });
      }
    }
  }, [currentSection, isOpen, deviceType, exitMode, setScrollDisabled]);

  // --- HANDLERS ---
  const stopProp = (e) => e.stopPropagation();

  const handlePointerDown = (e) => {
    if (isOpen) return; 
    stopProp(e);
    e.target.setPointerCapture(e.pointerId);
    touchStartX.current = e.clientX;
    isSwiping.current = false;
  };

  const handlePointerUp = (e) => {
    if (isOpen) return; 
    stopProp(e);
    if (e.target.hasPointerCapture(e.pointerId)) {
       e.target.releasePointerCapture(e.pointerId);
    }
    if (Math.abs(e.clientX - touchStartX.current) > 50) {
      isSwiping.current = true;
      if (!isOpen && e.clientX < touchStartX.current) {
        setIsOpen(true);
      }
    }
  };

  const handleClick = (e) => {
    if (isOpen) return; 
    stopProp(e);
    if (!isSwiping.current && !isOpen) {
      setIsOpen(true);
    }
    isSwiping.current = false;
  };

  const handleCloseClick = (e) => {
    stopProp(e);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none flex">
      
      <div className="left-column h-full z-10 flex items-center w-full md:w-[75%] overflow-hidden">
        <div className="text-wrapper p-4 pt-10 md:p-16 w-[90%] md:w-[80%] flex flex-col justify-center cursor-default origin-left">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-16 h-16 md:w-48 md:h-48 mb-4  pointer-events-none" />
          <h1 className="text-xl md:text-5xl sm:text-4xl font-bold text-black max-w-4xl mb-2">ASAL KOJVARZADEH NOBARI</h1>
          <h2 className="text-lg md:text-2xl underline mt-1  font-bold text-black mb-8 inline-block">Architect</h2>
          <div className="mt-2 md:mt-1">
            <h3 className="text-base md:text-xl sm:text-lg font-bold mb-2 text-black/80">About Me</h3>
            <p className="sm:text-xs lg:text-sm text-black max-w-full sm:max-w-10xl leading-relaxed">
              I am an architect who is enthusiastic about sustainable architecture. I have a bachelor in Architectural Engineering and I would like to extend my knowledge, career and degree in  this area, My ultimate goal is to bring social attention to this matter and influence more people to act instead of just studying about it. Eventually I love to teach students to keep the information spreading in peoples minds.
            </p>
          </div>
        </div>
      </div>

      <div
        className="white-panel absolute top-0 right-0 h-full bg-white z-20 w-full md:w-[25%] cursor-grab active:cursor-grabbing touch-pan-y"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <button 
          onClick={handleCloseClick} 
          className="close-button absolute top-6 right-6 md:top-8 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 bg-gray-200/60 hover:bg-gray-300/90 shadow-sm rounded-full flex items-center justify-center text-gray-800 text-xl font-bold cursor-pointer active:scale-90 transition-transform invisible opacity-0"
        >
          ✕
        </button>

        <div className="zoom-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/60 text-white px-5 py-2 rounded-full text-xs animate-pulse opacity-0 invisible pointer-events-none shadow-lg whitespace-nowrap">
            {deviceType === 'mobile' ? 'Pinch to zoom • Drag to pan' : 'Double-click to zoom • Drag to pan'}
        </div>

        <div className="profile-img absolute top-16 left-0 transform -translate-x-1/2 z-30 pointer-events-none w-20 h-23 md:w-40 md:h-45 rounded-full border-4 border-white shadow-lg overflow-hidden">
           <img src={`${import.meta.env.BASE_URL}images/asali.jpg`} alt="Portrait" className="w-full h-full object-cover" />
        </div>

        <div className="absolute inset-0 overflow-hidden z-20 pointer-events-none">
          <div 
             ref={zoomTargetRef} 
             // MAGIC CLEANUP: Replaced 'opacity-0' with 'invisible opacity-0' so it strictly respects autoAlpha
             className="content-right invisible opacity-0 w-full h-full absolute inset-0 flex items-center justify-center will-change-transform pointer-events-auto"
             onDoubleClick={handleDoubleClick} 
          >
              <img src={SECTION_3_ASSETS.indesignLayoutSvg} alt="Contact Info" className="w-[85%] h-[85%] object-contain pointer-events-none" />
          </div>
        </div>

        <button className="swipe-button absolute top-1/2 -translate-y-1/2 -left-2 z-40 flex items-center space-x-2 text-black p-2 cursor-pointer w-32 pointer-events-none">
          <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 18L5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-lg md:text-2xl select-none">SWIPE</span>
        </button>

      </div>
    </div>
  );
}