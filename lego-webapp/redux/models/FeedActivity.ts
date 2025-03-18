import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type {
  FeedAttrAnnouncement,
  FeedAttrEvent,
  FeedAttrGroup,
  FeedAttrMeetingInvitation,
  FeedAttrRegistration,
  FeedAttrRestrictedMail,
  UnknownFeedAttr,
} from '~/redux/models/FeedAttrCache';
import type { ContentTarget } from '~/utils/contentTarget';

export enum FeedActivityVerb {
  Comment = 'comment',
  CommentReply = 'comment_reply',
  MeetingInvitation = 'meeting_invitation',
  RestrictedMailSent = 'restricted_mail_sent',
  RegistrationBump = 'registration_bump',
  AdminRegistration = 'admin_registration',
  Announcement = 'announcement',
  GroupJoin = 'group_join',
  EventRegister = 'event_register',
}

export type FeedActivityVerbAttr = {
  [FeedActivityVerb.Comment]: UnknownFeedAttr;
  [FeedActivityVerb.CommentReply]: UnknownFeedAttr;
  [FeedActivityVerb.MeetingInvitation]: FeedAttrMeetingInvitation;
  [FeedActivityVerb.RestrictedMailSent]: FeedAttrRestrictedMail;
  [FeedActivityVerb.RegistrationBump]: FeedAttrRegistration;
  [FeedActivityVerb.AdminRegistration]: FeedAttrRegistration;
  [FeedActivityVerb.Announcement]: FeedAttrAnnouncement;
  [FeedActivityVerb.GroupJoin]: FeedAttrGroup;
  [FeedActivityVerb.EventRegister]: FeedAttrEvent;
};

export interface FeedActivity {
  activityId: EntityId;
  verb: number;
  time: Dateish;
  extraContext: Record<string, string>;
  actor: ContentTarget;
  object: ContentTarget;
  target: ContentTarget;
}

export default interface AggregatedFeedActivity<
  Verb extends FeedActivityVerb = FeedActivityVerb,
> {
  id: EntityId;
  orderingKey: string;
  verb: Verb;
  createdAt: Dateish;
  updatedAt: Dateish;
  lastActivity: FeedActivity;
  activities: FeedActivity[];
  activityCount: number;
  actorIds: EntityId[];
  read: boolean;
  seen: boolean;
  context: Record<string, FeedActivityVerbAttr[Verb]>;
}
