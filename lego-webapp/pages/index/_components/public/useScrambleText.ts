import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrambleTextPlugin);

const SCRAMBLE_CHARS = '0123456789abcdef!@#$%^*+=?/\\|~_';

const TYPEWRITER_HANDOFF = 1.5;

const SCRAMBLE_DURATION = 2;

const useScrambleText = (text: string) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = textRef.current;

    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (getComputedStyle(element).visibility === 'visible') return;

    element.textContent = '';
    element.style.visibility = 'visible';

    const paintTime =
      performance.getEntriesByType('paint')[0]?.startTime ?? performance.now();
    const elapsed = (performance.now() - paintTime) / 1000;

    const tween = gsap.to(element, {
      duration: SCRAMBLE_DURATION,
      delay: Math.max(0, TYPEWRITER_HANDOFF - elapsed),
      ease: 'none',
      scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 1 },
    });

    return () => {
      tween.kill();
      element.textContent = text;
      element.style.visibility = '';
    };
  }, [text]);

  return textRef;
};

export default useScrambleText;
