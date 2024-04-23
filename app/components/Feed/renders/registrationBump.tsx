import { Icon } from '@webkom/lego-bricks';
import { isNotNullish } from 'app/utils';
import { contextRender } from '../context';
import { formatHeader } from './utils';
import type ActivityRenderer from 'app/components/Feed/ActivityRenderer';
import type AggregatedFeedActivity from 'app/store/models/FeedActivity';
import type { FeedAttrEvent } from 'app/store/models/FeedAttrCache';

/**
 * Normal grouping by target and date
 */
const RegistrationBumpRenderer: ActivityRenderer = {
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
            <Tag key={event.id} {...contextRender[event.contentType](event)} />
          )),
        )}
      </b>
    );
  },
  Content: () => null,
  Icon: () => <Icon name="calendar" />,
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
