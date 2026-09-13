import { Button, LinkButton, PageContainer } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { GroupType } from 'app/models';
import Spotlight from '~/components/Spotlight';
import styles from '~/pages/events/interest/InterestEvents.module.css';
import EventAgenda from '~/pages/events/interest/_components/EventAgenda';
import GroupsSection from '~/pages/events/interest/_components/GroupsSection';
import useInterestEvents from '~/pages/events/interest/useInterestEvents';
import {
  nextUpcomingEvent,
  toInterestSpotlightItem,
} from '~/pages/events/interest/utils';
import { fetchAllWithType } from '~/redux/actions/GroupActions';
import { useAppDispatch } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';

const InterestEvents = () => {
  const loggedIn = useIsLoggedIn();
  const upcoming = useInterestEvents(false);
  const dispatch = useAppDispatch();

  const featured = nextUpcomingEvent(upcoming.events);

  usePreparedEffect('fetchInterestEvents', upcoming.fetch, [loggedIn]);
  usePreparedEffect(
    'fetchInterestGroups',
    () => dispatch(fetchAllWithType(GroupType.Interest)),
    [loggedIn],
  );

  return (
    <PageContainer card={false}>
      <Helmet title="Interessegruppearrangementer" />
      <div className={styles.page}>
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
              <LinkButton ghost href="/interest-groups/info">
                Praktisk info
              </LinkButton>
            </div>
          </div>
          <div className={styles.spotlight}>
            <Spotlight
              items={featured ? [toInterestSpotlightItem(featured)] : []}
              fetching={upcoming.fetching}
              heading="Neste arrangement"
            />
          </div>
        </section>
        <EventAgenda />
        <GroupsSection />
      </div>
    </PageContainer>
  );
};

export default InterestEvents;
