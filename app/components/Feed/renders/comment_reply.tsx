import { Icon } from '@webkom/lego-bricks';
import DisplayContent from 'app/components/DisplayContent';
import { lookupContext, contextRender } from '../context';
import { commentURL } from './comment';
import { formatHeader } from './utils';
import type { AggregatedActivity, Activity, TagInfo } from '../types';
import type { Element } from 'react';

/**
 * Comments are grouped by the comment target and date.
 * This makes it possible to use the latest activity to generate the header.
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
      {formatHeader(actorsRender)} svarte på din kommentar på{' '}
      {htmlTag(contextRender[target.contentType](target))}
    </b>
  );
}
export function activityContent(activity: Activity) {
  return <DisplayContent content={activity.extraContext.content} />;
}
export function icon() {
  return <Icon name="chatbubble" />;
}
export function getURL(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const target = lookupContext(aggregatedActivity, latestActivity.target);
  return commentURL(target);
}
