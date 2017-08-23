import React from 'react';
import Icon from 'app/components/Icon';

/**
 * Group by object
 * One element for each sent restricted mail
 * No extra information in the feed element
 */
export function activityHeader(aggregatedActivity) {
  return <b>Begrenset epost sent ut til alle mottakere</b>;
}

export function activityContent(activity) {
  return null;
}

export function icon(aggregatedActivity) {
  return <Icon name="at" />;
}
