import type { ID } from 'app/store/models/index';

export type FeedType = 'notifications' | 'personal' | `user`;
export type FeedID = 'notifications' | 'personal' | `user-${ID}`;

export default interface Feed {
  type: FeedType;
  activities: ID[];
}
