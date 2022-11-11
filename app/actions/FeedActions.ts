import { feedIdByUserId } from 'app/reducers/feeds';
import type { ID } from 'app/store/models';
import type { EntityType } from 'app/store/models/Entities';
import type { FeedID } from 'app/store/models/Feed';
import { feedActivitySchema } from 'app/store/schemas';
import createLegoApiAction, {
  LegoApiSuccessPayload,
} from 'app/store/utils/createLegoApiAction';

export const fetchFeed = createLegoApiAction<
  LegoApiSuccessPayload<EntityType.FeedActivity>
>()('Feed.FETCH', (_, feedId: FeedID, endpoint: string) => ({
  endpoint,
  schema: [feedActivitySchema],
  meta: {
    feedId,
  },
}));

export const fetchUserFeed = (userId: ID) =>
  fetchFeed(feedIdByUserId(userId), `/feed-user/${userId}/`);

export const fetchPersonalFeed = () => fetchFeed('personal', '/feed-personal/');

export const fetchNotificationFeed = () =>
  fetchFeed('notifications', '/feed-notifications/');
