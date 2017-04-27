import React from 'react';
import Activty from './activity';

export const activityRenderers = {
  comment: require('./renders/comment'),
  meeting_invitation: require('./renders/meetingInvitation')
};

const Feed = ({ items }) => (
  <div style={{ width: '100%' }}>
    {items.length
      ? items.map((item, i) => {
          const renders = activityRenderers[item.verb];
          return renders
            ? <Activty aggregatedActivity={item} key={i} renders={renders} />
            : null;
        })
      : <p>No activities...</p>}
  </div>
);

export default Feed;
