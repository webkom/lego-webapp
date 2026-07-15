import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';

const REVEAL_DISTANCE = 24;

/**
 * Fades a section in from below the first time it scrolls into view.
 * Children marked with data-reveal enter as a staggered gsap timeline;
 * without marks the section reveals as one block. Skipped on reduced
 * motion, where everything simply stays visible.
 */
const useSectionReveal = <T extends HTMLElement = HTMLElement>() => {
  const sectionRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const node = sectionRef.current;
    if (
      !node ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const marked = Array.from(node.querySelectorAll('[data-reveal]'));
    const items = marked.length > 0 ? marked : [node];

    gsap.set(items, { autoAlpha: 0, y: REVEAL_DISTANCE });

    const timeline = gsap.timeline({ paused: true });
    timeline.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.65,
      ease: 'power2.out',
      stagger: 0.12,

      // Hand the elements back to the stylesheet, so CSS hover transforms
      // aren't overridden by leftover inline styles
      clearProps: 'opacity,visibility,transform',
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeline.play();
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      timeline.kill();
      gsap.set(items, { clearProps: 'opacity,visibility,transform' });
    };
  }, []);

  return sectionRef;
};

export default useSectionReveal;
