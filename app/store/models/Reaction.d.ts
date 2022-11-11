import type { ID } from 'app/store/models/index';

export default interface Reaction {
  reactionId: ID;
  emoji: string;
}
