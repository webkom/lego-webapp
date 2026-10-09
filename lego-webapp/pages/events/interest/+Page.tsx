import { Button, HeroPage, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { GroupType } from 'app/models';
import Spotlight from '~/components/Spotlight';
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
    <HeroPage
      title="Interessegrupper"
      lead="Lavterskel sosiale grupper drevet av studenter. Det kan være klatring, LAN, brettspill, løping eller cavasøndag!"
      actions={
        <>
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
        </>
      }
      aside={
        <Spotlight
          items={featured ? [toInterestSpotlightItem(featured)] : []}
          fetching={upcoming.fetching}
          heading="Neste arrangement"
        />
      }
    >
      <Helmet title="Interessegruppearrangementer" />
      <EventAgenda />
      <GroupsSection />
    </HeroPage>
  );
};

export default InterestEvents;
