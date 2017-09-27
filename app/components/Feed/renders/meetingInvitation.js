// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import joinValues from 'app/utils/joinValues';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity } from '../types';

/**
 * Group by actor
 * actor -> meeting1, meeting2
 */
export function activityHeader(aggregatedActivity: AggregatedActivity) {
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
    meetings.map(meeting => contextRender[meeting.contentType](meeting))
  );

  return (
    <b>
      {contextRender[actor.contentType](actor)} inviterte deg til {toRender}
    </b>
  );
}

export function activityContent() {
  return null;
}

export function icon() {
  return <Icon name="calendar" />;
}
