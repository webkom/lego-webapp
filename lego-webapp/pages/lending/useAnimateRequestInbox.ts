import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

const getIdsToAnimate = (currentIds: string[], previousIds: string[]) => {
  const isAppend =
    previousIds.length > 0 &&
    currentIds.length > previousIds.length &&
    previousIds.every((id, index) => currentIds[index] === id);

  if (isAppend) {
    return currentIds.slice(previousIds.length);
  }

  if (currentIds.join(',') !== previousIds.join(',')) {
    return currentIds;
  }

  return [];
};

const useAnimateRequestInbox = (
  listRef: RefObject<HTMLDivElement | null>,
  requestIds: string[],
) => {
  const previousIdsRef = useRef<string[]>([]);

  useLayoutEffect(() => {
    if (!listRef.current || requestIds.length === 0) {
      previousIdsRef.current = requestIds;
      return;
    }

    const idsToAnimate = new Set(
      getIdsToAnimate(requestIds, previousIdsRef.current),
    );

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

    gsap.fromTo(
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

    previousIdsRef.current = requestIds;
  }, [listRef, requestIds]);
};

export default useAnimateRequestInbox;
