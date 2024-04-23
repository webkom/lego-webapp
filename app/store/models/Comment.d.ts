import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export interface Comment {
  id: EntityId;
  text: string | null;
  author: PublicUser | null;
  contentTarget: ContentTarget;
  createdAt: Dateish;
  updatedAt: Dateish;
  parent: EntityId | null;
}

export default Comment;

export type ContentAuthors = EntityId | EntityId[] | null | undefined;
