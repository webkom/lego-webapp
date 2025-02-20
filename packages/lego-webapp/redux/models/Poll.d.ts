import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { ContentTarget } from '~/utils/contentTarget';

interface PollOption {
  id: EntityId;
  name: string;
  votes: number;
}

export interface Poll {
  id: EntityId;
  createdAt: Dateish;
  validUntil: Dateish;
  title: string;
  description: string;
  options: PollOption[];
  resultsHidden: boolean;
  totalVotes: number;
  comments: unknown; // TODO: is it even possible to comment on polls?
  contentTarget: ContentTarget;
  tags: string[];
  hasAnswered: boolean;
  pinned: boolean;
  actionGrant?: string[];
}

export default Poll;
