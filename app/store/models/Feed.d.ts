import type { EntityId } from '@reduxjs/toolkit';

export type FeedType = 'notifications' | 'personal' | `user`;
export type FeedID = 'notifications' | 'personal' | `user-${EntityId}`;

export default interface Feed {
  id: EntityId;
  type: FeedType;
  activities: ID[];
}
