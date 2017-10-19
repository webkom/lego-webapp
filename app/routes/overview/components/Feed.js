import React from 'react';
import { Link } from 'react-router';
import styles from './Feed.css';

import { activityRenderers } from 'app/components/Feed';
import type { AggregatedActivity } from 'app/components/Feed/types';
import EmptyState from 'app/components/EmptyState';
import Time from 'app/components/Time';

type Props = {
  feedItems: Array<any>,
  feed: Object
};

const FeedItem = (props: { activity: AggregatedActivity }) => {
  const renders = activityRenderers[props.activity.verb];

  if (renders) {
    return (
      <li className={styles.item}>
        <div className={styles.icon}>{renders.icon(props.activity)}</div>
        <div>
          {renders.activityHeader(props.activity)}
          <Time
            time={props.activity.updatedAt}
            wordsAgo
            style={{ margin: '0', display: 'block' }}
          />
        </div>
      </li>
    );
  }

  return null;
};

const Feed = (props: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className="u-ui-heading" style={{ padding: '0' }}>
          Oppdateringer
        </h2>
        <Link to="/timeline">Tidslinje →</Link>
      </div>
      <div className={styles.content}>
        {props.feedItems.length > 0 ? (
          <ul>
            {props.feedItems.map((activity, key) => (
              <FeedItem activity={activity} key={key} />
            ))}
          </ul>
        ) : (
          <EmptyState icon="sad" size={40}>
            <h3>Ingen aktiviteter i feeden</h3>
          </EmptyState>
        )}
      </div>
    </div>
  );
};

export default Feed;
