import { useMemo } from 'react';
import { useBookStore } from './store';

export const HtmlSection = ({ children, pageIndex, className, currentSection }) => {
  const { sectionLayouts } = useBookStore();
  
  const topClass = useMemo(() => {
    return sectionLayouts[pageIndex]?.topClass ?? '';
  }, [sectionLayouts, pageIndex]);
  
  const isVisible = pageIndex === currentSection;

  return (
    <div
      // Added 'h-screen' as fallback for older browsers that don't know svh.
      // h-[100svh] overrides it on modern browsers.
      className={`absolute w-full h-screen h-[100svh] pt-20 box-border overflow-hidden ${topClass} ${className || ''}`}
      style={{
         zIndex: isVisible ? 10 : 0 
      }}
      {...(isVisible ? {} : { inert: "true" })}
    >
      {children}
    </div>
  );
};