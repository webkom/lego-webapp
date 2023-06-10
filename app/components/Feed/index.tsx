import EmptyState from 'app/components/EmptyState';
import ErrorBoundary from 'app/components/ErrorBoundary';
import styles from './Feed.module.css';
import Activity from './activity';
import type { AggregatedActivity } from './types';
import type { ReactNode } from 'react';

export const activityRenderers = {
  comment: require('./renders/comment'),
  comment_reply: require('./renders/comment_reply'),
  meeting_invitation: require('./renders/meetingInvitation'),
  restricted_mail_sent: require('./renders/restrictedMail'),
  registration_bump: require('./renders/registrationBump'),
  admin_registration: require('./renders/adminRegistration'),
  announcement: require('./renders/announcement'),
  group_join: require('./renders/group'),
  event_register: require('./renders/event_register'),
};
type Props = {
  items: Array<AggregatedActivity>;
};

const Feed = ({ items }: Props): ReactNode => (
  <div
    style={{
      width: '100%',
    }}
  >
    {items.length ? (
      items.map((item, i) => {
        const renders = activityRenderers[item.verb];
        return renders ? (
          <ErrorBoundary hidden key={item.id}>
            <Activity aggregatedActivity={item} renders={renders} />
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
