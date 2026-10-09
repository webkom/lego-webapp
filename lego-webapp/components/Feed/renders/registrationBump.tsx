import { Icon } from '@webkom/lego-bricks';
import { CalendarArrowUp } from 'lucide-react';
import AggregatedFeedActivity, {
  FeedActivityVerb,
} from '~/redux/models/FeedActivity';
import { isNotNullish } from '~/utils';
import { contextRender } from '../context';
import { formatHeader } from './utils';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';
import type { FeedAttrEvent } from '~/redux/models/FeedAttrCache';

/**
 * Normal grouping by target and date
 */
const RegistrationBumpRenderer: ActivityRenderer<FeedActivityVerb.RegistrationBump> =
  {
    Header: ({ aggregatedActivity, tag: Tag }) => {
      const events = getEvents(aggregatedActivity);

      if (events.length === 0) {
        return null;
      }

      return (
        <b>
          {'Du har rykket opp fra ventelisten på '}
          {formatHeader(
            events.map((event) => (
              <Tag
                key={event.id}
                {...contextRender[event.contentType](event)}
              />
            )),
          )}
        </b>
      );
    },
    Content: () => null,
    Icon: () => <Icon iconNode={<CalendarArrowUp />} />,
    getNotificationUrl: (aggregatedActivity) => {
      const events = getEvents(aggregatedActivity);

      if (!events || events.length !== 1) {
        return '/events';
      }

      return `/events/${events[0].id}`;
    },
  };

const getEvents = (aggregatedActivity: AggregatedFeedActivity) =>
  aggregatedActivity.activities
    .map(
      (activity) =>
        aggregatedActivity.context[activity.actor] as FeedAttrEvent | undefined,
    )
    .filter(isNotNullish);

export default RegistrationBumpRenderer;
