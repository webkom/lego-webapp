// @flow
import type { Element } from 'react';

import Icon from 'app/components/Icon';
import joinValues from 'app/utils/joinValues';
import { contextRender, lookupContext } from '../context';
import type { AggregatedActivity, TagInfo } from '../types';

/**
 * Group by actor
 * actor -> meeting1, meeting2
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (TagInfo) => Element<*>
) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const meetings = aggregatedActivity.activities.reduce((acc, activity) => {
    const context = lookupContext(aggregatedActivity, activity.object);
    return context ? acc.concat(context) : acc;
  }, []);

  if (!(actor && meetings)) {
    return null;
  }

  const toRender = joinValues(
    meetings.map((meeting) =>
      htmlTag(contextRender[meeting.contentType](meeting))
    )
  );

  return (
    <b>
      {htmlTag(contextRender[actor.contentType](actor))} inviterte deg til{' '}
      {toRender}
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
  const meetings = aggregatedActivity.activities.reduce((acc, activity) => {
    const context = lookupContext(aggregatedActivity, activity.object);
    return context ? acc.concat(context) : acc;
  }, []);

  if (!meetings || meetings.length !== 1) {
    return '/meetings';
  }
  return `/meetings/${meetings[0].meeting.id}`;
}
