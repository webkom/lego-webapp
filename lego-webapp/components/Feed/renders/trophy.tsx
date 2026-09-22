import { Icon } from '@webkom/lego-bricks';
import { Trophy } from 'lucide-react';
import { FeedActivityVerb } from '~/redux/models/FeedActivity';
import { getAchievementInfo, rarityMap } from '~/utils/achievementConstants';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';
import type { AchievementIdentifier } from '~/utils/achievementConstants';

const TrophyRenderer: ActivityRenderer<FeedActivityVerb.Trophy> = {
  Header: ({ aggregatedActivity }) => {
    const latestActivity = aggregatedActivity.lastActivity;
    const identifier = latestActivity.extraContext
      .identifier as AchievementIdentifier;
    const level = Number(latestActivity.extraContext.level);
    const achievementInfo = getAchievementInfo({ identifier, level });

    return (
      <p>
        <b>
          Du har fått et nytt trofé:{' '}
          {achievementInfo && (
            <span style={{ color: rarityMap[achievementInfo.rarity].color }}>
              «{achievementInfo.name}»
            </span>
          )}
        </b>
      </p>
    );
  },
  Content: () => null,
  Icon: () => <Icon iconNode={<Trophy />} />,
  getNotificationUrl: () => `/achievements`,
};

export default TrophyRenderer;
