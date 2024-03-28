import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface Meeting {
  id: EntityId;
  createdBy: EntityId;
  description: string;
  title: string;
  location: string;
  startTime: Dateish;
  endTime: Dateish;
  report: string;
  reportAuthor?: EntityId;
  invitations: EntityId[];
  comments: EntityId[];
  contentTarget: ContentTarget;
  mazemapPoi?: number;
  reactionsGrouped?: ReactionsGrouped[];
  actionGrant: ActionGrant;
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
  | 'contentTarget'
  | 'mazemapPoi'
  | 'reactionsGrouped'
  | 'actionGrant'
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

export type AutocompleteMeeting = Pick<
  Meeting,
  'title' | 'startTime' | 'id'
> & {
  contentType: AutocompleteContentType.Meeting;
  text: 'text';
};

export type UnknownMeeting = (DetailedMeeting | ListMeeting) & {
  comments?: EntityId[];
  reactionsGrouped?: ReactionsGrouped[];
};

// Used when a meeting is a field in another model
export type FieldMeeting = Pick<Meeting, 'id' | 'title'>;
