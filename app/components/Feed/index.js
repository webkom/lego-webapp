// @flow
import React from 'react';
import Activity from './activity';
import type { AggregatedActivity } from './types';

export const activityRenderers = {
  comment: require('./renders/comment'),
  meeting_invitation: require('./renders/meetingInvitation'),
  restricted_mail_sent: require('./renders/restrictedMail'),
  registration_bump: require('./renders/registrationBump'),
  admin_registration: require('./renders/adminRegistration')
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
      <p>No activities...</p>
    )}
  </div>
);

export default Feed;
