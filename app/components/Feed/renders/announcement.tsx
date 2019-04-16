import React, { ReactElement } from 'react';
import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import { AggregatedActivity, TagInfo } from '../types';

/**
 * Group by object
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: TagInfo => ReactElement<*>
) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const object = lookupContext(aggregatedActivity, latestActivity.object);

  return (
    <b>
      {htmlTag(contextRender[actor.contentType](actor))}
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
  return <Icon name="chatboxes" />;
}

export function getURL(aggregatedActivity: AggregatedActivity) {
  return '/timeline';
}
