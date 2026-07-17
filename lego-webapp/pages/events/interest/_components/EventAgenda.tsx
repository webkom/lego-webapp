import { Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { isEmpty } from 'lodash-es';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import PillSwitch from '~/components/PillSwitch';
import useInterestEvents from '~/pages/events/interest/useInterestEvents';
import useIsInterestGroupLeader from '~/pages/events/interest/useIsInterestGroupLeader';
import { groupEvents, groupKeyOf } from '~/pages/events/interest/utils';
import { fetchEvent } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
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

type Props = {
  spotlightEventId?: EntityId;
};

const EventAgenda = ({ spotlightEventId }: Props) => {
  const { query, setQueryValue } = useQuery(agendaDefaultQuery);
  const isPast = query.mode === 'tidligere';

  const [expandedId, setExpandedId] = useState<EntityId | null>(null);

  const actionGrant = useAppSelector((state) => state.events.actionGrant);
  const isInterestGroupLeader = useIsInterestGroupLeader();
  const showCreateRow =
    !isPast && (actionGrant.includes('create') || isInterestGroupLeader);
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

  // Attendance lives in the detail payload, so warm it for every visible row -
  // on landing, and again as show-more reveals new ones
  const dispatch = useAppDispatch();
  const requestedDetails = useRef(new Set<EntityId>());
  useEffect(() => {
    for (const event of shownEvents) {
      if ('pools' in event || requestedDetails.current.has(event.id)) continue;
      requestedDetails.current.add(event.id);
      dispatch(fetchEvent(event.id));
    }
  }, [shownEvents, dispatch]);

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
      <div className={styles.list}>
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
