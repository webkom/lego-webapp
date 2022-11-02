import type { Schema } from "normalizr";
import { schema } from "normalizr";
import type { Reducer } from "app/types";
import "app/types";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import routing from "./routing";
import allowed from "./allowed";
import form from "./forms";
import companies from "./companies";
import companySemesters from "./companySemesters";
import emailLists from "./emailLists";
import quotes from "./quotes";
import galleryPictures from "./galleryPictures";
import events from "./events";
import articles from "./articles";
import pools from "./pools";
import registrations from "./registrations";
import meetingsToken from "./meetingsToken";
import restrictedMails from "./restrictedMails";
import meetings from "./meetings";
import meetingInvitations, { getMeetingInvitationId } from "./meetingInvitations";
import memberships from "./memberships";
import search from "./search";
import auth from "./auth";
import users from "./users";
import penalties from "./penalties";
import emailUsers from "./emailUsers";
import groups from "./groups";
import { oauth2Applications, oauth2Grants } from "./oauth2";
import toasts from "./toasts";
import notificationsFeed from "./notificationsFeed";
import notificationSettings from "./notificationSettings";
import galleries from "./galleries";
import comments from "./comments";
import pages from "./pages";
import polls from "./polls";
import companyInterest from "./companyInterest";
import joblistings from "./joblistings";
import announcements from "./announcements";
import feedActivities from "./feedActivities";
import feeds from "./feeds";
import frontpage from "./frontpage";
import surveys from "./surveys";
import emojis from "./emojis";
import reactions from "./reactions";
import readme from "./readme";
import surveySubmissions from "./surveySubmissions";
import tags from "./tags";
import fetchHistory from "./fetchHistory";
import joinReducers from "app/utils/joinReducers";
import { followersEvent, followersCompany, followersUser, followersKeyGen } from "./followers";
import type { LocationType } from "app/models";
import "app/models";
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
  followersEvent
};
export type Reducers = typeof reducers;
type History = {
  length: Number;
  action: string;
  location: LocationType;
  createHref: (location: LocationType) => string;
  push: (path: string, state: Record<string, any>) => void;
  replace: (path: string, state: Record<string, any>) => void;
  go: (n: Number) => void;
  goBack: () => void;
  block: (prompt?: boolean) => () => void;
  listen: (listener: () => void) => () => void;
};
export default function rootReducer(history: History): Reducer {
  return combineReducers({
    router: joinReducers(connectRouter(history), routing),
    ...reducers
  });
}
export const restrictedMailSchema = ((new schema.Entity('restrictedMails') as Schema) as Schema);
export const groupSchema = (new schema.Entity('groups') as Schema);
export const penaltySchema = (new schema.Entity('penalties', {}) as Schema);
export const userSchema = (new schema.Entity('users', {
  abakusGroups: [groupSchema],
  penalties: [penaltySchema]
}) as Schema);
export const emailUserSchema = (new schema.Entity('emailUsers', {
  user: userSchema
}) as Schema);
export const emailListSchema = (new schema.Entity('emailLists', {
  users: [userSchema],
  groups: [groupSchema]
}) as Schema);
export const registrationSchema = (new schema.Entity('registrations', {
  user: userSchema
}) as Schema);
export const poolSchema = (new schema.Entity('pools', {
  registrations: [registrationSchema]
}) as Schema);
export const commentSchema = (new schema.Entity('comments') as Schema);
export const eventSchema = (new schema.Entity('events', {
  pools: [poolSchema],
  comments: [commentSchema],
  waitingRegistrations: [registrationSchema],
  pendingRegistration: registrationSchema
}) as Schema);
export const eventAdministrateSchema = (new schema.Entity('events', {
  pools: [poolSchema],
  unregistered: [registrationSchema],
  waitingRegistrations: [registrationSchema]
}) as Schema);
export const reactionSchema = (new schema.Entity('reactions') as Schema);
export const articleSchema = (new schema.Entity('articles', {
  comments: [commentSchema],
  reactions: [reactionSchema],
  author: userSchema
}) as Schema);
export const galleryPictureSchema = (new schema.Entity('galleryPictures', {
  comments: [commentSchema]
}) as Schema);
export const gallerySchema = (new schema.Entity('galleries') as Schema);
export const quoteSchema = (new schema.Entity('quotes') as Schema);
export const pollSchema = (new schema.Entity('polls') as Schema);
export const pageSchema = (new schema.Entity('pages', {}, {
  idAttribute: 'slug'
}) as Schema);
export const companySemesterSchema = (new schema.Entity('companySemesters') as Schema);
export const companyInterestSchema = (new schema.Entity('companyInterest', {
  semesters: [companySemesterSchema]
}) as Schema);
export const companySchema = (new schema.Entity('companies', {
  studentContact: userSchema,
  comments: [commentSchema]
}) as Schema);
export const joblistingsSchema = (new schema.Entity('joblistings') as Schema);
export const announcementsSchema = (new schema.Entity('announcements') as Schema);
export const feedActivitySchema = (new schema.Entity('feedActivities') as Schema);
export const oauth2ApplicationSchema = (new schema.Entity('oauth2Application') as Schema);
export const oauth2GrantSchema = (new schema.Entity('oauth2Grant') as Schema);
export const membershipSchema = (new schema.Entity('memberships', {
  user: userSchema
}) as Schema);
export const meetingInvitationSchema = (new schema.Entity('meetingInvitations', {
  user: userSchema
}, {
  idAttribute: invite => getMeetingInvitationId(invite.meeting, invite.user.username)
}) as Schema);
export const meetingSchema = (new schema.Entity('meetings', {
  invitations: [meetingInvitationSchema],
  reportAuthor: userSchema,
  createdBy: userSchema,
  comments: [commentSchema]
}) as Schema);
export const frontpageSchema = (new schema.Entity('frontpage', {
  events: [eventSchema],
  articles: [articleSchema],
  poll: pollSchema
}) as Schema);
export const emojiSchema = (new schema.Entity('emojis', {}, {
  idAttribute: 'shortCode'
}) as Schema);
export const surveySchema = (new schema.Entity('surveys', {
  event: eventSchema
}) as Schema);
export const surveySubmissionSchema = (new schema.Entity('surveySubmissions', {
  user: userSchema
}) as Schema);
export const tagSchema = (new schema.Entity('tags', {}, {
  idAttribute: 'tag'
}) as Schema);
export const followersEventSchema = (new schema.Entity(followersKeyGen('event'), {
  follower: userSchema
}) as Schema);
export const followersCompanySchema = (new schema.Entity(followersKeyGen('company'), {
  follower: userSchema
}) as Schema);
export const followersUserSchema = (new schema.Entity(followersKeyGen('user'), {
  follower: userSchema
}) as Schema);