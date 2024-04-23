import type { EntityId } from '@reduxjs/toolkit';

export enum MeetingInvitationStatus {
  NoAnswer = 'NO_ANSWER',
  Attending = 'ATTENDING',
  NotAttending = 'NOT_ATTENDING',
}

export interface MeetingInvitation {
  user: EntityId;
  status: MeetingInvitationStatus;
  meeting: EntityId;
}
