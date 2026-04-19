import { Flex } from '@webkom/lego-bricks';
import { CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './EventRows.module.css';
import InterestEventCard from './InterestEventCard';
import type { ListEvent } from '~/redux/models/Event';
import EmptyState from '~/components/EmptyState';

const CARD_WIDTH = 200;
const CARD_GAP = 16;
const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP;

type Props = {
  title: string;
  subtitle?: string;
  events: ListEvent[];
};

const EventRows = ({ title, subtitle, events }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };

    update();
    el.addEventListener('scroll', update);
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [events]);

  const scroll = (direction: 'left' | 'right') => {
    containerRef.current?.scrollBy({
      left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  return (
    <Flex column gap="var(--spacing-sm)">
      <Flex
        className={styles.header}
        alignItems="baseline"
        gap="var(--spacing-sm)"
      >
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.subtitle}>{subtitle}</span>
        <span className={styles.count}>{events.length}</span>
        <Flex className={styles.arrows} gap="var(--spacing-xs)">
          <button
            className={styles.arrow}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className={styles.arrow}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </Flex>
      </Flex>
      {events.length > 0 ? (
        <div
          ref={containerRef}
          className={styles.container}
          style={{
            maskImage:
              canScrollLeft && canScrollRight
                ? 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)'
                : canScrollLeft
                  ? 'linear-gradient(to right, transparent, black 48px)'
                  : canScrollRight
                    ? 'linear-gradient(to left, transparent, black 48px)'
                    : undefined,
          }}
        >
          {events.map((event) => (
            <div key={event.id} className={styles.card}>
              <InterestEventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          className={styles.emptyState}
          iconNode={<CalendarX2 />}
          size={30}
          body="Ingen arrangementer"
        />
      )}
    </Flex>
  );
};

export default EventRows;
