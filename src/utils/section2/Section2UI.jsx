import { useMemo, useRef } from 'react';
import { useBookStore } from '../store';
import { booksConfigMap } from '../Configs';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Section2UI() {
  const deviceType = useBookStore(state => state.deviceType);
  const bookState = useBookStore(state => state.bookState);
  const selectedBookId = useBookStore(state => state.selectedBookId);
  const currentSection = useBookStore(state => state.currentSection);
  const exitMode = useBookStore(state => state.exitMode);
  const selectBook = useBookStore(state => state.selectBook);

  const books = useMemo(() => booksConfigMap[deviceType] || [], [deviceType]);
  
  const stopTouchPropagation = (e) => e.stopPropagation();
  const isBookOpen = ['OPENING', 'INTERACTIVE', 'PAGES_CLOSING', 'CLOSING'].includes(bookState);
  const selectedBook = books.find(b => b.id === selectedBookId);

  const containerRef = useRef();
  const listRef = useRef();
  const detailsRef = useRef();
  const titleRefs = useRef([]);

  // --- 1. SLIDE IN / OUT LOGIC (GHOST FIX) ---
  useGSAP(() => {
    if (!containerRef.current) return;
    const isActive = currentSection === 1 && !exitMode;

    // THE FIX: Explicitly set the starting state every time this hooks runs.
    // This overrides any CSS hydration mismatches.
    // We force xPercent to -100 (off-screen left) so it's ready to slide in.
    if (isActive) {
        // Ensure it's visible to the browser, then animate in
        gsap.set(containerRef.current, { visibility: 'visible', autoAlpha: 1 });
        
        gsap.to(containerRef.current, { 
            xPercent: 0, 
            duration: 1.0, 
            ease: 'power3.out',
            overwrite: 'auto'
        });

        // Trigger text animations only if book isn't already open
        if (!isBookOpen && titleRefs.current.length > 0) {
            gsap.fromTo(titleRefs.current, 
                { x: -50, opacity: 0 }, 
                { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2, ease: 'back.out(1.7)', overwrite: 'auto' }
            );
        }
    } else {
        // Slide out to left
        gsap.to(containerRef.current, { 
            xPercent: -100, 
            duration: 0.8, 
            ease: 'power3.in',
            overwrite: 'auto'
        });
    }
  }, { dependencies: [currentSection, exitMode], scope: containerRef });

  // --- 2. LIST vs DETAILS TOGGLE ---
  useGSAP(() => {
    if (!listRef.current || !detailsRef.current) return;

    if (isBookOpen && selectedBook) {
        gsap.to(listRef.current, { x: '-50%', opacity: 0, duration: 0.5, ease: 'power2.in', overwrite: true });
        gsap.fromTo(detailsRef.current, 
            { x: '20%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out', overwrite: true }
        );
    } else {
        gsap.to(detailsRef.current, { x: '20%', opacity: 0, duration: 0.4, ease: 'power2.in', overwrite: true });
        gsap.to(listRef.current, { x: '0%', opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out', overwrite: true });
        
        if (titleRefs.current.length > 0) {
            gsap.fromTo(titleRefs.current,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.3, ease: 'power2.out', overwrite: true }
            );
        }
    }
  }, { dependencies: [isBookOpen, selectedBookId], scope: containerRef });

  if (deviceType === 'mobile' && isBookOpen) return null;

  return (
    <div 
        ref={containerRef} 
        
        // We initialize with xPercent: -100 in GSAP instead.
        // Added: 'invisible' to prevent FOC (Flash of Content) before GSAP kicks in.
        className="absolute left-0 top-0 h-full w-[25%] md:w-1/3 flex flex-col justify-center px-8 md:px-16 pointer-events-auto bg-gray-200 shadow-2xl z-20 invisible"
        onTouchStart={stopTouchPropagation}
        onTouchMove={stopTouchPropagation} 
        onPointerDown={stopTouchPropagation}
    >
        <div ref={listRef} className="absolute inset-0 flex flex-col justify-center px-2 md:px-16">
            <h2 className="hidden md:block text-xl md:text-2xl font-bold mb-8 text-black/50 uppercase tracking-widest">CONTENT</h2>
            <div className="flex flex-col space-y-6">
                {books.map((book, index) => (
                    <button 
                        key={book.id}
                        onClick={() => selectBook(book.id, book.pages.length)}
                        className="text-left group relative"
                        ref={el => titleRefs.current[index] = el}
                    >
                        <span 
                            className="text-lg md:text-3xl font-caveat font-bold transition-all duration-300 group-hover:scale-105 group-hover:translate-x-4 inline-block truncate w-full"
                            style={{ color: book.uiColor || 'black' }}
                        >
                            {deviceType === 'mobile' ? (book.title?.[0] || "B") : (book.title || "Untitled")}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        <div ref={detailsRef} className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 opacity-0 pointer-events-none">
             {selectedBook && (
                <>
                    <h2 className="text-4xl md:text-3xl font-caveat font-bold mb-4" style={{ color: selectedBook.uiColor || 'black' }}>
                        {selectedBook.title}
                    </h2>
                    <p className="text-lg md:text-2xl text-black/80 font-caveat max-w-xs leading-relaxed">
                        {selectedBook.description}
                    </p>
                </>
             )}
        </div>
    </div>
  );
}