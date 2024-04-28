import { Button, Card } from '@webkom/lego-bricks';
import Linkify from 'linkify-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LinkTag } from 'app/components/Feed/Tag';
import { ProfilePicture } from 'app/components/Image';
import Time from 'app/components/Time';
import styles from './activity.css';
import type ActivityRenderer from 'app/components/Feed/ActivityRenderer';
import type { FeedActivity } from 'app/store/models/FeedActivity';
import type AggregatedFeedActivity from 'app/store/models/FeedActivity';

type AggregatedActivityItemProps = {
  aggregatedActivity: AggregatedFeedActivity;
  activityRenderer: ActivityRenderer;
};

const AggregatedActivityItem = ({
  aggregatedActivity,
  activityRenderer,
}: AggregatedActivityItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { Header, Content } = activityRenderer;
  const activities = expanded
    ? aggregatedActivity.activities
    : aggregatedActivity.activities.slice(0, 3);

  return (
    <Card
      style={{
        padding: '0',
        margin: '10px 0 20px 0',
      }}
    >
      <div className={styles.header}>
        <Linkify
          options={{
            rel: 'noopener noreferrer',
            format: (value, type) => {
              if (type === 'url' && value.length > 50) {
                value = value.slice(0, 50) + '…';
              }

              return value;
            },
            attributes: {
              target: '_blank',
            },
          }}
        >
          <Header aggregatedActivity={aggregatedActivity} tag={LinkTag} />
        </Linkify>
      </div>
      {activities.map((activity, i) => (
        <div key={i}>
          <ActivityHeader
            aggregatedActivity={aggregatedActivity}
            activity={activity}
          />
          <div className={styles.activityContent}>
            <Content
              aggregatedActivity={aggregatedActivity}
              activity={activity}
            />
          </div>
        </div>
      ))}
      {(aggregatedActivity.activityCount > 3 && !expanded) ||
      (aggregatedActivity.activityCount > activities.length && expanded) ? (
        <div className={styles.activityFooter}>
          {aggregatedActivity.activities.length > 3 && !expanded && (
            <Button size="small" onPress={() => setExpanded(true)}>
              Vis mer
            </Button>
          )}
          {aggregatedActivity.activityCount > activities.length &&
            expanded &&
            `og ${
              aggregatedActivity.activityCount - activities.length
            } skjulte aktiviteter...`}
        </div>
      ) : null}
    </Card>
  );
};

type ActivityHeaderProps = {
  aggregatedActivity: AggregatedFeedActivity;
  activity: FeedActivity;
};

const ActivityHeader = ({
  aggregatedActivity,
  activity,
}: ActivityHeaderProps) => {
  const actor = aggregatedActivity.context[activity.actor];
  if (actor.contentType !== 'users.user') return null;
  return (
    <div className={styles.activityHeader}>
      <div className={styles.activityHeaderItem}>
        <ProfilePicture
          size={40}
          user={actor}
          style={{
            marginRight: 25,
          }}
        />
        <Link to={`/users/${actor.username}/`}>
          {actor.firstName} {actor.lastName}
        </Link>
      </div>
      <i className={styles.time}>
        <Time time={activity.time} wordsAgo />
      </i>
    </div>
  );
};

export default AggregatedActivityItem;
