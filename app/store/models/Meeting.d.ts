import type { Dateish } from 'app/models';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface Meeting {
  id: number;
  createdBy: ID;
  description: string;
  title: string;
  location: string;
  startTime: Dateish;
  endTime: Dateish;
  report: string;
  reportAuthor?: ID;
  invitations: ID[];
  comments: ID[];
  contentTarget: ContentTarget;
  mazemapPoi?: number;
  reactionsGrouped?: ReactionsGrouped;
}

export type DetailedMeeting = Pick<
  Meeting,
  | 'id'
  | 'createdBy'
  | 'description'
  | 'title'
  | 'location'
  | 'startTime'
  | 'endTime'
  | 'report'
  | 'reportAuthor'
  | 'invitations'
  | 'comments'
  | 'content_target'
  | 'mazemapPoi'
  | 'reactionsGrouped'
>;

export type ListMeeting = Pick<
  Meeting,
  | 'id'
  | 'createdBy'
  | 'title'
  | 'location'
  | 'startTime'
  | 'endTime'
  | 'reportAuthor'
  | 'mazemapPoi'
>;

export type SearchMeeting = Pick<
  Meeting,
  'id' | 'title' | 'description' | 'report' | 'startTime'
>;

export type UnknownMeeting = DetailedMeeting | ListMeeting | SearchMeeting;

// Used when a meeting is a field in another model
export type FieldMeeting = Pick<Meeting, 'id' | 'title'>;
