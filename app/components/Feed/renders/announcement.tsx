// @flow
import type { Element } from 'react';
import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity, TagInfo } from '../types';
import styles from '../context.css';

/**
 * Group by object
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (TagInfo) => Element<*>
) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const object = lookupContext(aggregatedActivity, latestActivity.object);

  return (
    <b>
      {object.fromGroup ? (
        <span className={styles.highlight}>{object.fromGroup.name}</span>
      ) : (
        htmlTag(contextRender[actor.contentType](actor))
      )}
      {' sendte ut en kunngjøring:'}
      <br />
      {htmlTag(contextRender[object.contentType](object))}
    </b>
  );
}

export function activityContent() {
  return null;
}

export function icon() {
  return <Icon name="chatbubbles" />;
}

export function getURL(aggregatedActivity: AggregatedActivity) {
  return '/timeline';
}
