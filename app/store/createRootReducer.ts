import { combineReducers } from '@reduxjs/toolkit';
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
import forums from 'app/reducers/forums';
import frontpage from 'app/reducers/frontpage';
import galleries from 'app/reducers/galleries';
import galleryPictures from 'app/reducers/galleryPictures';
import groups from 'app/reducers/groups';
import imageGalleryEntries from 'app/reducers/imageGallery';
import joblistings from 'app/reducers/joblistings';
import meetingInvitations from 'app/reducers/meetingInvitations';
import meetings from 'app/reducers/meetings';
import memberships from 'app/reducers/memberships';
import notificationSettings from 'app/reducers/notificationSettings';
import notificationsFeed from 'app/reducers/notificationsFeed';
import { oauth2Applications, oauth2Grants } from 'app/reducers/oauth2';
import pages from 'app/reducers/pages';
import penalties from 'app/reducers/penalties';
import polls from 'app/reducers/polls';
import pools from 'app/reducers/pools';
import quotes from 'app/reducers/quotes';
import readme from 'app/reducers/readme';
import registrations from 'app/reducers/registrations';
import restrictedMails from 'app/reducers/restrictedMails';
import routing from 'app/reducers/routing';
import search from 'app/reducers/search';
import surveySubmissions from 'app/reducers/surveySubmissions';
import surveys from 'app/reducers/surveys';
import tags from 'app/reducers/tags';
import theme from 'app/reducers/theme';
import threads from 'app/reducers/threads';
import toasts from 'app/reducers/toasts';
import users from 'app/reducers/users';

const createRootReducer = () => {
  return combineReducers({
    router: routing,
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
    followersCompany,
    followersEvent,
    followersUser,
    forums,
    frontpage,
    galleries,
    galleryPictures,
    groups,
    imageGalleryEntries,
    joblistings,
    meetingInvitations,
    meetings,
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
    surveySubmissions,
    surveys,
    tags,
    theme,
    threads,
    toasts,
    users,
  });
};

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
export default createRootReducer;
