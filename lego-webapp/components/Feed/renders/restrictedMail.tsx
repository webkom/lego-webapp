import { Icon } from '@webkom/lego-bricks';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';

/**
 * Group by object
 * One element for each sent restricted mail
 * No extra information in the feed element
 */
const RestrictedMailSentRenderer: ActivityRenderer = {
  Header: () => <b>Begrenset e-post sendt ut til alle mottakere</b>,
  Content: () => null,
  Icon: () => <Icon name="at" />,
  getNotificationUrl: (aggregatedActivity) => {
    const latestActivity = aggregatedActivity.lastActivity;
    const mail = aggregatedActivity.context[latestActivity.object];

    if (!mail) {
      return '/admin/email/restricted';
    }

    return `/admin/email/restricted/${mail.id}`;
  },
};

export default RestrictedMailSentRenderer;
