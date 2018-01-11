// @flow
import React from 'react';
import Icon from 'app/components/Icon';
import { lookupContext } from '../context';
import type { AggregatedActivity } from '../types';

/**
 * Group by object
 * One element for each sent restricted mail
 * No extra information in the feed element
 */
export function activityHeader() {
  return <b>Begrenset epost sent ut til alle mottakere</b>;
}

export function activityContent() {
  return null;
}

export function icon() {
  return <Icon name="at" />;
}

export function getURL(aggregatedActivity: AggregatedActivity) {
  const restrictedMail = aggregatedActivity.activities.reduce(
    (acc, activity) => {
      const context = lookupContext(aggregatedActivity, activity.object);
      return context ? acc.concat(context) : acc;
    },
    []
  );
  return `/admin/email/restricted/${restrictedMail[0].id}/`;
}
