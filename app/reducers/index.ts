import { schema } from 'normalizr';
import { EntityType } from 'app/store/models/entities';
import type { EntityId } from '@reduxjs/toolkit';

export const restrictedMailSchema = new schema.Entity(
  EntityType.RestrictedMails,
);
export const groupSchema = new schema.Entity(EntityType.Groups);
export const penaltySchema = new schema.Entity(EntityType.Penalties, {});
export const userSchema = new schema.Entity(EntityType.Users, {
  abakusGroups: [groupSchema],
  penalties: [penaltySchema],
});
export const emailUserSchema = new schema.Entity(EntityType.EmailUsers, {
  user: userSchema,
});
export const emailListSchema = new schema.Entity(EntityType.EmailLists, {
  users: [userSchema],
  groups: [groupSchema],
});
export const registrationSchema = new schema.Entity(EntityType.Registrations, {
  user: userSchema,
});
export const poolSchema = new schema.Entity(EntityType.Pools, {
  registrations: [registrationSchema],
});
export const commentSchema = new schema.Entity(EntityType.Comments);
export const eventSchema = new schema.Entity(EntityType.Events, {
  pools: [poolSchema],
  comments: [commentSchema],
  waitingRegistrations: [registrationSchema],
  pendingRegistration: registrationSchema,
});
export const eventAdministrateSchema = new schema.Entity(EntityType.Events, {
  pools: [poolSchema],
  unregistered: [registrationSchema],
  waitingRegistrations: [registrationSchema],
});
export const articleSchema = new schema.Entity(EntityType.Articles, {
  comments: [commentSchema],
  authors: [userSchema],
});

export const imageGallerySchema = new schema.Entity(
  'imageGalleryEntries',
  {},
  {
    idAttribute: 'key',
  },
);

export const galleryPictureSchema = new schema.Entity(
  EntityType.GalleryPictures,
  {
    comments: [commentSchema],
  },
);
export const gallerySchema = new schema.Entity(EntityType.Galleries);
export const quoteSchema = new schema.Entity(EntityType.Quotes);
export const pollSchema = new schema.Entity(EntityType.Polls);
export const pageSchema = new schema.Entity(
  EntityType.Pages,
  {},
  {
    idAttribute: 'slug',
  },
);
export const companySemesterSchema = new schema.Entity(
  EntityType.CompanySemesters,
);
export const companyInterestSchema = new schema.Entity(
  EntityType.CompanyInterests,
  {
    semesters: [companySemesterSchema],
  },
);
export const companySchema = new schema.Entity(EntityType.Companies, {
  studentContact: userSchema,
  comments: [commentSchema],
});
export const joblistingsSchema = new schema.Entity(EntityType.Joblistings);
export const announcementsSchema = new schema.Entity(EntityType.Announcements);
export const feedActivitySchema = new schema.Entity(EntityType.FeedActivities);
export const oauth2ApplicationSchema = new schema.Entity(
  EntityType.OAuth2Applications,
);
export const oauth2GrantSchema = new schema.Entity(EntityType.OAuth2Grants);
export const membershipSchema = new schema.Entity(EntityType.Memberships, {
  user: userSchema,
});

export const createMeetingInvitationId = (
  meetingId: EntityId,
  userId: EntityId,
) => `${meetingId}-${userId}`;
export const meetingInvitationSchema = new schema.Entity(
  EntityType.MeetingInvitations,
  {
    user: userSchema,
  },
  {
    idAttribute: (invite) =>
      createMeetingInvitationId(invite.meeting, invite.user.id),
  },
);
export const meetingSchema = new schema.Entity(EntityType.Meetings, {
  invitations: [meetingInvitationSchema],
  reportAuthor: userSchema,
  createdBy: userSchema,
  comments: [commentSchema],
});
export const frontpageSchema = new schema.Entity('frontpage', {
  events: [eventSchema],
  articles: [articleSchema],
  poll: pollSchema,
});
export const emojiSchema = new schema.Entity(
  EntityType.Emojis,
  {},
  {
    idAttribute: 'shortCode',
  },
);
export const surveySchema = new schema.Entity(EntityType.Surveys, {
  event: eventSchema,
});
export const surveySubmissionSchema = new schema.Entity(
  EntityType.SurveySubmissions,
  {
    user: userSchema,
  },
);
export const tagSchema = new schema.Entity(
  EntityType.Tags,
  {},
  {
    idAttribute: 'tag',
  },
);

export const createFollowersSliceKey = (key: string) =>
  'followers' + key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();

export const followersEventSchema = new schema.Entity(
  createFollowersSliceKey('event'),
  {
    follower: userSchema,
  },
);

export const threadSchema = new schema.Entity(EntityType.Thread, {
  comments: [commentSchema],
});
export const forumSchema = new schema.Entity(EntityType.Forums, {
  threads: [threadSchema],
});
export const lendableObjectSchema = new schema.Entity(EntityType.LendableObjects, {
  responsibleGroups: [groupSchema],
});
export const lendingRequestSchema = new schema.Entity(EntityType.LendingRequests);
