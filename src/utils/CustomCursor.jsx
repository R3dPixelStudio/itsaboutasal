import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useBookStore } from './store';

export function CustomCursor() {
  const { deviceType } = useBookStore();
  
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  
  // Logic Refs
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const cursorSpeed = 0.15;
  const isHovering = useRef(false);
  const hasMoved = useRef(false); // Fix: Track if mouse has actually moved

  useEffect(() => {
    // 1. Mobile Safety: If device is definitely mobile, return early.
    // (But we also handle the "lag" case via opacity below)
    if (deviceType === 'mobile') return;

    // 2. Initial State: HIDE IMMEDIATELY
    gsap.set(cursorRef.current, { opacity: 0 });
    gsap.set(dotRef.current, { opacity: 0 });

    const setCursorX = gsap.quickSetter(cursorRef.current, "x", "px");
    const setCursorY = gsap.quickSetter(cursorRef.current, "y", "px");
    const setDotX = gsap.quickSetter(dotRef.current, "x", "px");
    const setDotY = gsap.quickSetter(dotRef.current, "y", "px");

    const onMouseMove = (e) => {
      // 3. REVEAL ONLY ON MOVEMENT
      // This ensures it never shows up on touch devices (which don't fire mousemove)
      if (!hasMoved.current) {
        hasMoved.current = true;
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.4 });
        gsap.to(dotRef.current, { opacity: 1, duration: 0.4 });
      }

      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      setDotX(e.clientX);
      setDotY(e.clientY);
    };

    let animationFrameId;
    const loop = () => {
      delayedMouse.current.x += (mouse.current.x - delayedMouse.current.x) * cursorSpeed;
      delayedMouse.current.y += (mouse.current.y - delayedMouse.current.y) * cursorSpeed;

      setCursorX(delayedMouse.current.x);
      setCursorY(delayedMouse.current.y);
      
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    const onMouseDown = () => {
        gsap.to(cursorRef.current, { scale: 0.8, duration: 0.15, ease: "power2.out" });
        gsap.to(dotRef.current, { scale: 1.5, duration: 0.15, ease: "power2.out" });
    };

    const onMouseUp = () => {
        gsap.to(cursorRef.current, { scale: isHovering.current ? 1.5 : 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
        gsap.to(dotRef.current, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    };

    const onMouseOver = (e) => {
        const target = e.target;
        const isLink = target.tagName === 'A' || 
                       target.tagName === 'BUTTON' ||
                       target.closest('a') || 
                       target.closest('button') ||
                       target.classList.contains('cursor-pointer') ||
                       target.classList.contains('cursor-grab');

        if (isLink) {
            isHovering.current = true;
            gsap.to(cursorRef.current, { scale: 1.5, opacity: 1, duration: 0.3 });
        }
    };

    const onMouseOut = (e) => {
        const target = e.target;
        const isLink = target.tagName === 'A' || 
                       target.tagName === 'BUTTON' ||
                       target.closest('a') || 
                       target.closest('button') ||
                       target.classList.contains('cursor-pointer') ||
                       target.classList.contains('cursor-grab');
                       
        if (isLink) {
            isHovering.current = false;
            gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 }); // Keep opacity 1 if moved
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, [deviceType]);

  if (deviceType === 'mobile') return null;

  return (
    <>
      <style>{`
        body, a, button, input, textarea, .cursor-pointer, .cursor-grab {
          cursor: none !important;
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{ 
            transform: 'translate(-50%, -50%)',
            border: '2px solid white',
            opacity: 0 // Default CSS hidden
        }} 
      >
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ animation: 'orbitSpin 4s linear infinite' }}
        >
            <div className="w-1.5 h-1.5 bg-white rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>
      
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ 
            transform: 'translate(-50%, -50%)', 
            opacity: 0 // Default CSS hidden
        }} 
      />
    </>
  );
}