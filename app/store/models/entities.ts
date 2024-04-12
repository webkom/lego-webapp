import type OAuth2Grant from './OAuth2Grant';
import type { EntityId } from '@reduxjs/toolkit';
import type { UnknownAnnouncement } from 'app/store/models/Announcement';
import type { UnknownArticle } from 'app/store/models/Article';
import type Comment from 'app/store/models/Comment';
import type { UnknownCompany } from 'app/store/models/Company';
import type { UnknownCompanyInterest } from 'app/store/models/CompanyInterest';
import type CompanySemester from 'app/store/models/CompanySemester';
import type { UnknownEmailList } from 'app/store/models/EmailList';
import type EmailUser from 'app/store/models/EmailUser';
import type Emoji from 'app/store/models/Emoji';
import type { UnknownEvent } from 'app/store/models/Event';
import type Feed from 'app/store/models/Feed';
import type AggregatedFeedActivity from 'app/store/models/FeedActivity';
import type { UnknownForum, UnknownThread } from 'app/store/models/Forum';
import type { UnknownGallery } from 'app/store/models/Gallery';
import type { UnknownGalleryPicture } from 'app/store/models/GalleryPicture';
import type { UnknownGroup } from 'app/store/models/Group';
import type { UnknownJoblisting } from 'app/store/models/Joblisting';
import type { UnknownMeeting } from 'app/store/models/Meeting';
import type { MeetingInvitation } from 'app/store/models/MeetingInvitation';
import type Membership from 'app/store/models/Membership';
import type OAuth2Application from 'app/store/models/OAuth2Application';
import type { UnknownPage } from 'app/store/models/Page';
import type Penalty from 'app/store/models/Penalty';
import type Poll from 'app/store/models/Poll';
import type { UnknownPool } from 'app/store/models/Pool';
import type Quote from 'app/store/models/Quote';
import type Reaction from 'app/store/models/Reaction';
import type { UnknownRegistration } from 'app/store/models/Registration';
import type { UnknownRestrictedMail } from 'app/store/models/RestrictedMail';
import type { UnknownSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';
import type { UnknownTag } from 'app/store/models/Tag';
import type { UnknownUser } from 'app/store/models/User';

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
  Joblistings = 'joblistings',
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
