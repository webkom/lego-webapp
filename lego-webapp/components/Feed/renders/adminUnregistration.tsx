import { Icon } from '@webkom/lego-bricks';
import AggregatedFeedActivity, {
  FeedActivityVerb,
} from '~/redux/models/FeedActivity';
import { isNotNullish } from '~/utils';
import { contextRender } from '../context';
import { formatHeader } from './utils';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';

const AdminUnregistrationRenderer: ActivityRenderer<FeedActivityVerb.AdminUnregistration> =
  {
    Header: ({ aggregatedActivity, tag: Tag }) => {
      const events = getEvents(aggregatedActivity);
      if (events.length === 0) {
        return null;
      }
      return (
        <b>
          {'Du har blitt fjernet fra '}
          {formatHeader(
            events.map((event) => (
              <Tag
                key={event.id}
                {...contextRender[event.contentType](event)}
              />
            )),
          )}
          {' av en administrator'}
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

const getEvents = (
  aggregatedActivity: AggregatedFeedActivity<FeedActivityVerb.AdminUnregistration>,
) =>
  aggregatedActivity.activities
    .map((activity) => aggregatedActivity.context[activity.actor])
    .filter(isNotNullish);

export default AdminUnregistrationRenderer;
