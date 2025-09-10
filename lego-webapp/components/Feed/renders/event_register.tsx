import { Icon } from '@webkom/lego-bricks';
import { FeedActivityVerb } from '~/redux/models/FeedActivity';
import { contextRender } from '../context';
import { UserActors } from './utils';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';

/**
 * Grouped by target and date, standard...
 */
const EventRegisterRenderer: ActivityRenderer<FeedActivityVerb.EventRegister> =
  {
    Header: ({ aggregatedActivity, tag: Tag }) => {
      const target =
        aggregatedActivity.context[aggregatedActivity.lastActivity.target];

      return (
        <b>
          <UserActors aggregatedActivity={aggregatedActivity} Tag={Tag} />{' '}
          meldte seg på arrangementet{' '}
          <Tag {...contextRender[target.contentType](target)} />
        </b>
      );
    },
    Content: () => null,
    Icon: () => <Icon name="chatbubble" />,
    getNotificationUrl: (aggregatedActivity) => {
      const latestActivity = aggregatedActivity.lastActivity;
      const event = aggregatedActivity.context[latestActivity.target];

      if (!event) {
        return '/events';
      }

      return `/events/${event.id}`;
    },
  };

export default EventRegisterRenderer;
