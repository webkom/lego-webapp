import React from 'react';

const FeedItem = ({ activity }) => (
  <div>
    Feed item (type = {activity.verb})
  </div>
);

const Feed = ({ items }) => {
  return (
    <div>
      { items.map((item) =>
        <FeedItem activity={item} key={item.id} />
      )}
    </div>
  );
};

export default Feed;
