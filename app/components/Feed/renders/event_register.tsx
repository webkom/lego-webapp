import { Icon } from '@webkom/lego-bricks';
import DisplayContent from 'app/components/DisplayContent';
import { lookupContext, contextRender } from '../context';
import { formatHeader } from './utils';
import type { AggregatedActivity, Activity, TagInfo } from '../types';
import type { Element } from 'react';

/**
 * Grouped by target and date, standard...
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (arg0: TagInfo) => Element<any>
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
