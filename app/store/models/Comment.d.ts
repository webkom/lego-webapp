import type { Dateish } from 'app/models';
import type User from 'app/store/models/User';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export interface Comment {
  id: ID;
  text: string | null;
  author: User | null;
  contentTarget: ContentTarget;
  createdAt: Dateish;
  updatedAt: Dateish;
  parent: ID | null;
}

export default Comment;

export type ContentAuthors = ID | ID[] | null | undefined;
