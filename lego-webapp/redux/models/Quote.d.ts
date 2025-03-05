import type { PublicUser } from './User';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { ReactionsGrouped } from '~/redux/models/Reaction';
import type { ContentTarget } from '~/utils/contentTarget';

export default interface Quote {
  id: EntityId;
  createdAt: Dateish;
  text: string;
  source: string;
  approved: boolean;
  tags: string[];
  reactionsGrouped: ReactionsGrouped[];
  contentTarget: ContentTarget;
  createdBy: PublicUser | null;
}
