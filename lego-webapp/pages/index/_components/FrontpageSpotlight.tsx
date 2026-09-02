import { BaseCard, Image, Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Circle from '~/components/Circle';
import Pill from '~/components/Pill';
import Time from '~/components/Time';
import { toSpotlightItems } from '~/pages/index/utils';
import { useAppSelector } from '~/redux/hooks';
import { selectFeaturedItems } from '~/redux/slices/frontpage';
import utilStyles from '~/styles/utilities.module.css';
import styles from './FrontpageSpotlight.module.css';
import useCarousel from './useCarousel';
import type { CSSProperties } from 'react';

type Props = {
  style?: CSSProperties;
};

const FrontpageSpotlight = ({ style }: Props) => {
  const featured = useAppSelector(selectFeaturedItems);
  const fetching = useAppSelector((state) => state.frontpage.fetching);
  const items = toSpotlightItems(featured);

  const { index, animated, goTo, next, previous } = useCarousel(items.length);

  const current = items[index];
  const hasMultiple = items.length > 1;

  if (!fetching && items.length === 0) return null;

  return (
    <section className={styles.spotlight} style={style}>
      <div className={styles.header}>
        <h3 className={utilStyles.frontPageHeader}>
          {fetching || current?.pinned ? 'Festet oppslag' : 'Oppslag'}
        </h3>
        {hasMultiple && (
          <Pill>
            {index + 1} / {items.length}
          </Pill>
        )}
      </div>

      <BaseCard shadow className={styles.card}>
        {items.length === 0 ? (
          <div className={styles.stage}>
            <div className={styles.slide}>
              <div className={styles.cover}>
                <Skeleton />
              </div>
              <div className={styles.caption}>
                <Skeleton width="70%" height={22} />
                <Skeleton width={120} height={18} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.stage}>
            {items.map((item, itemIndex) => {
              const active = itemIndex === index;

              return (
                <a
                  key={item.id}
                  href={item.url}
                  className={cx(
                    styles.slide,
                    active ? styles.slideActive : styles.slideHidden,
                    animated && styles.slideAnimated,
                  )}
                  aria-hidden={!active}
                  tabIndex={active ? undefined : -1}
                >
                  <div className={styles.cover}>
                    <Image
                      className={styles.coverImage}
                      src={item.cover || ''}
                      placeholder={item.coverPlaceholder}
                      height={500}
                      width={1667}
                      alt={`Forsidebildet til ${item.title}`}
                    />
                  </div>
                  <div className={styles.caption}>
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.meta}>
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
                      <span className={styles.category}>
                        <Circle
                          size="var(--font-size-xs)"
                          color={item.categoryColor}
                        />
                        {item.category}
                      </span>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {hasMultiple && (
          <>
            <div className={styles.coverControls}>
              <button
                type="button"
                aria-label="Forrige oppslag"
                className={cx(styles.arrow, styles.arrowPrevious)}
                onClick={previous}
              >
                <ChevronLeft size={19} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Neste oppslag"
                className={cx(styles.arrow, styles.arrowNext)}
                onClick={next}
              >
                <ChevronRight size={19} strokeWidth={1.75} />
              </button>
            </div>
            <div className={styles.segments}>
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
            </div>
          </>
        )}
      </BaseCard>
    </section>
  );
};

export default FrontpageSpotlight;
