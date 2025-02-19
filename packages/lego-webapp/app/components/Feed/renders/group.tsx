import { Icon } from '@webkom/lego-bricks';
import DisplayContent from 'app/components/DisplayContent';
import { GroupType } from 'app/models';
import { contextRender } from '../context';
import type ActivityRenderer from 'app/components/Feed/ActivityRenderer';

/**
 * Grouped by object...
 */
const GroupJoinRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity, tag: Tag }) => {
    const latestActivity = aggregatedActivity.lastActivity;
    const actor = aggregatedActivity.context[latestActivity.actor];
    const target = aggregatedActivity.context[latestActivity.target];

    if (!(actor && target)) {
      return null;
    }

    let groupType = 'gruppen';

    if (target.type === 'interesse') {
      groupType = 'interessegruppen';
    } else if (target.type === 'komite') {
      groupType = 'komiteen';
    }

    return (
      <b>
        <Tag {...contextRender[actor.contentType](actor)} />
        {` ble medlem av ${groupType} `}
        <Tag {...contextRender[target.contentType](target)} />
      </b>
    );
  },
  Content: ({ aggregatedActivity, activity }) => {
    const target = aggregatedActivity.context[activity.target];
    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <DisplayContent content={`<img src="${target.logo}" />`} />
      </div>
    );
  },
  Icon: () => <Icon name="people-outline" />,
  getNotificationUrl: (aggregatedActivity) => {
    const latestActivity = aggregatedActivity.lastActivity;
    const group = aggregatedActivity.context[latestActivity.target];

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
  },
};

export default GroupJoinRenderer;
