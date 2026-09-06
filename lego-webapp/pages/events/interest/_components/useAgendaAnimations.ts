import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useLayoutEffect, useRef } from 'react';
import styles from './EventAgenda.module.css';
import type { RefObject } from 'react';

gsap.registerPlugin(CustomEase);

export const agendaEase = CustomEase.create('agendaEase', '0.16, 1, 0.3, 1');

export const slideSwap = (
  timeline: gsap.core.Timeline,
  target: gsap.TweenTarget,
  fromX: number,
) =>
  timeline
    .fromTo(
      target,
      { x: fromX },
      { x: 0, duration: 0.55, ease: agendaEase, clearProps: 'transform' },
    )
    .fromTo(
      target,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power1.out', clearProps: 'opacity' },
      0,
    );

type AgendaAnimationState = {
  modeIndex: number;
  shownCount: number;
  peekDayKey: string | null;
};

const useAgendaAnimations = (
  listWrapRef: RefObject<HTMLDivElement | null>,
  { modeIndex, shownCount, peekDayKey }: AgendaAnimationState,
) => {
  const prevModeIndexRef = useRef(modeIndex);
  const hasAnimatedRef = useRef(false);
  const peekedDayRef = useRef<string | null>(null);
  const listHeightRef = useRef<number | null>(null);

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
    const prevModeIndex = prevModeIndexRef.current;

    const isInitial = !prevHasAnimated;
    hasAnimatedRef.current = true;

    const peekedDay = prevPeekedDay;
    peekedDayRef.current = peekDayKey;

    const unmarked = (Array.from(wrap.children) as HTMLElement[]).filter(
      (el) => !el.dataset.animated,
    );
    unmarked.forEach((el) => {
      el.dataset.animated = '1';
    });

    const newRows = isInitial
      ? unmarked
      : unmarked.filter(
          (el) =>
            !el.classList.contains(styles.showMoreRow) &&
            el.dataset.dayKey !== peekedDay,
        );

    const timeline = gsap.timeline();
    let targets: HTMLElement[] = [];

    if (prevModeIndex !== modeIndex) {
      prevModeIndexRef.current = modeIndex;
      targets = [wrap];
      slideSwap(timeline, wrap, modeIndex > prevModeIndex ? 72 : -72);
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
      if (targets.length > 0 && timeline.progress() < 1) {
        unmarked.forEach((el) => {
          delete el.dataset.animated;
        });
        hasAnimatedRef.current = prevHasAnimated;
        peekedDayRef.current = prevPeekedDay;
      }

      timeline.kill();
      if (targets.length) {
        gsap.set(targets, { clearProps: 'transform,opacity' });
      }
      if (heightAnimated && list) {
        gsap.set(list, { clearProps: 'height' });
      }
    };
  }, [listWrapRef, modeIndex, shownCount, peekDayKey]);
};

export default useAgendaAnimations;
