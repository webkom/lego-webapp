// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import joinValues from 'app/utils/joinValues';
import type { AggregatedActivity, Activity } from '../types';
import DisplayContent from 'app/components/DisplayContent';

/**
 * Comments are grouped by the comment target and date.
 * This makes it possible to use the latest activity to generate the header.
 */
export function activityHeader(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actors = aggregatedActivity.actorIds.map(actorId => {
    return lookupContext(aggregatedActivity, actorId);
  });
  const target = lookupContext(aggregatedActivity, latestActivity.target);

  if (!(actors.length !== 0 && target)) {
    return null;
  }

  const actorsRender = actors.map(actor =>
    contextRender[actor.contentType](actor)
  );

  return (
    <b>
      {joinValues(actorsRender)} svarte på din kommentar på{' '}
      {contextRender[target.contentType](target)}
    </b>
  );
}

export function activityContent(activity: Activity) {
  return <DisplayContent content={activity.extraContext.content} />;
}

export function icon() {
  return <Icon name="text" />;
}
