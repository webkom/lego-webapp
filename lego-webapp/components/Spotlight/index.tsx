import { BaseCard, Flex, Image, Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Circle from '~/components/Circle';
import Pill from '~/components/Pill';
import Time from '~/components/Time';
import styles from './Spotlight.module.css';
import useCarousel from './useCarousel';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { CSSProperties } from 'react';

export type SpotlightItem = {
  id: EntityId;
  url: string;
  title: string;
  cover?: string;
  coverPlaceholder?: string;
  coverMonogram?: string;
  coverColor?: string;
  category: string;
  categoryColor: string;
  location?: string;
  time: Dateish;
  timeFormat: string;
  pinned?: boolean;
};

type Props = {
  items: SpotlightItem[];
  fetching?: boolean;
  heading?: string;
  className?: string;
  style?: CSSProperties;
};

const Spotlight = ({
  items,
  fetching = false,
  heading,
  className,
  style,
}: Props) => {
  const { index, goTo, next, previous } = useCarousel(items.length);

  const current = items[index];
  const hasMultiple = items.length > 1;

  if (!fetching && items.length === 0) return null;

  return (
    <Flex
      column
      component="section"
      gap="var(--spacing-sm)"
      className={className}
      style={style}
    >
      <Flex alignItems="baseline" gap="var(--spacing-sm)">
        <h3 className={styles.heading}>
          {heading ??
            (fetching || current?.pinned ? 'Festet oppslag' : 'Oppslag')}
        </h3>
        {hasMultiple && (
          <Pill>
            {index + 1} / {items.length}
          </Pill>
        )}
      </Flex>

      <BaseCard shadow className={styles.card}>
        {items.length === 0 ? (
          <div className={styles.stage}>
            <Flex column className={styles.slide}>
              <div className={styles.cover}>
                <Skeleton />
              </div>
              <Flex
                column
                justifyContent="center"
                gap="var(--spacing-xs)"
                className={styles.caption}
              >
                <Skeleton width="70%" height={22} />
                <Skeleton width={120} height={18} />
              </Flex>
            </Flex>
          </div>
        ) : (
          <div className={styles.stage}>
            {items.map((item, itemIndex) => {
              const active = itemIndex === index;

              return (
                <Flex
                  key={item.id}
                  column
                  component="a"
                  href={item.url}
                  className={cx(
                    styles.slide,
                    active ? styles.slideActive : styles.slideHidden,
                  )}
                  aria-hidden={!active}
                  tabIndex={active ? undefined : -1}
                >
                  <div className={styles.cover}>
                    {item.cover ? (
                      <Image
                        className={styles.coverImage}
                        src={item.cover}
                        placeholder={item.coverPlaceholder}
                        height={500}
                        width={1667}
                        alt={`Forsidebildet til ${item.title}`}
                      />
                    ) : (
                      item.coverMonogram && (
                        <span
                          className={styles.coverMonogram}
                          style={{ backgroundColor: item.coverColor }}
                          aria-hidden
                        >
                          {item.coverMonogram}
                        </span>
                      )
                    )}
                  </div>
                  <Flex
                    column
                    justifyContent="center"
                    gap="var(--spacing-xs)"
                    className={styles.caption}
                  >
                    <h4 className={styles.title}>{item.title}</h4>
                    <Flex
                      wrap
                      alignItems="center"
                      gap="var(--spacing-xs) var(--spacing-sm)"
                      className={styles.meta}
                    >
                      <span className={styles.category}>
                        <Circle
                          size="var(--font-size-xs)"
                          color={item.categoryColor}
                        />
                        {item.category}
                      </span>
                      <span aria-hidden>•</span>
                      <span className={styles.date}>
                        <Calendar size={15} strokeWidth={1.75} aria-hidden />
                        <Time time={item.time} format={item.timeFormat} />
                      </span>
                      {item.location && (
                        <>
                          <span aria-hidden>•</span>
                          <span className={styles.location}>
                            {item.location}
                          </span>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </div>
        )}

        {hasMultiple && (
          <div className={styles.coverControls}>
            <Flex
              component="button"
              type="button"
              alignItems="center"
              justifyContent="center"
              aria-label="Forrige oppslag"
              className={cx(styles.arrow, styles.arrowPrevious)}
              onClick={previous}
            >
              <ChevronLeft size={19} strokeWidth={1.75} />
            </Flex>
            <Flex
              component="button"
              type="button"
              alignItems="center"
              justifyContent="center"
              aria-label="Neste oppslag"
              className={cx(styles.arrow, styles.arrowNext)}
              onClick={next}
            >
              <ChevronRight size={19} strokeWidth={1.75} />
            </Flex>
            <Flex
              alignItems="center"
              gap="var(--spacing-xs)"
              className={styles.segments}
            >
              {items.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Gå til oppslag ${itemIndex + 1}`}
                  aria-current={itemIndex === index}
                  className={cx(
                    styles.segment,
                    itemIndex === index && styles.segmentActive,
                  )}
                  onClick={() => goTo(itemIndex)}
                />
              ))}
            </Flex>
          </div>
        )}
      </BaseCard>
    </Flex>
  );
};

export default Spotlight;
