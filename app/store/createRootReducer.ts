import { combineReducers, type Reducer } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import allowed from 'app/reducers/allowed';
import announcements from 'app/reducers/announcements';
import articles from 'app/reducers/articles';
import auth from 'app/reducers/auth';
import comments from 'app/reducers/comments';
import companies from 'app/reducers/companies';
import companyInterest from 'app/reducers/companyInterest';
import companySemesters from 'app/reducers/companySemesters';
import emailLists from 'app/reducers/emailLists';
import emailUsers from 'app/reducers/emailUsers';
import emojis from 'app/reducers/emojis';
import events from 'app/reducers/events';
import feedActivities from 'app/reducers/feedActivities';
import feeds from 'app/reducers/feeds';
import {
  followersCompany,
  followersEvent,
  followersUser,
} from 'app/reducers/followers';
import form from 'app/reducers/forms';
import frontpage from 'app/reducers/frontpage';
import galleries from 'app/reducers/galleries';
import galleryPictures from 'app/reducers/galleryPictures';
import groups from 'app/reducers/groups';
import imageGallery from 'app/reducers/imageGallery';
import joblistings from 'app/reducers/joblistings';
import meetingInvitations from 'app/reducers/meetingInvitations';
import meetings from 'app/reducers/meetings';
import meetingsToken from 'app/reducers/meetingsToken';
import memberships from 'app/reducers/memberships';
import notificationSettings from 'app/reducers/notificationSettings';
import notificationsFeed from 'app/reducers/notificationsFeed';
import { oauth2Applications, oauth2Grants } from 'app/reducers/oauth2';
import pages from 'app/reducers/pages';
import penalties from 'app/reducers/penalties';
import polls from 'app/reducers/polls';
import pools from 'app/reducers/pools';
import quotes from 'app/reducers/quotes';
import reactions from 'app/reducers/reactions';
import readme from 'app/reducers/readme';
import registrations from 'app/reducers/registrations';
import restrictedMails from 'app/reducers/restrictedMails';
import type { RoutingState } from 'app/reducers/routing';
import routing from 'app/reducers/routing';
import search from 'app/reducers/search';
import surveySubmissions from 'app/reducers/surveySubmissions';
import surveys from 'app/reducers/surveys';
import tags from 'app/reducers/tags';
import toasts from 'app/reducers/toasts';
import users from 'app/reducers/users';
import joinReducers from 'app/utils/joinReducers';
import type { History } from 'history';

const createRootReducer = (history: History) =>
  combineReducers({
    router: joinReducers(
      connectRouter(history) as Reducer<RoutingState>, // typecast as connectRouter state doesn't contain statusCode
      routing
    ),
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
    form,
    frontpage,
    imageGallery,
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
  });

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export default createRootReducer;
