import { Icon } from '@webkom/lego-bricks';
import AggregatedFeedActivity, {
  FeedActivityVerb,
} from '~/redux/models/FeedActivity';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';
import styles from '../activity.module.css';
import { CircleAlert } from 'lucide-react';

const PenaltyRenderer: ActivityRenderer<FeedActivityVerb.Penalty> = {
  Header: ({ aggregatedActivity, tag: Tag }) => {
    const latestActivity = aggregatedActivity.lastActivity;

    return (
      <p>
        <b>
          Du har fått{' '}
          <span className={styles.redText}>
            {latestActivity.extraContext.weight} prikk
            {Number(latestActivity.extraContext.weight) > 1 ? 'er' : ''}
          </span>
          :{' '}
        </b>
        <br />
        {latestActivity.extraContext.reason}
      </p>
    );
  },
  Content: () => null,
  Icon: () => <Icon iconNode={<CircleAlert />} />,
  getNotificationUrl: () => {
    return `/users/me`;
  },
};

export default PenaltyRenderer;
