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
    const button = buttonRef?.current;
    const cards = listRef.current
      ? Array.from(
          listRef.current.querySelectorAll<HTMLElement>('[data-request-id]'),
        )
      : [];

    if (cards.length) {
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: 'transform,opacity' });
    }

    if (button) {
      gsap.killTweensOf(button);
      gsap.set(button, { clearProps: 'transform,opacity,visibility' });
    }

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

    const cardsToAnimate = Array.from(
      listRef.current.querySelectorAll<HTMLElement>('[data-request-id]'),
    ).filter((card) => idsToAnimate.has(card.dataset.requestId ?? ''));

    if (!cardsToAnimate.length) {
      previousIdsRef.current = requestIds;
      return;
    }

    const timeline = gsap.timeline();

    if (animateButton && button) {
      gsap.set(button, {
        autoAlpha: 0,
        y: -8,
      });
    }

    timeline.fromTo(
      cardsToAnimate,
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

    if (animateButton && button) {
      timeline.to(button, {
        autoAlpha: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      });
    }

    previousIdsRef.current = requestIds;

    return () => {
      timeline.kill();
      gsap.set(cardsToAnimate, { clearProps: 'transform,opacity' });
      if (button) {
        gsap.set(button, { clearProps: 'transform,opacity,visibility' });
      }
    };
  }, [buttonRef, listRef, requestIds]);
};

export default useAnimateRequestInbox;
