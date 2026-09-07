import { gsap } from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import { useCallback, useEffect, useRef } from 'react';

gsap.registerPlugin(DrawSVGPlugin);

const SPREAD_DURATION = 0.5;
const DRAW_DURATION = 0.5;
const HOLD_DURATION = 1.4;

/**
 * A red circle spreads out from the QR's center (via a clip-path radius
 * tween - the QR itself is a canvas we can't touch) until it covers the
 * whole plate, then a checkmark draws itself on with a DrawSVGPlugin
 * stroke tween. It then undraws and the circle shrinks back to reveal
 * the QR again. Skipped on reduced motion, where it just swaps instantly.
 */
const useAttendanceCheckReveal = () => {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const checkRef = useRef<SVGSVGElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const play = useCallback((onComplete: () => void) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    const circle = circleRef.current;
    const label = labelRef.current;
    const polyline = checkRef.current?.querySelector('polyline');

    if (!circle || !polyline) {
      onComplete();
      return;
    }

    const finish = () => {
      cleanupRef.current = null;
      onComplete();
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(circle, { clipPath: 'circle(75% at 50% 50%)' });
      gsap.set(polyline, { drawSVG: '100%' });
      if (label) gsap.set(label, { autoAlpha: 1, y: 0 });
      const timeoutId = setTimeout(() => {
        gsap.set(circle, { clipPath: 'circle(0% at 50% 50%)' });
        gsap.set(polyline, { drawSVG: '0%' });
        if (label) gsap.set(label, { autoAlpha: 0, y: 6 });
        finish();
      }, HOLD_DURATION * 1000);
      cleanupRef.current = () => clearTimeout(timeoutId);
      return;
    }

    gsap.set(circle, { clipPath: 'circle(0% at 50% 50%)' });
    gsap.set(polyline, { drawSVG: '0%' });
    if (label) gsap.set(label, { autoAlpha: 0, y: 6 });

    const tl = gsap.timeline({ onComplete: finish });
    cleanupRef.current = () => tl.kill();

    // The red circle spreads from the QR's center to cover the whole plate
    tl.to(circle, {
      clipPath: 'circle(75% at 50% 50%)',
      duration: SPREAD_DURATION,
      ease: 'power3.inOut',
    });

    // Once covered, the checkmark draws itself on
    tl.to(polyline, { drawSVG: '100%', duration: DRAW_DURATION, ease: 'power1.inOut' });

    if (label) {
      tl.to(label, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.15');
    }

    // Hold, then reverse: undraw the checkmark and shrink the circle away
    tl.to({}, { duration: HOLD_DURATION });

    if (label) {
      tl.to(label, { autoAlpha: 0, y: -6, duration: 0.2, ease: 'power2.in' });
    }

    tl.to(
      polyline,
      { drawSVG: '0%', duration: DRAW_DURATION * 0.7, ease: 'power2.in' },
      label ? '-=0.05' : '+=0',
    );

    tl.to(circle, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: SPREAD_DURATION,
      ease: 'power3.inOut',
    });
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return { circleRef, checkRef, labelRef, play };
};

export default useAttendanceCheckReveal;
