import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HandwrittenSignature } from './HandwrittenSignature';
import { SECTION_4_ASSETS } from '../Configs';
import { useBookStore } from '../store';

// ==========================================
// 1. DESKTOP LAYOUT (LOCKED - PERFECT)
// ==========================================
const DesktopLayout = ({ currentSection }) => {
  const footerRef = useRef(null);
  
  useGSAP(() => {
    // Start Hidden (Pushed down)
    gsap.set(footerRef.current, { yPercent: 100, opacity: 1, visibility: 'visible' });

    if (currentSection === 3) {
      // Slide Up
      gsap.to(footerRef.current, { yPercent: 0, duration: 1.0, ease: 'power3.out' });

      // Buttons & Title
      gsap.fromTo('.contact-item', 
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'back.out(1.7)' }
      );
      gsap.fromTo('.contact-title',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      );
    } else {
      // Slide Down
      gsap.to(footerRef.current, { yPercent: 100, duration: 0.8, ease: 'power3.in' });
      
      // Reset Elements
      gsap.to('.contact-item', { opacity: 0, duration: 0.3 });
      gsap.to('.contact-title', { opacity: 0, duration: 0.3 });
    }
  }, [currentSection]);

  const handleLinkClick = (e) => {
    gsap.fromTo(e.currentTarget, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 relative overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col items-center pb-32 relative z-10">
        <div className="w-full max-w-md mb-10">
          <HandwrittenSignature onComplete={() => {}} />
        </div>
        <h2 className="contact-title text-3xl font-bold mb-10 opacity-0 text-black">Get in touch!</h2>
        <div className="flex flex-row gap-8 justify-center items-center w-full mb-20">
           <ContactButton icon={SECTION_4_ASSETS.emailIcon} text="Email Me" onClick={handleLinkClick} href="mailto:your.email@example.com" />
           <ContactButton icon={SECTION_4_ASSETS.linkedinIcon} text="LinkedIn" onClick={handleLinkClick} href="#" />
           <ContactButton icon={SECTION_4_ASSETS.instagramIcon} text="Instagram" onClick={handleLinkClick} href="#" />
        </div>
      </div>
      <div ref={footerRef} className="absolute bottom-0 left-0 w-full h-[15vh] flex flex-row items-center justify-between px-16 text-gray-300 bg-zinc-900 z-[100]"
           style={{ background: 'linear-gradient(to bottom, #1a1a1a, #000000)', boxShadow: '0 -10px 30px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center space-x-4">
            <img src="/images/R1 option 2.png" alt="Logo" className="h-16 w-auto" />
            <span className="text-base">© 2026 Red Pixel Studio</span>
        </div>
        <div className="text-sm text-gray-500">Designed & Developed with ❤️</div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MOBILE LAYOUT (OFFSET FIX)
// ==========================================
const MobileLayout = ({ currentSection }) => {
  // Fix: Subtract 5rem (approx 80px) to account for HtmlSection's 'pt-20'.
  // This pulls the footer up exactly enough to be visible on screen.
  const [mobileHeight, setMobileHeight] = useState('calc(100vh - 5rem)');

  useEffect(() => {
    const handleResize = () => {
      // Precise JS Calculation: Viewport Height - 80px (padding)
      setMobileHeight(`${window.innerHeight - 80}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    if (currentSection === 3) {
      gsap.fromTo('.m-contact-item', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2 }
      );
      gsap.fromTo('.m-title', { opacity: 0 }, { opacity: 1, duration: 0.6 });
    } else {
      gsap.to('.m-contact-item', { opacity: 0, duration: 0.3 });
      gsap.to('.m-title', { opacity: 0, duration: 0.3 });
    }
  }, [currentSection]);

  const handleLinkClick = (e) => {
     gsap.fromTo(e.currentTarget, { scale: 0.95 }, { scale: 1, duration: 0.3 });
  };

  return (
    // WRAPPER
    // height: Calculated to be exactly Screen - Padding.
    // This ensures bottom-0 aligns with the actual screen bottom.
    <>
    <div 
      className="w-full bg-gray-200 overflow-hidden relative flex flex-col justify-between"
      style={{ height: mobileHeight, minHeight: mobileHeight }}
    >
      
      {/* CONTENT AREA */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        
        <div className="w-[85%] max-w-[280px] mb-4">
          <HandwrittenSignature onComplete={() => {}} />
        </div>

        <h2 className="m-title text-lg font-bold mb-4 opacity-0 text-black">Get in touch!</h2>

        <div className="flex flex-col gap-2 w-full items-center">
           <ContactButton mobile icon={SECTION_4_ASSETS.emailIcon} text="Email Me" onClick={handleLinkClick} href="mailto:your.email@example.com" />
           <ContactButton mobile icon={SECTION_4_ASSETS.linkedinIcon} text="LinkedIn" onClick={handleLinkClick} href="#" />
           <ContactButton mobile icon={SECTION_4_ASSETS.instagramIcon} text="Instagram" onClick={handleLinkClick} href="#" />
        </div>
      </div>

      {/* FOOTER - FLEX ITEM
          - Sits naturally at the bottom of the calculated height.
          - No absolute positioning needed (safer for layout flow).
      */}
      <div className="w-full py-4 px-6 bg-zinc-900 text-gray-400 flex flex-col gap-1 items-center justify-center flex-shrink-0 z-50 bottom-0  relative"
           style={{ background: '#1a1a1a', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
         <div className="flex items-center space-x-2">
            <img src="/images/R1 option 2.png" alt="Logo" className="h-6 w-auto" />
            <span className="text-[10px]">© 2026 Red Pixel Studio</span>
         </div>
         <div className="text-[9px] text-gray-500">Designed & Developed with ❤️</div>
      </div>
     
    </div>
     <div className="w-full bg-zinc-900 h-10" />
     </>
  );
};

// --- HELPER COMPONENTS ---
const ContactButton = ({ icon, text, onClick, href, mobile }) => (
  <a href={href} onClick={onClick}
     className={`
       ${mobile ? 'm-contact-item w-full max-w-[240px] p-2' : 'contact-item w-auto px-6 py-3'}
       flex items-center space-x-3 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors shadow-sm cursor-pointer opacity-0 justify-center
     `}>
    <div className="p-2 bg-white rounded-full shadow-sm flex-shrink-0">
        <img src={icon} alt={text} className="w-5 h-5" />
    </div>
    <span className="font-medium text-black text-sm md:text-base">{text}</span>
  </a>
);

export function Section4() {
  const { currentSection, deviceType } = useBookStore();
  const isMobile = deviceType === 'mobile'; 

  return isMobile 
    ? <MobileLayout currentSection={currentSection} /> 
    : <DesktopLayout currentSection={currentSection} />;
}