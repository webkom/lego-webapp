import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

const getAnimationStep = (currentIds: string[], previousIds: string[]) => {
  if (previousIds.length === 0) {
    return {
      ids: [],
      animateButton: false,
    };
  }

  const isAppend =
    previousIds.length > 0 &&
    currentIds.length > previousIds.length &&
    previousIds.every((id, index) => currentIds[index] === id);

  if (isAppend) {
    return {
      ids: currentIds.slice(previousIds.length),
      animateButton: true,
    };
  }

  if (currentIds.join(',') !== previousIds.join(',')) {
    return {
      ids: currentIds,
      animateButton: false,
    };
  }

  return {
    ids: [],
    animateButton: false,
  };
};

const useAnimateRequestInbox = (
  listRef: RefObject<HTMLDivElement | null>,
  requestIds: string[],
  buttonRef?: RefObject<HTMLDivElement | null>,
) => {
  const previousIdsRef = useRef<string[]>([]);

  useLayoutEffect(() => {
    if (!listRef.current || requestIds.length === 0) {
      previousIdsRef.current = requestIds;
      return;
    }

    const { ids, animateButton } = getAnimationStep(
      requestIds,
      previousIdsRef.current,
    );
    const idsToAnimate = new Set(ids);

    if (!idsToAnimate.size) {
      previousIdsRef.current = requestIds;
      return;
    }

    const cards = Array.from(
      listRef.current.querySelectorAll<HTMLElement>('[data-request-id]'),
    ).filter((card) => idsToAnimate.has(card.dataset.requestId ?? ''));

    if (!cards.length) {
      previousIdsRef.current = requestIds;
      return;
    }

    const timeline = gsap.timeline();

    if (animateButton && buttonRef?.current) {
      gsap.set(buttonRef.current, {
        autoAlpha: 0,
        y: -8,
      });
    }

    timeline.fromTo(
      cards,
      {
        y: -18,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.32,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      },
    );

    if (animateButton && buttonRef?.current) {
      timeline.to(buttonRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.2,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        });
    }

    previousIdsRef.current = requestIds;

    return () => timeline.kill();
  }, [buttonRef, listRef, requestIds]);
};

export default useAnimateRequestInbox;
