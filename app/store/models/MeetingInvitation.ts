import type { ID } from 'app/store/models/index';

export enum MeetingInvitationStatus {
  NoAnswer = 'NO_ANSWER',
  Attending = 'ATTENDING',
  NotAttending = 'NOT_ATTENDING',
}

export interface MeetingInvitation {
  user: ID;
  status: MeetingInvitationStatus;
  meeting: ID;
}
