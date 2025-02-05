import { useEffect, useState } from 'react';

const isMobileViewport = () => {
  const width = window.innerWidth;
  return width < 768;
};

export const useIsMobileViewport = () => {
  const [isMobile, setIsMobile] = useState(isMobileViewport());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileViewport());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};
