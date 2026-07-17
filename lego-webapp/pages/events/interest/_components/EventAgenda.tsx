import { Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { isEmpty } from 'lodash-es';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import PillSwitch from '~/components/PillSwitch';
import useInterestEvents from '~/pages/events/interest/useInterestEvents';
import { groupEvents, groupKeyOf } from '~/pages/events/interest/utils';
import { useAppSelector } from '~/redux/hooks';
import useQuery from '~/utils/useQuery';
import CreateEventRow from './CreateEventRow';
import styles from './EventAgenda.module.css';
import EventRow from './EventRow';
import ShowMoreRow from './ShowMoreRow';
import useAgendaAnimations from './useAgendaAnimations';
import type { EntityId } from '@reduxjs/toolkit';

const agendaDefaultQuery = {
  mode: '' as '' | 'tidligere',
};

const MAX_ROWS = 6;
const MORE_STEP = 5;
const SCROLL_AFTER = 10;

type Props = {
  spotlightEventId?: EntityId;
};

const EventAgenda = ({ spotlightEventId }: Props) => {
  const { query, setQueryValue } = useQuery(agendaDefaultQuery);
  const isPast = query.mode === 'tidligere';

  const [expandedId, setExpandedId] = useState<EntityId | null>(null);

  const actionGrant = useAppSelector((state) => state.events.actionGrant);
  const showCreateRow = !isPast && actionGrant.includes('create');
  const initialCount = MAX_ROWS - (showCreateRow ? 1 : 0);

  const [shown, setShown] = useState<{ isPast: boolean; count: number } | null>(
    null,
  );
  const visibleCount =
    shown && shown.isPast === isPast ? shown.count : initialCount;

  const upcoming = useInterestEvents(false);
  const past = useInterestEvents(true);
  const current = isPast ? past : upcoming;

  usePreparedEffect(
    'fetchPastInterestEvents',
    () => (isPast ? past.fetch() : Promise.resolve()),
    [isPast],
  );

  // Prefetch past events so toggling to "Tidligere" is instant
  useEffect(() => {
    if (!isPast) {
      past.fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modeEvents = isPast
    ? past.events
    : upcoming.events.filter((event) => event.id !== spotlightEventId);
  const shownEvents = modeEvents.slice(0, visibleCount);
  const hiddenEvents = modeEvents.slice(visibleCount);
  const dayGroups = groupEvents(shownEvents, isPast);

  const showMore = () => {
    if (modeEvents.length <= visibleCount + MORE_STEP && current.hasMore) {
      current.fetchMore();
    }

    setShown({ isPast, count: visibleCount + MORE_STEP });
  };

  const listWrapRef = useRef<HTMLDivElement>(null);
  const peekDayKey = hiddenEvents[0]
    ? groupKeyOf(moment(hiddenEvents[0].startTime), isPast)
    : null;

  useAgendaAnimations(listWrapRef, {
    isPast,
    shownCount: shownEvents.length,
    peekDayKey,
  });

  return (
    <section className={styles.agenda}>
      <div className={styles.header}>
        <h2>Arrangementer</h2>
        <PillSwitch
          ariaLabel="Vis kommende eller tidligere arrangementer"
          options={[
            { label: 'Kommende', value: 'kommende' },
            { label: 'Tidligere', value: 'tidligere' },
          ]}
          value={isPast ? 'tidligere' : 'kommende'}
          onChange={(value) =>
            setQueryValue('mode')(value === 'tidligere' ? value : '')
          }
        />
      </div>
      <div
        className={cx(
          styles.list,
          shownEvents.length > SCROLL_AFTER && styles.scrollableList,
        )}
      >
        <div ref={listWrapRef}>
          {showCreateRow && <CreateEventRow />}
          {dayGroups.map((day) => (
            <div key={day.key} data-day-key={day.key} className={styles.dayRow}>
              <div className={styles.dayLabel}>
                <div
                  className={cx(
                    styles.dayName,
                    day.highlight && styles.dayNameHighlight,
                    isPast && styles.dayNameMuted,
                  )}
                >
                  {day.label}
                </div>
                <div className={styles.dayDate}>{day.subLabel}</div>
              </div>
              <div>
                {day.events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    isPast={isPast}
                    expanded={expandedId === event.id}
                    onToggle={() =>
                      setExpandedId((current) =>
                        current === event.id ? null : event.id,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}
          <ShowMoreRow
            hiddenEvents={hiddenEvents}
            lastShownEvent={shownEvents[shownEvents.length - 1]}
            isPast={isPast}
            onShowMore={showMore}
          />
          {isEmpty(shownEvents) && current.fetching && (
            <Skeleton array={initialCount} className={styles.skeletonRow} />
          )}
          {isEmpty(shownEvents) && !current.fetching && (
            <div className={styles.emptyLabel}>
              {isPast
                ? 'Ingenting her ennå.'
                : 'Ingen kommende arrangementer akkurat nå.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventAgenda;
