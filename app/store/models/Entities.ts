import type Announcement from 'app/store/models/Announcement';
import type Article from 'app/store/models/Article';
import type Comment from 'app/store/models/Comment';
import type Company from 'app/store/models/Company';
import type CompanyInterest from 'app/store/models/CompanyInterest';
import type CompanySemester from 'app/store/models/CompanySemester';
import type EmailList from 'app/store/models/EmailList';
import type EmailUser from 'app/store/models/EmailUser';
import type Emoji from 'app/store/models/Emoji';
import type Event from 'app/store/models/Event';
import type Feed from 'app/store/models/Feed';
import type FeedActivity from 'app/store/models/FeedActivity';
import type Group from 'app/store/models/Group';
import type Meeting from 'app/store/models/Meeting';
import type Penalty from 'app/store/models/Penalty';
import type Quote from 'app/store/models/Quote';
import type Reaction from 'app/store/models/Reaction';
import type Registration from 'app/store/models/Registration';
import type User from 'app/store/models/User';
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
  Feed = 'feeds',
  FeedActivity = 'feedActivities',
  GalleryPictures = 'galleryPictures',
  Groups = 'groups',
  Meetings = 'meetings',
  Penalties = 'penalties',
  Quotes = 'quotes',
  Reactions = 'reactions',
  Registration = 'registrations',
  Users = 'users',
}

export default interface Entities {
  [EntityType.Announcements]: Record<ID, Announcement>;
  [EntityType.Articles]: Record<ID, Article>;
  [EntityType.Comments]: Record<ID, Comment>;
  [EntityType.Companies]: Record<ID, Company>;
  [EntityType.CompanyInterests]: Record<ID, CompanyInterest>;
  [EntityType.CompanySemesters]: Record<ID, CompanySemester>;
  [EntityType.EmailLists]: Record<ID, EmailList>;
  [EntityType.EmailUsers]: Record<ID, EmailUser>;
  [EntityType.Emojis]: Record<ID, Emoji>;
  [EntityType.Events]: Record<ID, Event>;
  [EntityType.Feed]: Record<ID, Feed>;
  [EntityType.FeedActivity]: Record<ID, FeedActivity>;
  [EntityType.GalleryPictures]: Record<ID, any>;
  [EntityType.Groups]: Record<ID, Group>;
  [EntityType.Meetings]: Record<ID, Meeting>;
  [EntityType.Penalties]: Record<ID, Penalty>;
  [EntityType.Quotes]: Record<ID, Quote>;
  [EntityType.Reactions]: Record<ID, Reaction>;
  [EntityType.Registration]: Record<ID, Registration>;
  [EntityType.Users]: Record<ID, User>;
}

export interface NormalizedEntityPayload<EntityKeys extends keyof Entities> {
  entities: Pick<Entities, EntityKeys>;
}
