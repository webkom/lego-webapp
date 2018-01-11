// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity } from '../types';

/**
 * Group by object
 */
export function activityHeader(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const object = lookupContext(aggregatedActivity, latestActivity.object);

  return (
    <b>
      {contextRender[actor.contentType](actor)}
      {' sendte ut en kunngjøring:'}
      <br />
      {contextRender[object.contentType](object)}
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
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  return `/users/${actor.username}/`;
}
