import { Link } from 'react-router-dom';
import EmptyState from 'app/components/EmptyState';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { activityRenderers } from 'app/components/Feed';
import { toSpan } from 'app/components/Feed/context';
import type { AggregatedActivity } from 'app/components/Feed/types';
import Time from 'app/components/Time';
import styles from './Feed.module.css';

type Props = {
  feedItems: Array<any>;
  feed: Record<string, any>;
};

const FeedItem = (props: { activity: AggregatedActivity }) => {
  const renders = activityRenderers[props.activity.verb];

  if (renders) {
    return (
      <Link to={renders.getURL(props.activity)}>
        <li className={styles.item}>
          <div className={styles.icon}>{renders.icon(props.activity)}</div>
          <div className={styles.wordBreak}>
            {renders.activityHeader(props.activity, toSpan)}
            <Time
              time={props.activity.updatedAt}
              wordsAgo
              style={{
                margin: '0',
                display: 'block',
              }}
            />
          </div>
        </li>
      </Link>
    );
  }

  return null;
};

const Feed = (props: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2
          className="u-ui-heading"
          style={{
            padding: '0',
            margin: '0',
          }}
        >
          Oppdateringer
        </h2>
        <Link to="/timeline">Tidslinje →</Link>
      </div>
      <div className={styles.content}>
        {props.feedItems.length > 0 ? (
          <ul>
            {props.feedItems.map((activity) => (
              <ErrorBoundary hidden key={activity.id}>
                <FeedItem activity={activity} />
              </ErrorBoundary>
            ))}
          </ul>
        ) : (
          <EmptyState
            className={styles.noActivities}
            icon="book-outline"
            size={40}
          >
            <p>Ingen aktiviteter i feeden</p>
          </EmptyState>
        )}
      </div>
    </div>
  );
};

export default Feed;
