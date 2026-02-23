import { useEffect } from 'react';
import Home from './utils/Home.jsx';
import { CustomCursor } from './utils/CustomCursor.jsx';
import Loader from './utils/Loader.jsx'; 
import { useBookStore } from './utils/store'; 
import { useScalingLogic } from './utils/useScalingLogic.js';

export default function App() {
  // 1. Run scaling logic (Fonts/Rems)
  useScalingLogic();

  const isLoadedAndStarted = useBookStore((state) => state.isLoadedAndStarted);
  const setLoadedAndStarted = useBookStore((state) => state.setLoadedAndStarted);

  // 2. SAFETY: Force 'false' on mount to prevent "Auto-Start" bugs
  useEffect(() => {
    useBookStore.setState({ isLoadedAndStarted: false });
  }, []);

  return (
    <>
      <CustomCursor />
      
      {/* 3. LOADER (Z-Index 9999) 
          Sits on top. Controls the 'Enter' button. 
      */}
      <Loader onEnter={setLoadedAndStarted} />

      {/* 4. HOME (Z-Index 0) 
          Rendered IMMEDIATELY so assets start loading.
          We do NOT use {isLoadedAndStarted && ...} here. 
      */}
      <Home />
    </>
  );
}