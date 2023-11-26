import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export default interface Reaction {
  reactionId: ID;
  emoji: string;
  contentTarget: ContentTarget;
}

export type ReactionResponse = Omit<Reaction, 'contentTarget'>;

export interface ReactionsGrouped {
  emoji: string;
  unicodeString: string;
  count: number;
  hasReacted: boolean;
  reactionId?: ID;
  users?: string[];
}
