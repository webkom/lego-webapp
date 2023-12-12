import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface PollOption {
  id: ID;
  name: string;
  votes: number;
}

export interface Poll {
  id: ID;
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
}

export default Poll;
