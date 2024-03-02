import { Icon } from '@webkom/lego-bricks';
import DisplayContent from 'app/components/DisplayContent';
import { GroupType } from 'app/models';
import { lookupContext, contextRender } from '../context';
import type { AggregatedActivity, Activity, TagInfo } from '../types';
import type { Element } from 'react';

/**
 * Grouped by object...
 */
export function activityHeader(
  aggregatedActivity: AggregatedActivity,
  htmlTag: (arg0: TagInfo) => Element<any>,
) {
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
      {htmlTag(contextRender[actor.contentType](actor))}
      {` ble medlem av ${groupType} `}
      {target.name}
    </b>
  );
}
export function activityContent(
  activity: Activity,
  aggregatedActivity: AggregatedActivity,
) {
  const target = lookupContext(aggregatedActivity, activity.target);
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <DisplayContent content={`<img src="${target.logo}" />`} />
    </div>
  );
}
export function icon() {
  return <Icon name="people-outline" />;
}
export function getURL(aggregatedActivity: AggregatedActivity) {
  const latestActivity = aggregatedActivity.lastActivity;
  const group = lookupContext(aggregatedActivity, latestActivity.target);

  if (!group) {
    return '';
  }

  switch (group.type) {
    case GroupType.Interest:
      return `/interest-groups/${group.id}`;

    case GroupType.Committee:
      return `/pages/komiteer/${group.id}`;

    default:
      return '';
  }
}
