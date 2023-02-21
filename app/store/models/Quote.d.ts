import type { Dateish } from 'app/models';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export default interface Quote {
  id: ID;
  createdAt: Dateish;
  text: string;
  source: string;
  approved: boolean;
  tags: string[];
  reactionsGrouped: ReactionsGrouped[];
  contentTarget: ContentTarget;
}
