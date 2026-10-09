import gsap from 'gsap';
import { useLayoutEffect } from 'react';
import { agendaEase } from '~/pages/events/interest/_components/useAgendaAnimations';
import type { RefObject } from 'react';

const useListEntranceAnimation = (
  containerRef: RefObject<HTMLElement | null>,
  itemsKey: string,
) => {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const unmarked = (Array.from(container.children) as HTMLElement[]).filter(
      (el) => !el.dataset.animated,
    );
    unmarked.forEach((el) => {
      el.dataset.animated = '1';
    });

    if (
      unmarked.length === 0 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const tween = gsap.fromTo(
      unmarked,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: agendaEase,
        stagger: 0.06,
        clearProps: 'transform,opacity',
      },
    );

    return () => {
      if (tween.progress() < 1) {
        unmarked.forEach((el) => {
          delete el.dataset.animated;
        });
      }
      tween.kill();
      gsap.set(unmarked, { clearProps: 'transform,opacity' });
    };
  }, [containerRef, itemsKey]);
};

export default useListEntranceAnimation;
