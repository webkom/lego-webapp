import { Button } from '@webkom/lego-bricks';
import Linkify from 'linkify-react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from 'app/components/Card';
import { ProfilePicture } from 'app/components/Image';
import Time from 'app/components/Time';
import styles from './activity.css';
import { lookupContext, toLink } from './context';
import type { AggregatedActivity, Activity } from './types';
import type { ReactNode } from 'react';

type Props = {
  aggregatedActivity: AggregatedActivity;
  activity?: Activity;
  key?: any;
  renders: Record<string, any>;
};
type State = {
  expanded: boolean;
};
export default class ActivityRenderer extends Component<Props, State> {
  state: State = {
    expanded: false,
  };

  renderHeader(
    activity: Activity,
    aggregatedActivity: AggregatedActivity
  ): ReactNode {
    const actor = lookupContext(aggregatedActivity, activity.actor);
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
  }

  render(): ReactNode {
    const { aggregatedActivity, renders } = this.props;
    const activities = this.state.expanded
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
            {renders.activityHeader(aggregatedActivity, toLink)}
          </Linkify>
        </div>
        {activities.map((activity, i) => (
          <div key={i}>
            {this.renderHeader(activity, aggregatedActivity)}
            <div className={styles.activityContent}>
              {renders.activityContent(activity, aggregatedActivity)}
            </div>
          </div>
        ))}
        {(aggregatedActivity.activityCount > 3 && !this.state.expanded) ||
        (aggregatedActivity.activityCount > activities.length &&
          this.state.expanded) ? (
          <div className={styles.activityFooter}>
            {aggregatedActivity.activities.length > 3 &&
              !this.state.expanded && (
                <Button
                  size="small"
                  submit={false}
                  onClick={() =>
                    this.setState({
                      expanded: true,
                    })
                  }
                >
                  Vis mer
                </Button>
              )}
            {aggregatedActivity.activityCount > activities.length &&
              this.state.expanded &&
              `og ${
                aggregatedActivity.activityCount - activities.length
              } skjulte aktiviteter...`}
          </div>
        ) : null}
      </Card>
    );
  }
}
