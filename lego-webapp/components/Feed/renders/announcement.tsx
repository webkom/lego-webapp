import { Icon } from '@webkom/lego-bricks';
import { contextRender } from '../context';
import styles from '../context.module.css';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';

/**
 * Group by object
 */
const AnnouncementRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity, tag: Tag }) => {
    const latestActivity = aggregatedActivity.lastActivity;
    const actor = aggregatedActivity.context[latestActivity.actor];
    const object = aggregatedActivity.context[latestActivity.object];
    return (
      <span>
        <b>
          {object.fromGroup ? (
            <span className={styles.highlight}>{object.fromGroup.name}</span>
          ) : (
            <Tag {...contextRender[actor.contentType](actor)} />
          )}
          {' sendte ut en kunngjøring:'}
        </b>
        <br />
        <Tag {...contextRender[object.contentType](object)} />
      </span>
    );
  },
  Content: () => null,
  Icon: () => <Icon name="chatbubbles" />,
  getNotificationUrl: () => `/timeline`,
};

export default AnnouncementRenderer;
