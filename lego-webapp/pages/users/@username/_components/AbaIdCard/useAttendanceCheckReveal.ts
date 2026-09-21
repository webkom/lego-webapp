import { gsap } from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import { useCallback, useEffect, useRef } from 'react';

gsap.registerPlugin(DrawSVGPlugin);

const SPREAD_DURATION = 0.35;
const DRAW_DURATION = 0.35;
const HOLD_DURATION = 1.3;

const useAttendanceCheckReveal = () => {
  const fillRef = useRef<HTMLDivElement | null>(null);
  const checkRef = useRef<SVGSVGElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const polyline = checkRef.current?.querySelector('polyline');
    if (fillRef.current) {
      gsap.set(fillRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
    }
    if (polyline) {
      gsap.set(polyline, { drawSVG: '0%' });
    }
  }, []);

  const play = useCallback((onComplete: () => void) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    const fill = fillRef.current;
    const polyline = checkRef.current?.querySelector('polyline');

    if (!fill || !polyline) {
      onComplete();
      return;
    }

    const finish = () => {
      cleanupRef.current = null;
      onComplete();
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(fill, { scale: 1 });
      gsap.set(polyline, { drawSVG: '100%' });
      const timeoutId = setTimeout(() => {
        gsap.set(fill, { scale: 0 });
        gsap.set(polyline, { drawSVG: '0%' });
        finish();
      }, HOLD_DURATION * 1000);
      cleanupRef.current = () => clearTimeout(timeoutId);
      return;
    }

    gsap.set(fill, { scale: 0 });
    gsap.set(polyline, { drawSVG: '0%' });

    const tl = gsap.timeline({ onComplete: finish });
    cleanupRef.current = () => tl.kill();

    tl.to(fill, { scale: 1, duration: SPREAD_DURATION, ease: 'power2.out' });

    tl.to(
      polyline,
      { drawSVG: '100%', duration: DRAW_DURATION, ease: 'power1.out' },
      '-=0.1',
    );

    const reverseStart = '+=' + HOLD_DURATION;

    tl.to(
      polyline,
      { drawSVG: '0%', duration: DRAW_DURATION * 0.7, ease: 'power2.in' },
      reverseStart,
    );

    tl.to(
      fill,
      { scale: 0, duration: SPREAD_DURATION, ease: 'power2.in' },
      '-=0.1',
    );
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return { fillRef, checkRef, play };
};

export default useAttendanceCheckReveal;
