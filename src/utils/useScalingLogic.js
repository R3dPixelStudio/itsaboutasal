import { useEffect } from 'react';

export function useScalingLogic() {
  useEffect(() => {
    const setSize = () => {
      // Ah, simplicity. We want 1rem to be roughly 16px, but slightly responsive.
      // We DO NOT divide by pixelRatio, or retina screens will render text as ants!
      
      // Desktop base: 16px
      // Mobile base: We clamp it so it doesn't get too small or too huge.
      // logic: minimum 14px, preferred 1vw + 12px, max 18px
      // You can adjust these numbers, but this keeps UI sane.
      
      const viewportWidth = window.innerWidth;
      let fontSize = 16;

      if (viewportWidth < 768) {
          // Mobile/Tablet
          fontSize = 14 + (viewportWidth / 1000); 
      } else {
          // Desktop
          fontSize = 16 + (viewportWidth / 2000);
      }

      document.documentElement.style.fontSize = `${fontSize}px`;
    };

    // Run on mount
    setSize();

    // Run on resize
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, []);
}

