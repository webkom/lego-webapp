import type OAuth2Grant from './OAuth2Grant';
import type { EntityId } from '@reduxjs/toolkit';
import type { UnknownAnnouncement } from '~/redux/models/Announcement';
import type { UnknownArticle } from '~/redux/models/Article';
import type { Comment } from '~/redux/models/Comment';
import type { UnknownCompany } from '~/redux/models/Company';
import type { UnknownCompanyInterest } from '~/redux/models/CompanyInterest';
import type CompanySemester from '~/redux/models/CompanySemester';
import type { UnknownEmailList } from '~/redux/models/EmailList';
import type EmailUser from '~/redux/models/EmailUser';
import type Emoji from '~/redux/models/Emoji';
import type { UnknownEvent } from '~/redux/models/Event';
import type Feed from '~/redux/models/Feed';
import type AggregatedFeedActivity from '~/redux/models/FeedActivity';
import type { UnknownForum, UnknownThread } from '~/redux/models/Forum';
import type { UnknownGallery } from '~/redux/models/Gallery';
import type { UnknownGalleryPicture } from '~/redux/models/GalleryPicture';
import type { UnknownGroup } from '~/redux/models/Group';
import type { ImageGalleryEntry } from '~/redux/models/ImageGalleryEntry';
import type { UnknownJoblisting } from '~/redux/models/Joblisting';
import type { UnknownLendableObject } from '~/redux/models/LendableObject';
import type { UnknownMeeting } from '~/redux/models/Meeting';
import type { MeetingInvitation } from '~/redux/models/MeetingInvitation';
import type Membership from '~/redux/models/Membership';
import type OAuth2Application from '~/redux/models/OAuth2Application';
import type { UnknownPage } from '~/redux/models/Page';
import type { Penalty } from '~/redux/models/Penalty';
import type { Poll } from '~/redux/models/Poll';
import type { UnknownPool } from '~/redux/models/Pool';
import type Quote from '~/redux/models/Quote';
import type Reaction from '~/redux/models/Reaction';
import type { UnknownRegistration } from '~/redux/models/Registration';
import type { UnknownRestrictedMail } from '~/redux/models/RestrictedMail';
import type { UnknownSurvey } from '~/redux/models/Survey';
import type { SurveySubmission } from '~/redux/models/SurveySubmission';
import type { UnknownTag } from '~/redux/models/Tag';
import type { UnknownUser } from '~/redux/models/User';

export enum EntityType {
  Announcements = 'announcements',
  Articles = 'articles',
  Comments = 'comments',
  Companies = 'companies',
  CompanyInterests = 'companyInterest', // Why the fuck is this not plural?
  CompanySemesters = 'companySemesters',
  EmailLists = 'emailLists',
  EmailUsers = 'emailUsers',
  Emojis = 'emojis',
  Events = 'events',
  FeedActivities = 'feedActivities',
  Feeds = 'feeds',
  Forums = 'forums',
  Galleries = 'galleries',
  GalleryPictures = 'galleryPictures',
  Groups = 'groups',
  ImageGalleryEntries = 'imageGalleryEntries',
  Joblistings = 'joblistings',
  LendableObjects = 'lendableObjects',
  MeetingInvitations = 'meetingInvitations',
  Meetings = 'meetings',
  Memberships = 'memberships',
  OAuth2Applications = 'oauth2Applications',
  OAuth2Grants = 'oauth2Grants',
  Pages = 'pages',
  Penalties = 'penalties',
  Polls = 'polls',
  Pools = 'pools',
  Quotes = 'quotes',
  Reactions = 'reactions',
  Registrations = 'registrations',
  RestrictedMails = 'restrictedMails',
  SurveySubmissions = 'surveySubmissions',
  Surveys = 'surveys',
  Tags = 'tags',
  Thread = 'threads',
  Users = 'users',
}

// Most fetch success redux actions are normalized such that payload.entities is a subset of this interface.
export default interface Entities {
  [EntityType.Announcements]: Record<EntityId, UnknownAnnouncement>;
  [EntityType.Articles]: Record<EntityId, UnknownArticle>;
  [EntityType.Comments]: Record<EntityId, Comment>;
  [EntityType.Companies]: Record<EntityId, UnknownCompany>;
  [EntityType.CompanyInterests]: Record<EntityId, UnknownCompanyInterest>;
  [EntityType.CompanySemesters]: Record<EntityId, CompanySemester>;
  [EntityType.EmailLists]: Record<EntityId, UnknownEmailList>;
  [EntityType.EmailUsers]: Record<EntityId, EmailUser>;
  [EntityType.Emojis]: Record<EntityId, Emoji>;
  [EntityType.Events]: Record<EntityId, UnknownEvent>;
  [EntityType.FeedActivities]: Record<EntityId, AggregatedFeedActivity>;
  [EntityType.Feeds]: Record<EntityId, Feed>;
  [EntityType.Forums]: Record<EntityId, UnknownForum>;
  [EntityType.Galleries]: Record<EntityId, UnknownGallery>;
  [EntityType.GalleryPictures]: Record<EntityId, UnknownGalleryPicture>;
  [EntityType.Groups]: Record<EntityId, UnknownGroup>;
  [EntityType.Joblistings]: Record<EntityId, UnknownJoblisting>;
  [EntityType.LendableObjects]: Record<EntityId, UnknownLendableObject>;
  [EntityType.ImageGalleryEntries]: Record<EntityId, ImageGalleryEntry>;
  [EntityType.MeetingInvitations]: Record<EntityId, MeetingInvitation>;
  [EntityType.Meetings]: Record<EntityId, UnknownMeeting>;
  [EntityType.Memberships]: Record<EntityId, Membership>;
  [EntityType.OAuth2Applications]: Record<EntityId, OAuth2Application>;
  [EntityType.OAuth2Grants]: Record<EntityId, OAuth2Grant>;
  [EntityType.Pages]: Record<EntityId, UnknownPage>;
  [EntityType.Penalties]: Record<EntityId, Penalty>;
  [EntityType.Polls]: Record<EntityId, Poll>;
  [EntityType.Pools]: Record<EntityId, UnknownPool>;
  [EntityType.Quotes]: Record<EntityId, Quote>;
  [EntityType.Reactions]: Record<EntityId, Reaction>;
  [EntityType.Registrations]: Record<EntityId, UnknownRegistration>;
  [EntityType.RestrictedMails]: Record<EntityId, UnknownRestrictedMail>;
  [EntityType.SurveySubmissions]: Record<EntityId, SurveySubmission>;
  [EntityType.Surveys]: Record<EntityId, UnknownSurvey>;
  [EntityType.Tags]: Record<EntityId, UnknownTag>;
  [EntityType.Thread]: Record<EntityId, UnknownThread>;
  [EntityType.Users]: Record<EntityId, UnknownUser>;
}

type InferEntityType<T> = {
  [K in keyof Entities]: T extends Entities[K][EntityId] ? K : never;
}[keyof Entities];

export type NormalizedPayloadEntities<T> = Record<
  InferEntityType<T>,
  Record<EntityId, T | undefined>
>;

export interface NormalizedEntityPayload<EntityKeys extends keyof Entities> {
  entities: Pick<Entities, EntityKeys>;
}
