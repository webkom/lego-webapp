import { Icon } from '@webkom/lego-bricks';
import { lookupContext, contextRender } from '../context';
import { formatHeader } from './utils';
import type { AggregatedActivity, TagInfo } from '../types';
import type { Element } from 'react';

/**
 * Normal grouping by target and date
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (arg0: TagInfo) => Element<any>
) {
  const events = aggregatedActivity.activities.reduce((acc, activity) => {
    const context = lookupContext(aggregatedActivity, activity.actor);
    return context ? acc.concat(context) : acc;
  }, []);

  if (events.length === 0) {
    return null;
  }

  return (
    <b>
      {'Du har blitt påmeldt på '}
      {formatHeader(
        events.map((event) => htmlTag(contextRender[event.contentType](event)))
      )}
      {' av en administrator'}
    </b>
  );
}
export function activityContent() {
  return null;
}
export function icon() {
  return <Icon name="calendar" />;
}
export function getURL(aggregatedActivity: AggregatedActivity) {
  const events = aggregatedActivity.activities.reduce((acc, activity) => {
    const context = lookupContext(aggregatedActivity, activity.actor);
    return context ? acc.concat(context) : acc;
  }, []);

  if (!events || events.length !== 1) {
    return '/events';
  }

  return `/events/${events[0].id}`;
}
