// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity, Activity } from '../types';
import DisplayContent from 'app/components/DisplayContent';

/**
 * Grouped by object...
 */
export function activityHeader(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const actor = lookupContext(aggregatedActivity, latestActivity.actor);
  const target = lookupContext(aggregatedActivity, latestActivity.target);

  if (!(actor && target)) {
    return;
  }

  let groupType = 'gruppen';
  if (target.type === 'interesse') {
    groupType = 'interessegruppen';
  } else if (target.type === 'komite') {
    groupType = 'komiteen';
  }

  return (
    <b>
      {contextRender[actor.contentType](actor)}
      {` ble medlem av ${groupType} `}
      {target.name}
    </b>
  );
}

export function activityContent(
  activity: Activity,
  aggregatedActivity: AggregatedActivity
) {
  const target = lookupContext(aggregatedActivity, activity.target);
  return (
    <div style={{ textAlign: 'center' }}>
      <DisplayContent content={`<img src="${target.logo}" />`} />
    </div>
  );
}

export function icon() {
  return <Icon name="people-outline" />;
}
