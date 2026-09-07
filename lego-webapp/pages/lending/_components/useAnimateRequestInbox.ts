import { gsap } from 'gsap';
import { useLayoutEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';

const getAnimationStep = (currentIds: string[], previousIds: string[]) => {
  if (previousIds.length === 0) {
    return {
      ids: [],
      animateButton: false,
    };
  }


  const previousIdSet = new Set(previousIds);
  const newIds = currentIds.filter((id) => !previousIdSet.has(id));

  if (newIds.length === 0) {
    return {
      ids: [],
      animateButton: false,
    };
  }

  const unchangedPrefix = currentIds.slice(
    0,
    currentIds.length - newIds.length,
  );
  const isAppend =
    unchangedPrefix.length === previousIds.length &&
    unchangedPrefix.every((id, index) => previousIds[index] === id);

  return {
    ids: newIds,
    animateButton: isAppend,
  };
};

const useAnimateRequestInbox = (
  listRef: RefObject<HTMLDivElement | null>,
  requestIds: string[],
  buttonRef?: RefObject<HTMLDivElement | null>,
) => {
  const previousIdsRef = useRef<string[]>([]);
  const requestIdsKey = requestIds.join(',');
  const stableRequestIds = useMemo(
    () => (requestIdsKey ? requestIdsKey.split(',') : []),
    [requestIdsKey],
  );

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

    if (!listRef.current || stableRequestIds.length === 0) {
      previousIdsRef.current = stableRequestIds;
      return;
    }

    const { ids, animateButton } = getAnimationStep(
      stableRequestIds,
      previousIdsRef.current,
    );
    const idsToAnimate = new Set(ids);

    if (!idsToAnimate.size) {
      previousIdsRef.current = stableRequestIds;
      return;
    }

    const cardsToAnimate = Array.from(
      listRef.current.querySelectorAll<HTMLElement>('[data-request-id]'),
    ).filter((card) => idsToAnimate.has(card.dataset.requestId ?? ''));

    if (!cardsToAnimate.length) {
      previousIdsRef.current = stableRequestIds;
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

    previousIdsRef.current = stableRequestIds;

    return () => {
      timeline.kill();
      gsap.set(cardsToAnimate, { clearProps: 'transform,opacity' });
      if (button) {
        gsap.set(button, { clearProps: 'transform,opacity,visibility' });
      }
    };
  }, [buttonRef, listRef, stableRequestIds]);
};

export default useAnimateRequestInbox;
