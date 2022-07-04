import EmptyState from 'app/components/EmptyState';
import ErrorBoundary from 'app/components/ErrorBoundary';
import styles from './Feed.module.css';
import Activity from './activity';
import * as adminRegistrationRenderer from './renders/adminRegistration';
import * as announcementRenderer from './renders/announcement';
import * as commentRenderer from './renders/comment';
import * as commentReplyRenderer from './renders/comment_reply';
import * as eventRegisterRenderer from './renders/event_register';
import * as groupRenderer from './renders/group';
import * as meetingInvitationRenderer from './renders/meetingInvitation';
import * as registrationBumpRenderer from './renders/registrationBump';
import * as restrictedMailRenderer from './renders/restrictedMail';
import type { AggregatedActivity } from './types';
import type { ReactNode } from 'react';

export const activityRenderers = {
  comment: commentRenderer,
  comment_reply: commentReplyRenderer,
  meeting_invitation: meetingInvitationRenderer,
  restricted_mail_sent: restrictedMailRenderer,
  registration_bump: registrationBumpRenderer,
  admin_registration: adminRegistrationRenderer,
  announcement: announcementRenderer,
  group_join: groupRenderer,
  event_register: eventRegisterRenderer,
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
