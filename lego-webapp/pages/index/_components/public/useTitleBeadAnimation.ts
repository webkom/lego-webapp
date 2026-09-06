import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useLayoutEffect, useRef } from 'react';
import { GRID_SIZE, ROW_OFFSET } from './heroBeads';

gsap.registerPlugin(CustomEase);

const FLIGHT_DURATION = 4.5;

const START_BEYOND_RIGHT = 60;

const useTitleBeadAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beadFieldRef = useRef<HTMLDivElement>(null);
  const beadLayerRef = useRef<HTMLDivElement>(null);
  const titleDotRef = useRef<HTMLSpanElement>(null);
  const travelBeadRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const beadField = beadFieldRef.current;
    const beadLayer = beadLayerRef.current;
    const titleDot = titleDotRef.current;
    const travelBead = travelBeadRef.current;

    if (!container || !beadField || !beadLayer || !titleDot || !travelBead)
      return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      getComputedStyle(beadField).display === 'none'
    ) {
      gsap.set(titleDot, { opacity: 1 });
      return () => {
        gsap.set(titleDot, { clearProps: 'opacity' });
      };
    }

    const flightEase = CustomEase.create('titleBeadFlight', '0.5, 0, 0.15, 1');

    const beadEls = Array.from(beadLayer.children) as HTMLElement[];
    const baseOpacities = beadEls.map((el) => el.style.opacity);

    // The aligned row belongs to the traveling bead alone: fade out decorative
    // beads that share it so the landed period never gets a drifting "twin".
    // Re-evaluated on every measurement, so it holds through resizes.
    let reservedRow: number | null = null;
    const reserveDotRow = (nearestRow: number, immediate = false) => {
      if (reservedRow === nearestRow) return;
      reservedRow = nearestRow;
      beadEls.forEach((el, index) => {
        const rowCenter = parseFloat(el.dataset.rowCenter ?? '');
        const onDotRow = Math.abs(rowCenter - nearestRow) < 1;
        gsap.to(el, {
          opacity: onDotRow ? 0 : parseFloat(baseOpacities[index] || '1'),
          duration: immediate ? 0 : 0.4,
          ease: 'none',
          overwrite: 'auto',
        });
      });
    };

    let finished = false;
    let flightTween: gsap.core.Tween | null = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      flightTween?.kill();
      const containerRect = container.getBoundingClientRect();
      const dotRect = titleDot.getBoundingClientRect();
      if (containerRect.width && dotRect.width) {
        gsap.set(travelBead, {
          width: dotRect.width,
          height: dotRect.height,
          x: dotRect.left - containerRect.left,
          y: dotRect.top - containerRect.top,
          scale: 1,
        });
      }
      gsap.set(titleDot, { opacity: 1 });
      gsap.set(travelBead, { autoAlpha: 0 });
    };
    let currentShift: number | null = null;
    const alignGrid = (shift: number, immediate = false) => {
      if (currentShift !== null && Math.abs(shift - currentShift) < 0.5) return;
      currentShift = shift;
      gsap.to([beadField, beadLayer], {
        y: shift,
        duration: immediate ? 0 : 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    // Align the background before the first paint: measure the title dot's
    // RESTING position by neutralizing the entrance animation for the
    // measurement (this all happens inside the layout effect, so nothing of
    // it is visible). The flight later only needs tiny corrections.
    const alignFromTheStart = () => {
      const title = titleDot.parentElement;
      const previousAnimation = title?.style.animation ?? '';
      if (title) title.style.animation = 'none';
      const containerRect = container.getBoundingClientRect();
      const dotRect = titleDot.getBoundingClientRect();
      if (title) title.style.animation = previousAnimation;
      if (!containerRect.width || !dotRect.width) return;

      const endY = dotRect.top + dotRect.width / 2 - containerRect.top;
      const nearestRow =
        ROW_OFFSET + GRID_SIZE * Math.round((endY - ROW_OFFSET) / GRID_SIZE);
      reserveDotRow(nearestRow, true);
      alignGrid(endY - nearestRow, true);
    };

    alignFromTheStart();

    const launch = () => {
      if (finished) return;
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(finish, (FLIGHT_DURATION + 1.5) * 1000);

      const flight = { progress: 0 };
      const position = () => {
        const containerRect = container.getBoundingClientRect();
        const dotRect = titleDot.getBoundingClientRect();
        if (!containerRect.width || !dotRect.width) return false;

        const size = dotRect.width;
        const endX = dotRect.left - containerRect.left;
        const endY = dotRect.top + size / 2 - containerRect.top;

        const nearestRow =
          ROW_OFFSET + GRID_SIZE * Math.round((endY - ROW_OFFSET) / GRID_SIZE);
        reserveDotRow(nearestRow);
        alignGrid(endY - nearestRow);
        const rowY = nearestRow + Number(gsap.getProperty(beadField, 'y'));
        const startX = containerRect.width + START_BEYOND_RIGHT;
        gsap.set(travelBead, {
          width: size,
          height: size,
          x: startX + (endX - startX) * flight.progress,
          y: rowY - size / 2,
        });
        return true;
      };

      if (!position()) {
        finish();
        return;
      }
      // Quick spawn pop before the long glide toward the title
      gsap.fromTo(
        travelBead,
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(3)' },
      );
      flightTween = gsap.to(flight, {
        progress: 1,
        duration: FLIGHT_DURATION,
        ease: flightEase,
        onUpdate: position,
        onComplete: finish,
      });
    };

    const launchTimer = setTimeout(() => {
      if (document.fonts.status === 'loaded') {
        launch();
      } else {
        document.fonts.ready.then(launch);
      }
    }, 750);
    let fallbackTimer = setTimeout(finish, 5000);

    return () => {
      clearTimeout(launchTimer);
      clearTimeout(fallbackTimer);
      flightTween?.kill();
      gsap.killTweensOf([beadField, beadLayer, travelBead, ...beadEls]);
      beadEls.forEach((el, index) => {
        el.style.opacity = baseOpacities[index];
      });
      gsap.set([beadField, beadLayer, travelBead], { clearProps: 'all' });
      gsap.set(titleDot, { clearProps: 'opacity' });
    };
  }, []);

  return {
    containerRef,
    beadFieldRef,
    beadLayerRef,
    titleDotRef,
    travelBeadRef,
  };
};

export default useTitleBeadAnimation;
