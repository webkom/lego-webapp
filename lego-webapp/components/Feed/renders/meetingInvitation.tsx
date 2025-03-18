import { Icon } from '@webkom/lego-bricks';
import AggregatedFeedActivity, {
  FeedActivityVerb,
} from '~/redux/models/FeedActivity';
import { isNotNullish } from '~/utils';
import joinValues from '~/utils/joinValues';
import { contextRender } from '../context';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';
import type { FeedAttrMeetingInvitation } from '~/redux/models/FeedAttrCache';

/**
 * Group by actor
 * actor -> meeting1, meeting2
 */
const MeetingInvitationRenderer: ActivityRenderer<FeedActivityVerb.MeetingInvitation> =
  {
    Header: ({ aggregatedActivity, tag: Tag }) => {
      const latestActivity = aggregatedActivity.lastActivity;
      const actor = aggregatedActivity.context[latestActivity.actor];
      const meetingInvitations = getMeetingInvitations(aggregatedActivity);

      if (!actor || !meetingInvitations) {
        return null;
      }

      const toRender = joinValues(
        meetingInvitations.map((meetingInvitation) => (
          <Tag
            key={meetingInvitation.id}
            {...contextRender[meetingInvitation.contentType](meetingInvitation)}
          />
        )),
      );
      return (
        <b>
          <Tag {...contextRender[actor.contentType](actor)} /> inviterte deg til{' '}
          {toRender}
        </b>
      );
    },
    Content: () => null,
    Icon: () => <Icon name="calendar" />,
    getNotificationUrl: (aggregatedActivity) => {
      const meetingInvitations = getMeetingInvitations(aggregatedActivity);

      if (!meetingInvitations || meetingInvitations.length !== 1) {
        return '/meetings';
      }

      return `/meetings/${meetingInvitations[0].meeting.id}`;
    },
  };

const getMeetingInvitations = (aggregatedActivity: AggregatedFeedActivity) =>
  aggregatedActivity.activities
    .map(
      (activity) =>
        aggregatedActivity.context[activity.object] as
          | FeedAttrMeetingInvitation
          | undefined,
    )
    .filter(isNotNullish);

export default MeetingInvitationRenderer;
