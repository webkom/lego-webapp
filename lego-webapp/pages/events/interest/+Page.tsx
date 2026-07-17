import {
  Button,
  LinkButton,
  PageContainer,
  Skeleton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import styles from '~/pages/events/interest/InterestEvents.module.css';
import EventAgenda from '~/pages/events/interest/_components/EventAgenda';
import GroupsSection from '~/pages/events/interest/_components/GroupsSection';
import Spotlight from '~/pages/events/interest/_components/Spotlight';
import useInterestEvents from '~/pages/events/interest/useInterestEvents';
import { useIsLoggedIn } from '~/redux/slices/auth';

const InterestEvents = () => {
  const loggedIn = useIsLoggedIn();
  const upcoming = useInterestEvents(false);

  usePreparedEffect('fetchInterestEvents', upcoming.fetch, [loggedIn]);

  const spotlightEvent = upcoming.events[0];

  return (
    <PageContainer card={false}>
      <Helmet title="Interessegruppearrangementer" />
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Interessegrupper</h1>
          <p className={styles.lead}>
            Lavterskel sosiale grupper drevet av studenter. Det kan være
            klatring, LAN, brettspill, løping eller cavasøndag!
          </p>
          <div className={styles.heroActions}>
            <Button
              dark
              onPress={() =>
                document
                  .getElementById('grupper')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              Bli med i en gruppe
            </Button>
            <LinkButton
              dark
              className={styles.secondaryAction}
              href="/interest-groups/"
            >
              Mer info
            </LinkButton>
          </div>
        </div>
        {spotlightEvent ? (
          <Spotlight event={spotlightEvent} />
        ) : (
          upcoming.fetching && <Skeleton className={styles.spotlightSkeleton} />
        )}
      </section>
      <EventAgenda spotlightEventId={spotlightEvent?.id} />
      <GroupsSection />
    </PageContainer>
  );
};

export default InterestEvents;
