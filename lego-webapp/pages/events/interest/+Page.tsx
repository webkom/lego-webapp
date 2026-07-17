import { LinkButton, PageContainer, Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { orderBy } from 'lodash-es';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { GroupType } from 'app/models';
import styles from '~/pages/events/interest/InterestEvents.module.css';
import Spotlight from '~/pages/events/interest/_components/Spotlight';
import { fetchEvents } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectAllEvents } from '~/redux/slices/events';
import { selectPaginationNext } from '~/redux/slices/selectors';
import type { ListEvent } from '~/redux/models/Event';

const InterestEvents = () => {
  const loggedIn = useIsLoggedIn();

  const fetchQuery = {
    date_after: moment().format('YYYY-MM-DD'),
    ordering: 'start_time',
  };

  const { pagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/',
      query: fetchQuery,
    }),
  );

  const events = useAppSelector((state) =>
    selectAllEvents<ListEvent>(state, { pagination }),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchInterestEvents',
    () => dispatch(fetchEvents({ query: fetchQuery })),
    [loggedIn],
  );

  const interestGroupEvents = orderBy(
    events.filter(
      (event) => event.responsibleGroup?.type === GroupType.Interest,
    ),
    'startTime',
  );
  const spotlightEvent = interestGroupEvents[0];

  return (
    <PageContainer card={false}>
      <Helmet title="Interessegruppearrangementer" />
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Interessegrupper</h1>
          <p className={styles.lead}>
            Lavterskel sosiale grupper drevet av studenter - klatring, LAN,
            brettspill, løping og vinsmaking. Ingen krav til nivå, alle er
            velkomne.
          </p>
          <div className={styles.heroActions}>
            <LinkButton secondary size="large" href="/interest-groups">
              Bli med
            </LinkButton>
            <LinkButton ghost size="large" href="/interest-groups/info">
              Mer info
            </LinkButton>
          </div>
        </div>
        {spotlightEvent ? (
          <Spotlight event={spotlightEvent} />
        ) : (
          pagination.fetching && (
            <Skeleton className={styles.spotlightSkeleton} />
          )
        )}
      </section>
    </PageContainer>
  );
};

export default InterestEvents;
