import { connectRouter } from 'connected-react-router';
import { schema } from 'normalizr';
import { combineReducers } from 'redux';
import type { Reducer } from 'app/types';
import joinReducers from 'app/utils/joinReducers';
import allowed from './allowed';
import announcements from './announcements';
import articles from './articles';
import auth from './auth';
import comments from './comments';
import companies from './companies';
import companyInterest from './companyInterest';
import companySemesters from './companySemesters';
import emailLists from './emailLists';
import emailUsers from './emailUsers';
import emojis from './emojis';
import events from './events';
import feedActivities from './feedActivities';
import feeds from './feeds';
import fetchHistory from './fetchHistory';
import {
  followersEvent,
  followersCompany,
  followersUser,
  followersKeyGen,
} from './followers';
import form from './forms';
import frontpage from './frontpage';
import galleries from './galleries';
import galleryPictures from './galleryPictures';
import groups from './groups';
import joblistings from './joblistings';
import meetingInvitations, {
  getMeetingInvitationId,
} from './meetingInvitations';
import meetings from './meetings';
import meetingsToken from './meetingsToken';
import memberships from './memberships';
import notificationSettings from './notificationSettings';
import notificationsFeed from './notificationsFeed';
import { oauth2Applications, oauth2Grants } from './oauth2';
import pages from './pages';
import penalties from './penalties';
import polls from './polls';
import pools from './pools';
import quotes from './quotes';
import reactions from './reactions';
import readme from './readme';
import registrations from './registrations';
import restrictedMails from './restrictedMails';
import routing from './routing';
import search from './search';
import surveySubmissions from './surveySubmissions';
import surveys from './surveys';
import tags from './tags';
import toasts from './toasts';
import users from './users';
import type { History } from 'history';
import type { Schema } from 'normalizr';

const reducers = {
  allowed,
  announcements,
  articles,
  auth,
  comments,
  companies,
  companyInterest,
  companySemesters,
  emailLists,
  emailUsers,
  events,
  feedActivities,
  feeds,
  fetchHistory,
  form,
  frontpage,
  galleries,
  galleryPictures,
  groups,
  joblistings,
  meetingInvitations,
  meetings,
  meetingsToken,
  memberships,
  notificationSettings,
  notificationsFeed,
  oauth2Applications,
  oauth2Grants,
  pages,
  penalties,
  polls,
  pools,
  quotes,
  readme,
  registrations,
  restrictedMails,
  search,
  emojis,
  reactions,
  surveySubmissions,
  surveys,
  tags,
  toasts,
  users,
  followersCompany,
  followersUser,
  followersEvent,
};
export type Reducers = typeof reducers;

export default function rootReducer(history: History): Reducer {
  return combineReducers({
    router: joinReducers(connectRouter(history), routing),
    ...reducers,
  });
}
export const restrictedMailSchema = new schema.Entity(
  'restrictedMails'
) as Schema as Schema;
export const groupSchema = new schema.Entity('groups') as Schema;
export const penaltySchema = new schema.Entity('penalties', {}) as Schema;
export const userSchema = new schema.Entity('users', {
  abakusGroups: [groupSchema],
  penalties: [penaltySchema],
}) as Schema;
export const emailUserSchema = new schema.Entity('emailUsers', {
  user: userSchema,
}) as Schema;
export const emailListSchema = new schema.Entity('emailLists', {
  users: [userSchema],
  groups: [groupSchema],
}) as Schema;
export const registrationSchema = new schema.Entity('registrations', {
  user: userSchema,
}) as Schema;
export const poolSchema = new schema.Entity('pools', {
  registrations: [registrationSchema],
}) as Schema;
export const commentSchema = new schema.Entity('comments') as Schema;
export const eventSchema = new schema.Entity('events', {
  pools: [poolSchema],
  comments: [commentSchema],
  waitingRegistrations: [registrationSchema],
  pendingRegistration: registrationSchema,
}) as Schema;
export const eventAdministrateSchema = new schema.Entity('events', {
  pools: [poolSchema],
  unregistered: [registrationSchema],
  waitingRegistrations: [registrationSchema],
}) as Schema;
export const reactionSchema = new schema.Entity('reactions') as Schema;
export const articleSchema = new schema.Entity('articles', {
  comments: [commentSchema],
  reactions: [reactionSchema],
  author: userSchema,
}) as Schema;
export const galleryPictureSchema = new schema.Entity('galleryPictures', {
  comments: [commentSchema],
}) as Schema;
export const gallerySchema = new schema.Entity('galleries') as Schema;
export const quoteSchema = new schema.Entity('quotes') as Schema;
export const pollSchema = new schema.Entity('polls') as Schema;
export const pageSchema = new schema.Entity(
  'pages',
  {},
  {
    idAttribute: 'slug',
  }
) as Schema;
export const companySemesterSchema = new schema.Entity(
  'companySemesters'
) as Schema;
export const companyInterestSchema = new schema.Entity('companyInterest', {
  semesters: [companySemesterSchema],
}) as Schema;
export const companySchema = new schema.Entity('companies', {
  studentContact: userSchema,
  comments: [commentSchema],
}) as Schema;
export const joblistingsSchema = new schema.Entity('joblistings') as Schema;
export const announcementsSchema = new schema.Entity('announcements') as Schema;
export const feedActivitySchema = new schema.Entity('feedActivities') as Schema;
export const oauth2ApplicationSchema = new schema.Entity(
  'oauth2Application'
) as Schema;
export const oauth2GrantSchema = new schema.Entity('oauth2Grant') as Schema;
export const membershipSchema = new schema.Entity('memberships', {
  user: userSchema,
}) as Schema;
export const meetingInvitationSchema = new schema.Entity(
  'meetingInvitations',
  {
    user: userSchema,
  },
  {
    idAttribute: (invite) =>
      getMeetingInvitationId(invite.meeting, invite.user.username),
  }
) as Schema;
export const meetingSchema = new schema.Entity('meetings', {
  invitations: [meetingInvitationSchema],
  reportAuthor: userSchema,
  createdBy: userSchema,
  comments: [commentSchema],
}) as Schema;
export const frontpageSchema = new schema.Entity('frontpage', {
  events: [eventSchema],
  articles: [articleSchema],
  poll: pollSchema,
}) as Schema;
export const emojiSchema = new schema.Entity(
  'emojis',
  {},
  {
    idAttribute: 'shortCode',
  }
) as Schema;
export const surveySchema = new schema.Entity('surveys', {
  event: eventSchema,
}) as Schema;
export const surveySubmissionSchema = new schema.Entity('surveySubmissions', {
  user: userSchema,
}) as Schema;
export const tagSchema = new schema.Entity(
  'tags',
  {},
  {
    idAttribute: 'tag',
  }
) as Schema;
export const followersEventSchema = new schema.Entity(
  followersKeyGen('event'),
  {
    follower: userSchema,
  }
) as Schema;
export const followersCompanySchema = new schema.Entity(
  followersKeyGen('company'),
  {
    follower: userSchema,
  }
) as Schema;
export const followersUserSchema = new schema.Entity(followersKeyGen('user'), {
  follower: userSchema,
}) as Schema;
