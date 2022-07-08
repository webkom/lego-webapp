// @flow
import type { Element } from 'react';

import DisplayContent from 'app/components/DisplayContent';
import Icon from 'app/components/Icon';
import { contextRender, lookupContext } from '../context';
import type { Activity, AggregatedActivity, TagInfo } from '../types';
import { formatHeader } from './utils';

/**
 * Grouped by target and date, standard...
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (TagInfo) => Element<*>
) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actors = aggregatedActivity.actorIds.map((actorId) => {
    return lookupContext(aggregatedActivity, actorId);
  });
  const target = lookupContext(aggregatedActivity, latestActivity.target);

  if (!(actors.length !== 0 && target)) {
    return null;
  }

  const actorsRender = actors.map((actor) =>
    htmlTag(contextRender[actor.contentType](actor))
  );

  return (
    <b>
      {formatHeader(actorsRender)} meldte seg på arrangementet{' '}
      {htmlTag(contextRender[target.contentType](target))}
    </b>
  );
}

export function activityContent(activity: Activity) {
  return <DisplayContent content="" />;
}

export function icon() {
  return <Icon name="text" />;
}

export function getURL(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const event = lookupContext(aggregatedActivity, latestActivity.target);
  if (!event) {
    return '/events';
  }
  return `/events/${event.id}`;
}
