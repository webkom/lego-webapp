import type OAuth2Grant from './OAuth2Grant';
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
import type { Survey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';
import type { UnknownTag } from 'app/store/models/Tag';
import type { UnknownUser } from 'app/store/models/User';
import type { ID } from 'app/store/models/index';

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
  [EntityType.Announcements]: Record<ID, UnknownAnnouncement>;
  [EntityType.Articles]: Record<ID, UnknownArticle>;
  [EntityType.Comments]: Record<ID, Comment>;
  [EntityType.Companies]: Record<ID, UnknownCompany>;
  [EntityType.CompanyInterests]: Record<ID, UnknownCompanyInterest>;
  [EntityType.CompanySemesters]: Record<ID, CompanySemester>;
  [EntityType.EmailLists]: Record<ID, UnknownEmailList>;
  [EntityType.EmailUsers]: Record<ID, EmailUser>;
  [EntityType.Emojis]: Record<ID, Emoji>;
  [EntityType.Events]: Record<ID, UnknownEvent>;
  [EntityType.FeedActivities]: Record<ID, AggregatedFeedActivity>;
  [EntityType.Feeds]: Record<ID, Feed>;
  [EntityType.Forums]: Record<ID, UnknownForum>;
  [EntityType.Galleries]: Record<ID, UnknownGallery>;
  [EntityType.GalleryPictures]: Record<ID, UnknownGalleryPicture>;
  [EntityType.Groups]: Record<ID, UnknownGroup>;
  [EntityType.Joblistings]: Record<ID, UnknownJoblisting>;
  [EntityType.MeetingInvitations]: Record<ID, MeetingInvitation>;
  [EntityType.Meetings]: Record<ID, UnknownMeeting>;
  [EntityType.Memberships]: Record<ID, Membership>;
  [EntityType.OAuth2Applications]: Record<ID, OAuth2Application>;
  [EntityType.OAuth2Grants]: Record<ID, OAuth2Grant>;
  [EntityType.Pages]: Record<ID, UnknownPage>;
  [EntityType.Penalties]: Record<ID, Penalty>;
  [EntityType.Polls]: Record<ID, Poll>;
  [EntityType.Pools]: Record<ID, UnknownPool>;
  [EntityType.Quotes]: Record<ID, Quote>;
  [EntityType.Reactions]: Record<ID, Reaction>;
  [EntityType.Registrations]: Record<ID, UnknownRegistration>;
  [EntityType.RestrictedMails]: Record<ID, UnknownRestrictedMail>;
  [EntityType.SurveySubmissions]: Record<ID, SurveySubmission>;
  [EntityType.Surveys]: Record<ID, Survey>;
  [EntityType.Tags]: Record<ID, UnknownTag>;
  [EntityType.Thread]: Record<ID, UnknownThread>;
  [EntityType.Users]: Record<ID, UnknownUser>;
}

type InferEntityType<T> = {
  [K in keyof Entities]: T extends Entities[K][ID] ? K : never;
}[keyof Entities];

export type NormalizedPayloadEntities<T> = Record<
  InferEntityType<T>,
  Record<ID, T | undefined>
>;

export interface NormalizedEntityPayload<EntityKeys extends keyof Entities> {
  entities: Pick<Entities, EntityKeys>;
}
