import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGesture } from '@use-gesture/react';
import { useBookStore } from '../store.js';

const BASE = import.meta.env.BASE_URL;

const PROJECTS = [
  { 
    id: 1, title: 'Earth Experimental Museum', number: '01.', color: '#010ed9', 
    img: `${BASE}textures/Books/book1/2k/book1-back.jpg`,
    pages: Array.from({ length: 6 }, (_, i) => `${BASE}textures/Books/book1/2k/book1-page${i + 1}.jpg`)
  },
  { 
    id: 2, title: 'Jaryan Residential', number: '02.', color: '#9ddbda', 
    img: `${BASE}textures/Books/book2/2k/book2-back.jpg`, 
    pages: Array.from({ length: 8 }, (_, i) => `${BASE}textures/Books/book2/2k/book2-page${i + 1}.jpg`)
  },
  { 
    id: 3, title: 'Hormozan Hospital', number: '03.', color: '#99c704', 
    img: `${BASE}textures/Books/book3/2k/book3-back.jpg`, 
    pages: Array.from({ length: 8 }, (_, i) => `${BASE}textures/Books/book3/2k/book3-page${i + 1}.jpg`)
  },
  { 
    id: 4, title: 'The Architect House', number: '04.', color: '#3B82F6', 
    img: `${BASE}textures/Books/book4/2k/book4-back.jpg`, 
    pages: Array.from({ length: 5 }, (_, i) => `${BASE}textures/Books/book4/2k/book4-page${i + 1}.jpg`)
  }
];

export default function MobileSection2() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const setScrollDisabled = useBookStore((state) => state.setScrollDisabled);
  
  const colsRef = useRef([]);
  const imgsRef = useRef([]);
  const textsRef = useRef([]);
  const numbersRef = useRef([]); 
  
  const overlayRef = useRef(null);
  const zoomTargetRef = useRef(null);
  const filmRollRef = useRef(null);
  
  const timelineRef = useRef(null);
  const autoScrollTween = useRef(null);

  const transformState = useRef({ x: 0, y: 0, scale: 1 });

  const startAutoScroll = () => {
    if (autoScrollTween.current) autoScrollTween.current.kill();
    
    // Faster scroll
    autoScrollTween.current = gsap.to(transformState.current, {
        x: transformState.current.x - 800, 
        duration: 20,
        ease: 'none',
        onUpdate: applyTransform,
        onComplete: startAutoScroll
    });
  };

  useGesture(
    {
      onDragStart: () => {
        if (autoScrollTween.current) autoScrollTween.current.kill(); 
      },
      onDrag: ({ offset: [dx, dy] }) => {
        if (expandedIndex === null) return;
        transformState.current.x = dx;
        transformState.current.y = dy;
        applyTransform();
      },
      onDragEnd: ({ velocity: [vx], direction: [dirX] }) => {
        if (expandedIndex !== null) {
          // MAGIC FIX: Calculate Swipe Velocity!
          if (vx > 0.2) { 
              if (autoScrollTween.current) autoScrollTween.current.kill();
              
              // Give it a physical slide based on how hard they swiped
              const boost = vx * 500 * dirX; 
              // Respect the bounds so it doesn't shoot off the screen
              const targetX = Math.max(-3500, Math.min(100, transformState.current.x + boost));
              
              autoScrollTween.current = gsap.to(transformState.current, {
                  x: targetX,
                  duration: 1.0 + (vx * 0.2), // The harder they swipe, the longer the slide lasts
                  ease: "power3.out", // Starts fast, physically slows down
                  onUpdate: applyTransform,
                  onComplete: startAutoScroll // Once it slows down, resume the steady creep!
              });
          } else {
              startAutoScroll(); 
          }
        }
      },
      onPinchStart: () => {
        if (autoScrollTween.current) autoScrollTween.current.kill(); 
      },
      onPinch: ({ offset: [d] }) => {
        if (expandedIndex === null) return;
        // Limits zoom into the pixels
        transformState.current.scale = Math.max(1, Math.min(d, 2.5)); 
        applyTransform();
      },
      onPinchEnd: () => {
        if (expandedIndex !== null) startAutoScroll(); 
      }
    },
    {
      target: overlayRef,
      eventOptions: { passive: false }, 
      // Physics boundaries and rubberband trapping
      drag: { 
        from: () => [transformState.current.x, transformState.current.y],
        bounds: { left: -2000, right: 100, top: -100, bottom: 100 },
        rubberband: 0.4
      },
      pinch: { scaleBounds: { min: 1, max: 2.5 }, rubberband: true },
    }
  );

  const applyTransform = () => {
    if (zoomTargetRef.current) {
      zoomTargetRef.current.style.transform = `translate3d(${transformState.current.x}px, ${transformState.current.y}px, 0) scale(${transformState.current.scale})`;
    }
  };

  const handleOpen = (index) => {
    setScrollDisabled(true); 

    if (timelineRef.current) timelineRef.current.kill();
    if (autoScrollTween.current) autoScrollTween.current.kill();
    
    setExpandedIndex(index);
    
    transformState.current = { x: 0, y: 0, scale: 1 };
    applyTransform();

    timelineRef.current = gsap.timeline();

    colsRef.current.forEach((col, i) => {
      if (i === index) {
        timelineRef.current.to(col, { width: '100%', duration: 0.8, ease: 'power3.inOut' }, 0);
        timelineRef.current.to(imgsRef.current[i], { filter: 'grayscale(0%) contrast(100%)', duration: 0.8 }, 0);
        
        timelineRef.current.to(numbersRef.current[i], { 
            color: PROJECTS[i].color, 
            x: '10vw', 
            zIndex: 60, 
            duration: 0.8,
            ease: 'power3.inOut'
        }, 0);

      } else {
        timelineRef.current.to(col, { width: '0%', opacity: 0, duration: 0.8, ease: 'power3.inOut' }, 0);
        timelineRef.current.to(textsRef.current[i], { opacity: 0, duration: 0.4 }, 0); 
      }
    });

    timelineRef.current.to(overlayRef.current, { autoAlpha: 1, duration: 0.4 }, 0.6);

    timelineRef.current.fromTo(filmRollRef.current,
      { x: window.innerWidth }, 
      { 
        x: 0, 
        duration: 0.8, 
        ease: 'power3.out',
        onComplete: startAutoScroll
      },
      0.8
    );
  };

  const handleClose = () => {
    setScrollDisabled(false); 

    if (timelineRef.current) timelineRef.current.kill();
    if (autoScrollTween.current) autoScrollTween.current.kill();

    timelineRef.current = gsap.timeline({
      onComplete: () => setExpandedIndex(null)
    });

    timelineRef.current.to(filmRollRef.current, { x: window.innerWidth, duration: 0.5, ease: 'power3.in' }, 0);
    timelineRef.current.to(overlayRef.current, { autoAlpha: 0, duration: 0.4 }, 0.3);

    colsRef.current.forEach((col, i) => {
      timelineRef.current.to(col, { width: '25%', opacity: 1, duration: 0.8, ease: 'power3.inOut' }, 0.5);
      timelineRef.current.to(imgsRef.current[i], { filter: 'grayscale(100%) brightness(90%) contrast(110%)', duration: 0.8 }, 0.5);
      
      // Color returns to project color instead of gray
      timelineRef.current.to(numbersRef.current[i], { 
          color: PROJECTS[i].color, 
          x: 0, 
          zIndex: 1, 
          duration: 0.8,
          ease: 'power3.inOut'
      }, 0.5); 

      timelineRef.current.to(textsRef.current[i], { opacity: 1, duration: 0.4 }, 0.9);
    });
  };

  return (
    <div className="absolute inset-0 pt-20 pb-safe overflow-hidden bg-[#f4f4f4] flex flex-row select-none">
      
      <div className="w-[85%] flex flex-row h-[85%] mt-8 mb-auto px-2">
        {PROJECTS.map((proj, i) => (
          <div 
            key={proj.id} 
            ref={el => colsRef.current[i] = el}
            style={{ width: '25%' }} 
            className="h-full flex flex-col px-1 cursor-pointer relative select-none"
            onClick={() => handleOpen(i)}
          >
            {/* Set the initial solid color for the numbers here! */}
            <span 
               ref={el => numbersRef.current[i] = el}
               style={{ color: proj.color }}
               className="relative w-fit text-4xl font-light mb-2 block shrink-0 select-none"
            >
                {proj.number}
            </span>
              
            <div className="flex-1 w-full min-h-0 bg-gray-200 overflow-hidden mb-3 relative rounded-md pointer-events-none select-none">
                <img 
                  ref={el => imgsRef.current[i] = el}
                  src={proj.img} 
                  alt={proj.title} 
                  draggable="false" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 select-none" 
                  style={{ filter: 'grayscale(100%) brightness(90%) contrast(110%)' }} 
                />
            </div>
              
            <div ref={el => textsRef.current[i] = el} className="h-20 shrink-0 flex items-start select-none">
                <p 
                  style={{ color: proj.color }} 
                  className="text-xs font-semibold leading-tight whitespace-normal break-words pr-1 select-none"
                >
                  {proj.title}
                </p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-[15%] h-[85%] mt-8 flex justify-center items-end pb-8 pointer-events-none select-none">
        <span 
          className="text-gray-600 text-3xl font-light tracking-[0.4em]"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          CONTENT
        </span>
      </div>

      <div 
        ref={overlayRef} 
        className="absolute inset-0 z-50 invisible bg-[#f4f4f4]/85 backdrop-blur-md touch-none overflow-hidden select-none"
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
          className="absolute top-26 right-6 z-50 w-12 h-12 bg-white/90 shadow-xl border border-gray-200 rounded-full flex items-center justify-center text-gray-800 text-xl font-bold cursor-pointer active:scale-90 transition-transform select-none"
        >
          ✕
        </button>

        {expandedIndex !== null && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-black/60 text-white px-5 py-2 rounded-full text-xs animate-pulse opacity-80 pointer-events-none shadow-lg whitespace-nowrap select-none">
            Pinch to zoom • Drag to pan
          </div>
        )}

        <div ref={zoomTargetRef} className="w-full h-full flex items-center will-change-transform cursor-grab active:cursor-grabbing select-none">
          <div ref={filmRollRef} className="flex flex-row gap-0 items-center px-[10vw]">
            
            {/* THE MAGIC FIX: Dynamic mapping for First and Last Pages */}
            {expandedIndex !== null && PROJECTS[expandedIndex].pages.map((pageSrc, idx, arr) => {
              const isFirst = idx === 0;
              const isLast = idx === arr.length - 1;
              
              // Standard layout for middle pages
              let containerClass = "w-[85vw]";
              let imgClass = "w-full";

              if (isFirst) {
                // First Page: Container becomes half width, image shifts left to show Right Half
                containerClass = "w-[42.5vw]";
                imgClass = "w-[85vw] max-w-[85vw] -translate-x-1/2";
              } else if (isLast) {
                // Last Page: Container becomes half width, image shifts left to show Right Half
                // (NOTE: If you actually need to show the LEFT half of the final page, change "-translate-x-1/2" to "translate-x-0")
                containerClass = "w-[42.5vw]";
                imgClass = "w-[85vw] max-w-[85vw] -translate-x-1/2"; 
              }

              return (
                <div 
                  key={`page-${idx}`} 
                  className={`flex-shrink-0 ${containerClass} overflow-hidden shadow-xl pointer-events-none select-none`}
                >
                  <img 
                    src={pageSrc} 
                    alt={`Page ${idx + 1}`} 
                    draggable="false" 
                    className={`${imgClass} h-auto object-cover bg-white select-none`} 
                  />
                </div>
              );
            })}

          </div>
        </div>
      </div>

    </div>
  );
}