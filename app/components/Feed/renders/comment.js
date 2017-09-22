// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity, Activity } from '../types';

/**
 * Comments are grouped by the comment target and date.
 * This makes it possible to use the latest activity to generate the header.
 */
export function activityHeader(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const target = lookupContext(aggregatedActivity, latestActivity.target);

  if (!(actor && target)) {
    return null;
  }

  return (
    <b>
      {contextRender[actor.contentType](actor)} kommenterte på{' '}
      {contextRender[target.contentType](target)}
    </b>
  );
}

export function activityContent(activity: Activity) {
  return (
    <div dangerouslySetInnerHTML={{ __html: activity.extraContext.content }} />
  );
}

export function icon() {
  return <Icon name="text" />;
}
