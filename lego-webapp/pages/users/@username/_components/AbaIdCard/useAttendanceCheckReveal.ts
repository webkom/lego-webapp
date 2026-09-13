import { gsap } from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import { useCallback, useEffect, useRef } from 'react';

gsap.registerPlugin(DrawSVGPlugin);

const SPREAD_DURATION = 0.35;
const DRAW_DURATION = 0.35;
const HOLD_DURATION = 1.3;

/**
 * A red circle spreads out from the QR's center (a transform: scale tween, so
 * it's compositor-only and stays smooth - the QR itself is a canvas we can't
 * touch) until it covers the whole plate, then a checkmark draws itself on
 * with a DrawSVGPlugin stroke tween. It then undraws and the circle shrinks
 * back to reveal the QR again. Skipped on reduced motion, where it just swaps
 * instantly.
 */
const useAttendanceCheckReveal = () => {
  const fillRef = useRef<HTMLDivElement | null>(null);
  const checkRef = useRef<SVGSVGElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const polyline = checkRef.current?.querySelector('polyline');
    if (fillRef.current) {
      gsap.set(fillRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
    }
    if (polyline) {
      gsap.set(polyline, { drawSVG: '0%' });
    }
    if (labelRef.current) {
      gsap.set(labelRef.current, { autoAlpha: 0, y: 6 });
    }
  }, []);

  const play = useCallback((onComplete: () => void) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    const fill = fillRef.current;
    const label = labelRef.current;
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
      if (label) gsap.set(label, { autoAlpha: 1, y: 0 });
      const timeoutId = setTimeout(() => {
        gsap.set(fill, { scale: 0 });
        gsap.set(polyline, { drawSVG: '0%' });
        if (label) gsap.set(label, { autoAlpha: 0, y: 6 });
        finish();
      }, HOLD_DURATION * 1000);
      cleanupRef.current = () => clearTimeout(timeoutId);
      return;
    }

    gsap.set(fill, { scale: 0 });
    gsap.set(polyline, { drawSVG: '0%' });
    if (label) gsap.set(label, { autoAlpha: 0, y: 6 });

    const tl = gsap.timeline({ onComplete: finish });
    cleanupRef.current = () => tl.kill();

    // The red circle spreads from the QR's center to cover the whole plate
    tl.to(fill, { scale: 1, duration: SPREAD_DURATION, ease: 'power2.out' });

    // The checkmark draws itself on, starting just before the spread finishes
    // so the cover and the draw read as one continuous motion
    tl.to(
      polyline,
      { drawSVG: '100%', duration: DRAW_DURATION, ease: 'power1.out' },
      '-=0.1',
    );

    if (label) {
      tl.to(
        label,
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.15',
      );
    }

    // Hold, then reverse: undraw the checkmark and shrink the circle away
    const reverseStart = '+=' + HOLD_DURATION;

    if (label) {
      tl.to(
        label,
        { autoAlpha: 0, y: -6, duration: 0.2, ease: 'power2.in' },
        reverseStart,
      );
    }

    tl.to(
      polyline,
      { drawSVG: '0%', duration: DRAW_DURATION * 0.7, ease: 'power2.in' },
      label ? '-=0.05' : reverseStart,
    );

    tl.to(
      fill,
      { scale: 0, duration: SPREAD_DURATION, ease: 'power2.in' },
      '-=0.1',
    );
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return { fillRef, checkRef, labelRef, play };
};

export default useAttendanceCheckReveal;
