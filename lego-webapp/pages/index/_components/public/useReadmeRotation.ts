import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

const ROTATION_SECONDS = 10;
const CROSSFADE_SECONDS = 0.6;

/**
 * Drives the readme showcase rotation. A linear fill tween on the active
 * archive row is the rotation's clock: when it completes, the next edition
 * becomes active and the stacked covers crossfade. The rotation waits until
 * the card scrolls into view, never runs on reduced motion, and pauses while
 * the cover is hovered so the linked edition can't change mid-click.
 */
const useReadmeRotation = (editionCount: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const coverLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillTweenRef = useRef<gsap.core.Tween | null>(null);
  const hoveredRef = useRef(false);
  const coverHasAnimated = useRef(false);

  useEffect(() => {
    const node = cardRef.current;
    if (
      !node ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fill = fillRefs.current[activeIndex];
    if (!started || !fill || editionCount === 0) {
      return;
    }
    gsap.set(
      fillRefs.current.filter((el) => el && el !== fill),
      { scaleX: 0 },
    );
    const tween = gsap.fromTo(
      fill,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: ROTATION_SECONDS,
        ease: 'none',
        onComplete: () =>
          setActiveIndex((current) => (current + 1) % editionCount),
      },
    );
    if (hoveredRef.current) {
      tween.pause();
    }
    fillTweenRef.current = tween;
    return () => {
      tween.kill();
      if (fillTweenRef.current === tween) {
        fillTweenRef.current = null;
      }
    };
  }, [started, activeIndex, editionCount]);

  // The first pass snaps the covers into place without animating
  useEffect(() => {
    coverLayerRefs.current.forEach((layer, index) => {
      if (!layer) {
        return;
      }
      const autoAlpha = index === activeIndex ? 1 : 0;
      if (coverHasAnimated.current) {
        gsap.to(layer, {
          autoAlpha,
          duration: CROSSFADE_SECONDS,
          ease: 'power2.inOut',
          overwrite: 'auto',
        });
      } else {
        gsap.set(layer, { autoAlpha });
      }
    });
    if (coverLayerRefs.current.some(Boolean)) {
      coverHasAnimated.current = true;
    }
  }, [activeIndex, editionCount]);

  const pauseRotation = () => {
    hoveredRef.current = true;
    fillTweenRef.current?.pause();
  };

  const resumeRotation = () => {
    hoveredRef.current = false;
    fillTweenRef.current?.play();
  };

  return {
    activeIndex,
    setActiveIndex,
    cardRef,
    fillRefs,
    coverLayerRefs,
    pauseRotation,
    resumeRotation,
  };
};

export default useReadmeRotation;
