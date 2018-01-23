// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity } from '../types';

/**
 * Group by object
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: Function => string
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
