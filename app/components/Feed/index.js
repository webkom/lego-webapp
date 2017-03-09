import React from 'react';
import Card from 'app/components/Card';
import Time from 'app/components/Time';


const FeedItem = ({ activity }) => (
  <div>
    Feed item (type = {activity.verb})
  </div>
);

const CommentFeedItem = ({ activity }) => {
  let actors = `${activity.actorIds.length} users`;
  if (activity.actorIds.length === 1) {
    actors = activity.lastActivity.actor;
  }
  let times = `${activity.activityCount} times `;
  if (activity.activityCount === 1) {
    times = '';
  }
  const activities = activity.activities.slice();
  activities.reverse();

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ fontSize: '20px' }}>{actors} commented {times}on {activities[0].target}</div>
      <div>
        {activities.slice(0, 3).map((activity, i) => (
          <div key={i} style={{ padding: '5px 0' }}>
            <Card>
              <b>{activity.actor}</b>
              <i style={{ float: 'right' }}><Time time={activity.time} wordsAgo /></i>
              <hr />
              <div dangerouslySetInnerHTML={{ __html: activity.extraContext.content }} />
            </Card>
          </div>
        ))}
        {activities.length > 3 &&
          'more....'
        }
      </div>
    </div>
  );
};

const activityRenderers = {
  'comment': CommentFeedItem
};

const Feed = ({ items }) => (
  <div>
    { items.map((item) => {
      const FeedItemComponent = activityRenderers[item.verb] || FeedItem;
      return <FeedItemComponent activity={item} key={item.id} />;
    })}
  </div>
);

export default Feed;
