import React from 'react';
import Activty from './activity';

const activityRenderers = {
  comment: require('./renders/comment')
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
