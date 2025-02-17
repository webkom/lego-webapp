import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { ListEvent } from '~/redux/models/Event';
import type { PublicGroup } from '~/redux/models/Group';
import type { DetailedMeeting } from '~/redux/models/Meeting';
import type { PublicUser } from '~/redux/models/User';

interface CompleteAnnouncement {
  id: EntityId;
  message: string;
  fromGroup: null | PublicGroup;
  sent: null | Dateish;
  users: PublicUser[];
  groups: PublicGroup[];
  events: ListEvent[];
  excludeWaitingList: boolean;
  meetings: DetailedMeeting[];
  meetingInvitationStatus: MeetingInvitationStatus;
}

export type ListAnnouncement = Pick<
  CompleteAnnouncement,
  | 'id'
  | 'message'
  | 'fromGroup'
  | 'sent'
  | 'users'
  | 'groups'
  | 'events'
  | 'excludeWaitingList'
  | 'meetings'
  | 'meetingInvitationStatus'
>;

export type DetailedAnnouncement = Pick<
  CompleteAnnouncement,
  | 'id'
  | 'message'
  | 'fromGroup'
  | 'sent'
  | 'users'
  | 'groups'
  | 'events'
  | 'excludeWaitingList'
  | 'meetings'
  | 'meetingInvitationStatus'
>;

export type UnknownAnnouncement = ListAnnouncement | DetailedAnnouncement;
