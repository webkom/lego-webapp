import { schema } from 'normalizr';
import { followersKeyGen } from './followers';
import { getMeetingInvitationId } from './meetingInvitations';

export const restrictedMailSchema = new schema.Entity('restrictedMails');
export const groupSchema = new schema.Entity('groups');
export const penaltySchema = new schema.Entity('penalties', {});
export const userSchema = new schema.Entity('users', {
  abakusGroups: [groupSchema],
  penalties: [penaltySchema],
});
export const emailUserSchema = new schema.Entity('emailUsers', {
  user: userSchema,
});
export const emailListSchema = new schema.Entity('emailLists', {
  users: [userSchema],
  groups: [groupSchema],
});
export const registrationSchema = new schema.Entity('registrations', {
  user: userSchema,
});
export const poolSchema = new schema.Entity('pools', {
  registrations: [registrationSchema],
});
export const commentSchema = new schema.Entity('comments');
export const eventSchema = new schema.Entity('events', {
  pools: [poolSchema],
  comments: [commentSchema],
  waitingRegistrations: [registrationSchema],
  pendingRegistration: registrationSchema,
});
export const eventAdministrateSchema = new schema.Entity('events', {
  pools: [poolSchema],
  unregistered: [registrationSchema],
  waitingRegistrations: [registrationSchema],
});
export const articleSchema = new schema.Entity('articles', {
  comments: [commentSchema],
  authors: [userSchema],
});

export const imageGallerySchema = new schema.Entity(
  'imageGalleryEntries',
  {},
  {
    idAttribute: 'key',
  }
);

export const galleryPictureSchema = new schema.Entity('galleryPictures', {
  comments: [commentSchema],
});
export const gallerySchema = new schema.Entity('galleries');
export const quoteSchema = new schema.Entity('quotes');
export const pollSchema = new schema.Entity('polls');
export const pageSchema = new schema.Entity(
  'pages',
  {},
  {
    idAttribute: 'slug',
  }
);
export const companySemesterSchema = new schema.Entity('companySemesters');
export const companyInterestSchema = new schema.Entity('companyInterest', {
  semesters: [companySemesterSchema],
});
export const companySchema = new schema.Entity('companies', {
  studentContact: userSchema,
  comments: [commentSchema],
});
export const joblistingsSchema = new schema.Entity('joblistings');
export const announcementsSchema = new schema.Entity('announcements');
export const feedActivitySchema = new schema.Entity('feedActivities');
export const oauth2ApplicationSchema = new schema.Entity('oauth2Application');
export const oauth2GrantSchema = new schema.Entity('oauth2Grant');
export const membershipSchema = new schema.Entity('memberships', {
  user: userSchema,
});
export const meetingInvitationSchema = new schema.Entity(
  'meetingInvitations',
  {
    user: userSchema,
  },
  {
    idAttribute: (invite) =>
      getMeetingInvitationId(invite.meeting, invite.user.username),
  }
);
export const meetingSchema = new schema.Entity('meetings', {
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
  'emojis',
  {},
  {
    idAttribute: 'shortCode',
  }
);
export const surveySchema = new schema.Entity('surveys', {
  event: eventSchema,
});
export const surveySubmissionSchema = new schema.Entity('surveySubmissions', {
  user: userSchema,
});
export const tagSchema = new schema.Entity(
  'tags',
  {},
  {
    idAttribute: 'tag',
  }
);
export const followersEventSchema = new schema.Entity(
  followersKeyGen('event'),
  {
    follower: userSchema,
  }
);
export const followersCompanySchema = new schema.Entity(
  followersKeyGen('company'),
  {
    follower: userSchema,
  }
);
export const followersUserSchema = new schema.Entity(followersKeyGen('user'), {
  follower: userSchema,
});
export const lendableObjectSchema = new schema.Entity('lendableObjects', {
  responsibleGroups: [groupSchema],
});
export const lendingRequestSchema = new schema.Entity('lendingRequests', {
  responsibleGroups: [groupSchema],
})
