import EmptyState from 'app/components/EmptyState';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { FeedActivityVerb } from 'app/store/models/FeedActivity';
import styles from './Feed.css';
import AggregatedActivityItem from './activity';
import AdminRegistrationRenderer from './renders/adminRegistration';
import AnnouncementRenderer from './renders/announcement';
import CommentRenderer from './renders/comment';
import CommentReplyRenderer from './renders/comment_reply';
import EventRegisterRenderer from './renders/event_register';
import GroupJoinRenderer from './renders/group';
import MeetingInvitationRenderer from './renders/meetingInvitation';
import RegistrationBumpRenderer from './renders/registrationBump';
import RestrictedMailSentRenderer from './renders/restrictedMail';
import type ActivityRenderer from 'app/components/Feed/ActivityRenderer';
import type AggregatedFeedActivity from 'app/store/models/FeedActivity';

export const activityRenderers: Record<FeedActivityVerb, ActivityRenderer> = {
  [FeedActivityVerb.Comment]: CommentRenderer,
  [FeedActivityVerb.CommentReply]: CommentReplyRenderer,
  [FeedActivityVerb.MeetingInvitation]: MeetingInvitationRenderer,
  [FeedActivityVerb.RestrictedMailSent]: RestrictedMailSentRenderer,
  [FeedActivityVerb.RegistrationBump]: RegistrationBumpRenderer,
  [FeedActivityVerb.AdminRegistration]: AdminRegistrationRenderer,
  [FeedActivityVerb.Announcement]: AnnouncementRenderer,
  [FeedActivityVerb.GroupJoin]: GroupJoinRenderer,
  [FeedActivityVerb.EventRegister]: EventRegisterRenderer,
};

type Props = {
  items: AggregatedFeedActivity[];
};

const Feed = ({ items }: Props) => (
  <div
    style={{
      width: '100%',
    }}
  >
    {items.length ? (
      items.map((item) => {
        const activityRenderer = activityRenderers[item.verb];
        return activityRenderer ? (
          <ErrorBoundary hidden key={item.id}>
            <AggregatedActivityItem
              aggregatedActivity={item}
              activityRenderer={activityRenderer}
            />
          </ErrorBoundary>
        ) : null;
      })
    ) : (
      <EmptyState>
        <h2 className={styles.emptyState}>Ingen aktiviteter i feeden</h2>
      </EmptyState>
    )}
  </div>
);

export default Feed;
