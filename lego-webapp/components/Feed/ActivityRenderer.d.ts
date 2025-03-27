import AggregatedFeedActivity, {
  FeedActivity,
  FeedActivityVerb,
} from '~/redux/models/FeedActivity';
import type { ComponentType } from 'react';

export type TagProps = {
  link: string;
  text: string;
  linkableContent: boolean;
};

export type TagComponent = ComponentType<TagProps>;

type HeaderProps<Verb extends FeedActivityVerb> = {
  aggregatedActivity: AggregatedFeedActivity<Verb>;
  tag: TagComponent;
};

type ContentProps<Verb extends FeedActivityVerb> = {
  aggregatedActivity: AggregatedFeedActivity<Verb>;
  activity: FeedActivity;
};

type ActivityRenderer<Verb extends FeedActivityVerb = FeedActivityVerb> = {
  Header: ComponentType<HeaderProps<Verb>>;
  Content: ComponentType<ContentProps<Verb>>;
  Icon: ComponentType;
  getNotificationUrl: (
    aggregatedActivity: AggregatedFeedActivity<Verb>,
  ) => string;
};

export default ActivityRenderer;
