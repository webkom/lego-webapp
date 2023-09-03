import { Icon } from '@webkom/lego-bricks';
import { lookupContext } from '../context';
import type { AggregatedActivity } from '../types';

/**
 * Group by object
 * One element for each sent restricted mail
 * No extra information in the feed element
 */
export function activityHeader() {
  return <b>Begrenset e-post sendt ut til alle mottakere</b>;
}
export function activityContent() {
  return null;
}
export function icon() {
  return <Icon name="at" />;
}
export function getURL(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const mail = lookupContext(aggregatedActivity, latestActivity.object);

  if (!mail) {
    return '/admin/email/restricted';
  }

  return `/admin/email/restricted/${mail.id}`;
}
