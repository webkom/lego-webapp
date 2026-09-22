import { gsap } from 'gsap';
import { useCallback, useRef } from 'react';

const MAX_TILT_X = 13;
const MAX_TILT_Y = 11;
const DRIFT_TILT_X = 7;
const DRIFT_TILT_Y = 5;
const FOIL_INTENSITY = 1;
const RESTING_FOIL_OPACITY = 0.18;
const EASE = { duration: 0.55, ease: 'power3.out' };

/**
 * Tilts the card toward the pointer and sweeps the holographic foil with it,
 * drifting on its own whenever the pointer is elsewhere. Writes --tilt-x,
 * --tilt-y and --foil-opacity on the element the returned ref is attached to;
 * the transform and the foil position are derived from those in CSS.
 *
 * This is a ref callback rather than an effect because the card only enters
 * the DOM when the modal opens, long after this component mounts.
 */
const useCardTilt = () => {
  const teardownRef = useRef<(() => void) | null>(null);

  return useCallback((zone: HTMLDivElement | null) => {
    teardownRef.current?.();
    teardownRef.current = null;

    if (
      !zone ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    gsap.set(zone, {
      '--tilt-x': 0,
      '--tilt-y': 0,
      '--foil-opacity': RESTING_FOIL_OPACITY,
    });

    const tiltXTo = gsap.quickTo(zone, '--tilt-x', EASE);
    const tiltYTo = gsap.quickTo(zone, '--tilt-y', EASE);
    const foilTo = gsap.quickTo(zone, '--foil-opacity', EASE);

    let isPointerOver = false;

    const aim = (x: number, y: number) => {
      tiltXTo(x);
      tiltYTo(y);
      foilTo(Math.min(1, 0.22 + Math.hypot(x, y) / 11) * FOIL_INTENSITY);
    };

    const handleTick = (time: number) => {
      if (isPointerOver) return;

      aim(
        Math.sin(time * 0.7) * DRIFT_TILT_X,
        Math.cos(time * 0.5) * DRIFT_TILT_Y,
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      isPointerOver = true;
      const rect = zone.getBoundingClientRect();
      aim(
        (((event.clientX - rect.left) / rect.width) * 2 - 1) * MAX_TILT_X,
        (((event.clientY - rect.top) / rect.height) * 2 - 1) * MAX_TILT_Y,
      );
    };

    const handlePointerRest = () => {
      isPointerOver = false;
    };

    gsap.ticker.add(handleTick);
    zone.addEventListener('pointermove', handlePointerMove);
    zone.addEventListener('pointerleave', handlePointerRest);
    zone.addEventListener('pointercancel', handlePointerRest);

    teardownRef.current = () => {
      gsap.ticker.remove(handleTick);
      zone.removeEventListener('pointermove', handlePointerMove);
      zone.removeEventListener('pointerleave', handlePointerRest);
      zone.removeEventListener('pointercancel', handlePointerRest);
      gsap.killTweensOf(zone);
    };
  }, []);
};

export default useCardTilt;
