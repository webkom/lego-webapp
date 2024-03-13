import { Icon } from '@webkom/lego-bricks';
import DisplayContent from 'app/components/DisplayContent';
import { lookupContext, contextRender } from '../context';
import { formatHeader } from './utils';
import type { AggregatedActivity, TagInfo } from '../types';
import type { ReactElement } from 'react';

/**
 * Grouped by target and date, standard...
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (arg0: TagInfo) => ReactElement
) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actors = aggregatedActivity.actorIds.map((actorId) => {
    return lookupContext(aggregatedActivity, actorId);
  });
  const target = lookupContext(aggregatedActivity, latestActivity.target);

  if (!(actors.length !== 0 && target)) {
    return null;
  }

  const actorsRender = actors.map(
    (actor) => actor && htmlTag(contextRender[actor.contentType](actor))
  );
  return (
    <b>
      {formatHeader(actorsRender)} meldte seg på arrangementet{' '}
      {htmlTag(contextRender[target.contentType](target))}
    </b>
  );
}
export function activityContent() {
  return <DisplayContent content="" />;
}
export function icon() {
  return <Icon name="chatbubble" />;
}
export function getURL(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const event = lookupContext(aggregatedActivity, latestActivity.target);

  if (!event) {
    return '/events';
  }

  return `/events/${event.id}`;
}
