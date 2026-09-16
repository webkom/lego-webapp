import { BaseCard, CardContent, CardFooter, Flex } from '@webkom/lego-bricks';
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
    <BaseCard>
      <CardContent>
        <Header aggregatedActivity={aggregatedActivity} tag={LinkTag} />
      </CardContent>
      <CardFooter variant="border">
        {aggregatedActivity.activities.map((activity) => (
          <div key={activity.activityId}>
            <ActivityFooter
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
      </CardFooter>
    </BaseCard>
  );
};

type ActivityHeaderProps = {
  aggregatedActivity: AggregatedFeedActivity;
  activity: FeedActivity;
};

const ActivityFooter = ({
  aggregatedActivity,
  activity,
}: ActivityHeaderProps) => {
  const actor = aggregatedActivity.context?.[activity.actor];
  if (!actor || actor.contentType !== 'users.user') return null;

  return (
    <Flex
      alignItems="center"
      gap="var(--spacing-sm)"
      className={styles.activityFooter}
    >
      <ProfilePicture size={40} user={actor} />
      <a href={`/users/${actor.username}/`}>
        {actor.firstName} {actor.lastName}
      </a>
      <i className={styles.time}>
        <Time time={activity.time} wordsAgo />
      </i>
    </Flex>
  );
};

export default AggregatedActivityItem;
