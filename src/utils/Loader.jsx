import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

const LOGO_SVG_URL = "/svg/loading-svg.svg"; 

const Loader = ({ onEnter }) => {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Smooth Progress
  useEffect(() => {
    if (displayProgress < progress) {
      const diff = progress - displayProgress;
      const inc = diff > 0 ? Math.ceil(diff / 5) : 0;
      const t = setTimeout(() => setDisplayProgress(p => Math.min(p + inc, 100)), 20);
      return () => clearTimeout(t);
    }
  }, [progress, displayProgress]);

  // Ready State
  useEffect(() => {
    if (displayProgress === 100) {
      const t = setTimeout(() => setIsReady(true), 500);
      return () => clearTimeout(t);
    }
  }, [displayProgress]);

  const handleClick = () => {
    setIsFading(true);
    // Notify Home.jsx to enable scrolling after fade out
    setTimeout(() => {
        if(onEnter) onEnter(); 
    }, 1000); 
  };

  if (isFading && Date.now() > 999999999) return null; // Theoretical cleanup

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 1s ease-in-out",
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? "none" : "auto",
        zIndex: 9999 // Always on top
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <img src={LOGO_SVG_URL} alt="Logo" className="w-[200px] md:w-[250px] h-auto" />

        {/* Bar */}
        {!isReady && (
          <div className="w-[200px] h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-100 ease-linear"
              style={{ width: `${displayProgress}%` }} 
            />
          </div>
        )}

        {/* Button */}
        {isReady && (
          <button 
            onClick={handleClick} 
            className="text-xl font-bold tracking-[0.2em] uppercase animate-in fade-in zoom-in cursor-pointer hover:scale-110 transition-transform p-4"
          >
             Enter
          </button>
        )}
      </div>
    </div>
  );
};
export default Loader;