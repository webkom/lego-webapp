import React from 'react';
import Icon from 'app/components/Icon';
import joinValues from 'app/utils/joinValues';
import { lookupContext, contextRender } from '../context';

/**
 * Group by actor
 * actor -> meeting1, meeting2
 */
export function activityHeader(aggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const meetings = aggregatedActivity.activities.map(activity =>
    lookupContext(aggregatedActivity, activity.object));
  return (
    <b>
      {contextRender[actor.contentType](actor)}
      {' '}
      inviterte deg til
      {' '}
      {joinValues(
        meetings.map(meeting => contextRender[meeting.contentType](meeting))
      )}
    </b>
  );
}

export function activityContent(activity) {
  return null;
}

export function icon(aggregatedActivity) {
  return <Icon name="calendar" />;
}
