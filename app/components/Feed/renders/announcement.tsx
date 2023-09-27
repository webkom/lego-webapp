import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import styles from '../context.css';
import type { AggregatedActivity, TagInfo } from '../types';
import type { ReactElement } from 'react';

/**
 * Group by object
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (arg0: TagInfo) => ReactElement
) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const object = lookupContext(aggregatedActivity, latestActivity.object);
  return (
    <span>
      <b>
        {object.fromGroup ? (
          <span className={styles.highlight}>{object.fromGroup.name}</span>
        ) : (
          htmlTag(contextRender[actor.contentType](actor))
        )}
        {' sendte ut en kunngjøring:'}
      </b>
      <br />
      {htmlTag(contextRender[object.contentType](object))}
    </span>
  );
}
export function activityContent() {
  return null;
}
export function icon() {
  return <Icon name="chatbubbles" />;
}
export function getURL() {
  return '/timeline';
}
