import { Icon } from '@webkom/lego-bricks';
import { CalendarCheck } from 'lucide-react';
import { isNotNullish } from '~/utils';
import { contextRender } from '../context';
import { formatHeader } from './utils';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';
import type AggregatedFeedActivity from '~/redux/models/FeedActivity';
import type { FeedAttrEvent } from '~/redux/models/FeedAttrCache';

/**
 * Normal grouping by target and date
 */
const AdminRegistrationRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity, tag: Tag }) => {
    const events = getEvents(aggregatedActivity);

    if (events.length === 0) {
      return null;
    }

    return (
      <b>
        {'Du har blitt påmeldt på '}
        {formatHeader(
          events.map((event) => (
            <Tag key={event.id} {...contextRender[event.contentType](event)} />
          )),
        )}
        {' av en administrator'}
      </b>
    );
  },
  Content: () => null,
  Icon: () => <Icon iconNode={<CalendarCheck />} />,
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

export default AdminRegistrationRenderer;
