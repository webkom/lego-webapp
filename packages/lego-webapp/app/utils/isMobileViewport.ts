import { useEffect, useState } from 'react';

const isMobileViewport = () => {
  if (!__CLIENT__) {
    return false;
  }
  const width = window?.innerWidth;

  // Check user agent string
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA =
    /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    );

  // Check touch points (most mobile devices support multiple touch points)
  const hasTouchScreen =
    navigator.maxTouchPoints > 0 || 'ontouchstart' in window;

  // Combine checks - device is considered mobile if it has a narrow viewport AND (matches mobile UA OR has touch capability)
  return width < 768 && (isMobileUA || hasTouchScreen);
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
