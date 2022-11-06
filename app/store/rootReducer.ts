import { combineReducers } from '@reduxjs/toolkit';
import joinReducers from 'app/utils/joinReducers';
import routerSlice, { RouterState } from 'app/store/slices/routerSlice';
import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import allowed from 'app/store/slices/allowedSlice';
import announcements from 'app/store/slices/announcementsSlice';
import articles from 'app/store/slices/articlesSlice';
import authSlice from 'app/store/slices/authSlice';
import comments from 'app/store/slices/commentsSlice';
import companies from 'app/store/slices/companiesSlice';
import companyInterest from 'app/store/slices/companyInterestSlice';
import companySemesters from 'app/store/slices/companySemestersSlice';
import emailLists from 'app/store/slices/emailListsSlice';
import emailUsers from 'app/store/slices/emailUsersSlice';
import events from 'app/store/slices/eventsSlice';
import feedActivities from 'app/store/slices/feedActivitiesSlice';
import feeds from 'app/store/slices/feedsSlice';
import fetchHistory from 'app/store/slices/fetchHistorySlice';
import form from 'app/store/slices/formsSlice';
import frontpage from 'app/store/slices/frontpageSlice';
import galleries from 'app/store/slices/galleriesSlice';
import galleryPictures from 'app/store/slices/galleryPicturesSlice';
import groups from 'app/store/slices/groupsSlice';
import joblistings from 'app/store/slices/joblistingsSlice';
import meetingInvitations from 'app/store/slices/meetingInvitationsSlice';
import meetings from 'app/store/slices/meetingsSlice';
import meetingsToken from 'app/store/slices/meetingsTokenSlice';
import memberships from 'app/store/slices/membershipsSlice';
import notificationSettings from 'app/store/slices/notificationSettingsSlice';
import notificationsFeed from 'app/store/slices/notificationsFeedSlice';
import { oauth2Applications, oauth2Grants } from 'app/store/slices/oauth2Slice';
import pages from 'app/store/slices/pagesSlice';
import penalties from 'app/store/slices/penaltiesSlice';
import polls from 'app/store/slices/pollsSlice';
import pools from 'app/store/slices/poolsSlice';
import quotes from 'app/store/slices/quotesSlice';
import readme from 'app/store/slices/readmeSlice';
import registrations from 'app/store/slices/registrationsSlice';
import restrictedMails from 'app/store/slices/restrictedMailsSlice';
import search from 'app/store/slices/searchSlice';
import emojis from 'app/store/slices/emojisSlice';
import reactions from 'app/store/slices/reactionsSlice';
import surveySubmissions from 'app/store/slices/surveySubmissionsSlice';
import surveys from 'app/store/slices/surveysSlice';
import tags from 'app/store/slices/tagsSlice';
import toasts from 'app/store/slices/toastsSlice';
import users from 'app/store/slices/usersSlice';
import {
  followersCompany,
  followersEvent,
  followersUser,
} from 'app/store/slices/followersSlice';

const createRootReducer = (history: History) =>
  combineReducers({
    router: joinReducers<RouterState>(connectRouter(history), routerSlice),
    allowed,
    announcements,
    articles,
    auth: authSlice,
    comments,
    companies,
    companyInterest,
    companySemesters,
    emailLists,
    emailUsers,
    events,
    feedActivities,
    feeds,
    fetchHistory: fetchHistory,
    form,
    frontpage,
    galleries,
    galleryPictures,
    groups,
    joblistings,
    meetingInvitations,
    meetings,
    meetingsToken: meetingsToken,
    memberships,
    notificationSettings: notificationSettings,
    notificationsFeed: notificationsFeed,
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
