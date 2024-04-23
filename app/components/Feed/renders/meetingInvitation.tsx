import { Icon } from '@webkom/lego-bricks';
import { isNotNullish } from 'app/utils';
import joinValues from 'app/utils/joinValues';
import { contextRender } from '../context';
import type ActivityRenderer from 'app/components/Feed/ActivityRenderer';
import type AggregatedFeedActivity from 'app/store/models/FeedActivity';
import type { FeedAttrMeetingInvitation } from 'app/store/models/FeedAttrCache';

/**
 * Group by actor
 * actor -> meeting1, meeting2
 */
const MeetingInvitationRenderer: ActivityRenderer = {
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
