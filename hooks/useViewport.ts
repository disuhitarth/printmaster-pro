'use client';

import { useState, useEffect } from 'react';

export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 1600, // Default fallback
    height: 800,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}