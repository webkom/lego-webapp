import { Icon } from '@webkom/lego-bricks';
import DisplayContent from '~/components/DisplayContent';
import { contextRender } from '../context';
import { getCommentUrl } from './comment';
import { UserActors } from './utils';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';

/**
 * Comments are grouped by the comment target and date.
 * This makes it possible to use the latest activity to generate the header.
 */
const CommentReplyRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity, tag: Tag }) => {
    const target =
      aggregatedActivity.context[aggregatedActivity.lastActivity.target];

    return (
      <b>
        <UserActors aggregatedActivity={aggregatedActivity} Tag={Tag} /> svarte
        på din kommentar på{' '}
        <Tag {...contextRender[target.contentType](target)} />
      </b>
    );
  },
  Content: ({ activity }) => (
    <DisplayContent content={activity.extraContext.content} />
  ),
  Icon: () => <Icon name="chatbubble" />,
  getNotificationUrl: (aggregatedActivity) => {
    const latestActivity = aggregatedActivity.lastActivity;
    const target = aggregatedActivity.context[latestActivity.target];
    return getCommentUrl(target);
  },
};

export default CommentReplyRenderer;
