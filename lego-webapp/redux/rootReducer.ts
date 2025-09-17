import { combineReducers } from '@reduxjs/toolkit';
import allowed from '~/redux/slices/allowed';
import announcements from '~/redux/slices/announcements';
import articles from '~/redux/slices/articles';
import auth from '~/redux/slices/auth';
import banner from '~/redux/slices/banner';
import comments from '~/redux/slices/comments';
import companies from '~/redux/slices/companies';
import companyInterest from '~/redux/slices/companyInterest';
import companySemesters from '~/redux/slices/companySemesters';
import emailLists from '~/redux/slices/emailLists';
import emailUsers from '~/redux/slices/emailUsers';
import emojis from '~/redux/slices/emojis';
import events from '~/redux/slices/events';
import featureFlags from '~/redux/slices/featureFlags';
import feedActivities from '~/redux/slices/feedActivities';
import feeds from '~/redux/slices/feeds';
import forums from '~/redux/slices/forums';
import frontpage from '~/redux/slices/frontpage';
import galleries from '~/redux/slices/galleries';
import galleryPictures from '~/redux/slices/galleryPictures';
import groups from '~/redux/slices/groups';
import imageGalleryEntries from '~/redux/slices/imageGallery';
import joblistings from '~/redux/slices/joblistings';
import lendableObjects from '~/redux/slices/lendableObjects';
import lendingRequests from '~/redux/slices/lendingRequests';
import meetingInvitations from '~/redux/slices/meetingInvitations';
import meetings from '~/redux/slices/meetings';
import memberships from '~/redux/slices/memberships';
import notificationSettings from '~/redux/slices/notificationSettings';
import notificationsFeed from '~/redux/slices/notificationsFeed';
import oauth2Applications from '~/redux/slices/oauth2Applications';
import oauth2Grants from '~/redux/slices/oauth2Grants';
import pages from '~/redux/slices/pages';
import penalties from '~/redux/slices/penalties';
import polls from '~/redux/slices/polls';
import pools from '~/redux/slices/pools';
import quotes from '~/redux/slices/quotes';
import readme from '~/redux/slices/readme';
import registrations from '~/redux/slices/registrations';
import restrictedMails from '~/redux/slices/restrictedMails';
import routing from '~/redux/slices/routing';
import search from '~/redux/slices/search';
import status from '~/redux/slices/status';
import surveySubmissions from '~/redux/slices/surveySubmissions';
import surveys from '~/redux/slices/surveys';
import tags from '~/redux/slices/tags';
import theme from '~/redux/slices/theme';
import threads from '~/redux/slices/threads';
import users from '~/redux/slices/users';

export const createRootReducer = () => {
  return combineReducers({
    router: routing,
    allowed,
    announcements,
    articles,
    auth,
    banner,
    comments,
    companies,
    companyInterest,
    companySemesters,
    emailLists,
    emailUsers,
    events,
    featureFlags,
    feedActivities,
    feeds,
    forums,
    frontpage,
    galleries,
    galleryPictures,
    groups,
    imageGalleryEntries,
    joblistings,
    lendableObjects,
    lendingRequests,
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
    users,
    status,
  });
};

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
