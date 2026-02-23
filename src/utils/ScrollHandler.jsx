import { useEffect, useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useBookStore } from './store';
import { SCROLL_CONFIG } from './Configs.js';

export default function ScrollHandler() {
  const scroll = useScroll();
  const { size } = useThree(); 
  
  const isLocked = useRef(false);
  const touchStartY = useRef(0);
  const scrollFunctionsRef = useRef(null);

  const {
    currentSection,
    setCurrentSection,
    setExitMode,
    deviceType,
    scrollToSection,
    setScrollToSection,
  } = useBookStore();

  const config = SCROLL_CONFIG[deviceType] || SCROLL_CONFIG.desktop;
  const pages = config.pages;
  // If we have 4 pages, we have 3 "steps" to scroll (0 -> 1 -> 2 -> 3)
  const scrollDenominator = Math.max(1, pages - 1);

  // --- CORE SCROLL FUNCTION ---
  const performScroll = (targetPage, speed = 1.0) => {
      const el = scroll.el;
      
      // CRITICAL FIX: Proportional Math
      // We calculate the maximum possible scroll distance (scrollHeight - clientHeight)
      // Then we jump to the percentage needed for the target page.
      const maxScroll = el.scrollHeight - el.clientHeight;
      const targetScrollTop = (targetPage / scrollDenominator) * maxScroll;

      gsap.to(el, {
        scrollTop: targetScrollTop,
        duration: speed,
        ease: 'power3.inOut',
        onStart: () => { isLocked.current = true; },
        onComplete: () => {
          setCurrentSection(targetPage); 
          setExitMode(null);
          isLocked.current = false;
        },
      });
  };

  useEffect(() => {
    const el = scroll.el;
    
    // Force CSS to lock native scrolling
    el.style.overflow = 'hidden'; 
    el.style.touchAction = 'none';

    // --- EXIT ANIMATION HELPERS ---
    const sequenceExit = (exitSignal, targetPage) => {
        setExitMode(exitSignal); 
        gsap.delayedCall(0.8, () => performScroll(targetPage));
    };

    const parallelExit = (exitSignal, targetPage) => {
        setExitMode(exitSignal);
        performScroll(targetPage);
    };

    // --- MAIN LOGIC ROUTER ---
    const handleScrollAttemptInternal = (direction) => {
      if (isLocked.current) return;

      let targetPage = currentSection;
      
      if (direction === 'down') targetPage = Math.min(currentSection + 1, pages - 1);
      if (direction === 'up') targetPage = Math.max(currentSection - 1, 0);

      if (targetPage === currentSection) return;

      isLocked.current = true;

      // Special Section Transitions
      if (currentSection === 1 && targetPage === 0) { sequenceExit('EXIT_SEC_2_UP', 0); return; }
      if (currentSection === 1 && targetPage === 2) { parallelExit('EXIT_SEC_2_DOWN', 2); return; }
      if (currentSection === 2 && targetPage === 1) { parallelExit('EXIT_SEC_3_UP', 1); return; }
      if (currentSection === 2 && targetPage === 3) { sequenceExit('EXIT_SEC_3_DOWN', 3); return; }

      performScroll(targetPage);
    };

    scrollFunctionsRef.current = { performScroll, handleScrollAttemptInternal };

    // --- DESKTOP INPUT (Wheel) ---
    const handleWheel = (e) => {
      // MAGIC WARD: Ignore mouse wheels if the film roll is open!
      if (useBookStore.getState().isScrollDisabled) return;

      if (Math.abs(e.deltaY) > 20) {
          handleScrollAttemptInternal(e.deltaY > 0 ? 'down' : 'up');
      }
    };

    // --- MOBILE INPUT (Touch Swipes) ---
    const handleTouchStart = (e) => {
        // MAGIC WARD: Ignore touch starts if the film roll is open!
        if (useBookStore.getState().isScrollDisabled) return;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        // MAGIC WARD: Let native pinch/pan work if the film roll is open!
        if (useBookStore.getState().isScrollDisabled) return;
        
        // Prevent native scrolling otherwise
        if(e.cancelable) e.preventDefault();
    };

    const handleTouchEnd = (e) => {
        // MAGIC WARD: Ignore swipes if the film roll is open!
        if (useBookStore.getState().isScrollDisabled) return;

        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        const threshold = 50; 

        if (deltaY > threshold) {
            handleScrollAttemptInternal('down');
        } else if (deltaY < -threshold) {
            handleScrollAttemptInternal('up');
        }
    };

    // --- RESIZE HANDLER ---
    // Keeps sections aligned if window size changes
    const handleResize = () => {
       if (!isLocked.current) {
           const maxScroll = el.scrollHeight - el.clientHeight;
           const currentIdx = useBookStore.getState().currentSection;
           el.scrollTop = (currentIdx / scrollDenominator) * maxScroll;
       }
    };

    // Attach Listeners
    el.addEventListener('wheel', handleWheel, { passive: false });
    
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });

    window.addEventListener('resize', handleResize);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, [scroll, currentSection, size, setExitMode, pages, scrollDenominator, setCurrentSection]);

  // --- NAV BAR LISTENER ---
  useEffect(() => {
    if (scrollToSection === null || scrollToSection === currentSection) return;
    if (!scrollFunctionsRef.current) return;

    isLocked.current = false;
    const targetPage = scrollToSection;
    setScrollToSection(null);
    
    // Always use PerformScroll for nav clicks
    scrollFunctionsRef.current.performScroll(targetPage, 0.8);

  }, [scrollToSection, currentSection, scroll, size, scrollDenominator, setCurrentSection, setExitMode, setScrollToSection]);

  return null;
}