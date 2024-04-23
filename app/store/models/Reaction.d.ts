import type { EntityId } from '@reduxjs/toolkit';
import type { PublicUser } from 'app/store/users/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export default interface Reaction {
  reactionId: EntityId;
  emoji: string;
  contentTarget: ContentTarget;
}

export type ReactionResponse = Omit<Reaction, 'contentTarget'>;

export interface ReactionsGrouped {
  emoji: string;
  unicodeString: string;
  count: number;
  hasReacted: boolean;
  reactionId?: EntityId;
  users?: PublicUser[];
}
