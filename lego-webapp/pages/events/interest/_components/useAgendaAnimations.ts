import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useLayoutEffect, useRef } from 'react';
import styles from './EventAgenda.module.css';
import type { RefObject } from 'react';

gsap.registerPlugin(CustomEase);

// Fast start with a long, soft settle — quick without feeling rushed
export const agendaEase = CustomEase.create('agendaEase', '0.16, 1, 0.3, 1');

type AgendaAnimationState = {
  isPast: boolean;
  shownCount: number;
  peekDayKey: string | null;
};

// Rows rise in staggered as they appear; switching mode slides the whole list
// sideways in the tab's direction instead
const useAgendaAnimations = (
  listWrapRef: RefObject<HTMLDivElement | null>,
  { isPast, shownCount, peekDayKey }: AgendaAnimationState,
) => {
  const prevIsPastRef = useRef(isPast);
  const hasAnimatedRef = useRef(false);
  const peekedDayRef = useRef<string | null>(null);
  const listHeightRef = useRef<number | null>(null);

  // ResizeObserver fires after layout effects, so when a new batch of rows
  // lands the ref still holds the list's pre-update height to animate from
  useLayoutEffect(() => {
    const list = listWrapRef.current?.parentElement;
    if (!list) return;

    const observer = new ResizeObserver(() => {
      listHeightRef.current = list.offsetHeight;
    });
    observer.observe(list);

    return () => observer.disconnect();
  }, [listWrapRef]);

  useLayoutEffect(() => {
    const wrap = listWrapRef.current;
    if (!wrap) return;

    const prevHasAnimated = hasAnimatedRef.current;
    const prevPeekedDay = peekedDayRef.current;
    const prevIsPast = prevIsPastRef.current;

    const isInitial = !prevHasAnimated;
    hasAnimatedRef.current = true;

    const peekedDay = prevPeekedDay;
    peekedDayRef.current = peekDayKey;

    // DOM nodes survive re-renders while this effect re-runs, so a dataset
    // flag is what tells freshly mounted rows apart from already-shown ones
    const unmarked = (Array.from(wrap.children) as HTMLElement[]).filter(
      (el) => !el.dataset.animated,
    );
    unmarked.forEach((el) => {
      el.dataset.animated = '1';
    });

    // Revealed rows get the same rise-stagger as landing on the page. The
    // persisting show-more row stays put, and so does the day that was
    // already visible as its ghost preview - the cascade starts after it
    const newRows = isInitial
      ? unmarked
      : unmarked.filter(
          (el) =>
            !el.classList.contains(styles.showMoreRow) &&
            el.dataset.dayKey !== peekedDay,
        );

    const timeline = gsap.timeline();
    let targets: HTMLElement[] = [];

    if (prevIsPastRef.current !== isPast) {
      prevIsPastRef.current = isPast;
      targets = [wrap];
      timeline
        .fromTo(
          wrap,
          { x: isPast ? 72 : -72 },
          { x: 0, duration: 0.55, ease: agendaEase, clearProps: 'transform' },
        )
        .fromTo(
          wrap,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            ease: 'power1.out',
            clearProps: 'opacity',
          },
          0,
        );
    } else if (newRows.length > 0) {
      targets = newRows;
      timeline.fromTo(
        newRows,
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
    }

    // Reveals change the list's height in one step — animate the container to
    // its new (possibly scroll-capped) height alongside the rising rows
    const list = wrap.parentElement;
    const prevHeight = listHeightRef.current;
    let heightAnimated = false;

    if (!isInitial && list && prevHeight !== null) {
      const nextHeight = list.offsetHeight;

      if (Math.abs(nextHeight - prevHeight) > 1) {
        heightAnimated = true;
        timeline.fromTo(
          list,
          { height: prevHeight },
          {
            height: nextHeight,
            duration: 0.6,
            ease: agendaEase,
            clearProps: 'height',
          },
          0,
        );
      }
    }

    return () => {
      // StrictMode remounts clean up right after mount and replay the effect;
      // an interrupted animation must revert its bookkeeping so the replay
      // (and rapidly interrupted runs) animate the same elements again
      if (targets.length > 0 && timeline.progress() < 1) {
        unmarked.forEach((el) => {
          delete el.dataset.animated;
        });
        hasAnimatedRef.current = prevHasAnimated;
        peekedDayRef.current = prevPeekedDay;
        prevIsPastRef.current = prevIsPast;
      }

      timeline.kill();
      if (targets.length) {
        gsap.set(targets, { clearProps: 'transform,opacity' });
      }
      if (heightAnimated && list) {
        gsap.set(list, { clearProps: 'height' });
      }
    };
  }, [listWrapRef, isPast, shownCount, peekDayKey]);
};

export default useAgendaAnimations;
