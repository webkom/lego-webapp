import type { Dateish } from 'app/models';
import type { ReactionsGrouped } from 'app/reducers/reactions';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export default interface Article {
  id: ID;
  title: string;
  cover: string;
  coverPlaceholder: string;
  author: ID;
  description: string;
  tags: string[];
  createdAt: Dateish;
  pinned: boolean;

  // only in article detail
  comments?: ID[];
  contentTarget?: ContentTarget;
  content?: string;
  reactionsGrouped?: ReactionsGrouped;
  youtubeUrl?: string;
  canEditUsers?: ID[];
  canEditGroups?: ID[];
  requireAuth?: boolean;
  actionGrant?: string[];
}
