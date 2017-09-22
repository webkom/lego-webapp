// @flow
import React from 'react';
import Icon from 'app/components/Icon';

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
