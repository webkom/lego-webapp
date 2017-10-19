// @flow
import React from 'react';
import Activity from './activity';
import type { AggregatedActivity } from './types';
import EmptyState from 'app/components/EmptyState';

export const activityRenderers = {
  comment: require('./renders/comment'),
  comment_reply: require('./renders/comment_reply'),
  meeting_invitation: require('./renders/meetingInvitation'),
  restricted_mail_sent: require('./renders/restrictedMail'),
  registration_bump: require('./renders/registrationBump'),
  admin_registration: require('./renders/adminRegistration'),
  announcement: require('./renders/announcement')
};

const Feed = ({ items }: { items: Array<AggregatedActivity> }) => (
  <div style={{ width: '100%' }}>
    {items.length ? (
      items.map((item, i) => {
        const renders = activityRenderers[item.verb];
        return renders ? (
          <Activity aggregatedActivity={item} key={i} renders={renders} />
        ) : null;
      })
    ) : (
      <EmptyState>
        <h1>Ingen aktiviteter i feeden</h1>
      </EmptyState>
    )}
  </div>
);

export default Feed;
