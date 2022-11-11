import { ID } from 'app/store/models/index';

export default interface Emoji {
  shortCode: string;
  keywords: Array<string>;
  unicodeString: string;
  fitzpatrickScale: boolean;
  category: string;
  hasReacted?: boolean;
  reactionId?: ID;
}
