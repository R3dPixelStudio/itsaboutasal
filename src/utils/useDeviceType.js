import { useState, useEffect } from 'react';

export function useDeviceType() {
  // 1. Initialize with the REAL value immediately. 
  // DO NOT use 'desktop' as a default, or mobile will fetch heavy assets for 1 frame.
  const [device, setDevice] = useState(() => {
    // Safety check for build environments
    if (typeof window === 'undefined') return 'desktop'; 
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newDevice = 'desktop';
      
      if (width < 768) newDevice = 'mobile';
      else if (width < 1024) newDevice = 'tablet';
      
      // Only update state if it actually changed (performance)
      setDevice(prev => (prev !== newDevice ? newDevice : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
}

