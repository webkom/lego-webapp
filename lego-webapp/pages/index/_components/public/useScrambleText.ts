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

    element.textContent = '';

    const tween = gsap.to(element, {
      duration: SCRAMBLE_DURATION,
      delay: TYPEWRITER_HANDOFF,
      ease: 'none',
      scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 1 },
    });

    return () => {
      tween.kill();
      element.textContent = text;
    };
  }, [text]);

  return textRef;
};

export default useScrambleText;
