import { Card } from '@webkom/lego-bricks';
import Linkify from 'linkify-react';
import { LinkTag } from '~/components/Feed/Tag';
import { ProfilePicture } from '~/components/Image';
import Time from '~/components/Time';
import { FeedActivity, FeedActivityVerb } from '~/redux/models/FeedActivity';
import styles from './activity.module.css';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';
import type AggregatedFeedActivity from '~/redux/models/FeedActivity';

type AggregatedActivityItemProps<Verb extends FeedActivityVerb> = {
  aggregatedActivity: AggregatedFeedActivity<Verb>;
  activityRenderer: ActivityRenderer<Verb>;
};

const AggregatedActivityItem = <Verb extends FeedActivityVerb>({
  aggregatedActivity,
  activityRenderer,
}: AggregatedActivityItemProps<Verb>) => {
  const { Header, Content } = activityRenderer;

  return (
    <Card
      style={{
        padding: '0',
        margin: 'var(--spacing-sm) 0 var(--spacing-md) 0',
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
      {aggregatedActivity.activities.map((activity, i) => (
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
        <a href={`/users/${actor.username}/`}>
          {actor.firstName} {actor.lastName}
        </a>
      </div>
      <i className={styles.time}>
        <Time time={activity.time} wordsAgo />
      </i>
    </div>
  );
};

export default AggregatedActivityItem;
