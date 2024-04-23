import type AggregatedFeedActivity, {
  FeedActivity,
} from 'app/store/models/FeedActivity';
import type { ComponentType } from 'react';

export type TagProps = {
  link: string;
  text: string;
  linkableContent: boolean;
};

export type TagComponent = ComponentType<TagProps>;

type HeaderProps = {
  aggregatedActivity: AggregatedFeedActivity;
  tag: TagComponent;
};

type ContentProps = {
  aggregatedActivity: AggregatedFeedActivity;
  activity: FeedActivity;
};

type ActivityRenderer = {
  Header: ComponentType<HeaderProps>;
  Content: ComponentType<ContentProps>;
  Icon: ComponentType;
  getNotificationUrl: (aggregatedActivity: AggregatedFeedActivity) => string;
};

export default ActivityRenderer;
