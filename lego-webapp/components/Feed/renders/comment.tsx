import { Icon } from '@webkom/lego-bricks';
import DisplayContent from '~/components/DisplayContent';
import { contextRender } from '../context';
import { UserActors } from './utils';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';

/**
 * Comments are grouped by the comment target and date.
 * This makes it possible to use the latest activity to generate the header.
 */
const CommentRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity, tag: Tag }) => {
    const target =
      aggregatedActivity.context[aggregatedActivity.lastActivity.target];

    return (
      <b>
        <UserActors aggregatedActivity={aggregatedActivity} Tag={Tag} />{' '}
        kommenterte på <Tag {...contextRender[target.contentType](target)} />
      </b>
    );
  },
  Content: ({ activity }) => (
    <DisplayContent content={activity.extraContext.content} />
  ),
  Icon: () => <Icon name="chatbubble" />,
  getNotificationUrl: (aggregatedActivity) => {
    const latestActivity = aggregatedActivity.lastActivity;
    const comment = aggregatedActivity.context[latestActivity.target];
    return getCommentUrl(comment);
  },
};

export const getCommentUrl = (target) => {
  switch (target && target.contentType) {
    case 'events.event':
      return !target ? '/events' : `/events/${target.id}`;

    case 'meetings.meetinginvitation':
      return !target ? '/meetings' : `/meetings/${target.id}`;

    case 'articles.article':
      return !target ? '/articles' : `/articles/${target.id}`;

    case 'gallery.gallerypicture':
      return !target
        ? '/photos'
        : `/photos/${target.gallery.id}/picture/${target.id}`;

    default:
      return '';
  }
};

export default CommentRenderer;
