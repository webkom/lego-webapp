import moment from 'moment';
import { User, Survey } from './api';

// THE TODO TYPE
export type TODO = any;

// As TypeScript does not have support for Opaque types this can be
// used as an approximation. Use: Opaque<'Name', type>
export type Opaque<K, T> = T & { __TYPE__: K };
export type ID = Opaque<'ID', number>;
export type Link = Opaque<'Link', string | null | undefined>;
export type Mail = Opaque<'Mail', string>;

// General Types
export type Dateish = moment.Moment | Date | string;
export type Maybe = null | undefined;
export type ActionGrant = Array<string>;
export type Permissions = Array<string>;
export type SelectInput = { label: string; value: string };
export type EventTimeType = 'activationTime' | 'startTime';
export type EventStatusType = 'NORMAL' | 'OPEN' | 'TBA' | 'INFINITE';
export type Semester = 'spring' | 'autumn';
export type EventType =
  | 'company_presentation'
  | 'lunch_presentation'
  | 'course'
  | 'kid_event'
  | 'party'
  | 'social'
  | 'other'
  | 'event';
export type EventRegistrationPresence = 'PRESENT' | 'NOT_PRESENT' | 'UNKNOWN';
export type EventRegistrationPhotoConsent =
  | 'PHOTO_NOT_CONSENT'
  | 'PHOTO_CONSENT'
  | 'UNKNOWN';
export type EventRegistrationChargeStatus =
  | 'pending'
  | 'manual'
  | 'succeeded'
  | 'failed'
  | 'card_declined';
export type Permission = string;
export type CompanySemesterContactedStatus =
  | 'company_presentation'
  | 'course'
  | 'lunch_presentation'
  | 'interested'
  | 'bedex'
  | 'not_interested'
  | 'contacted'
  | 'not_contacted';
export type Cover = BaseCover | Link;
export type EncodedToken = string;

// General Enumns
export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other'
}
export enum Status {
  Attending = 'ATTENDING',
  NoAnswer = 'NO_ANSWER',
  NotAttending = 'NOT_ATTENDING'
}

// Other Interfaces
export interface UserFollowing {
  id: ID;
  follower: User;
  target: ID;
}

export interface Grade {
  name: string;
}

export interface EventRegistration {
  id: ID;
  user: User;
  adminRegistrationReason: string;
  registrationDate: Dateish;
  unregistrationDate: Dateish;
  pool: number;
  presence: EventRegistrationPresence;
  chargeStatus: EventRegistrationChargeStatus;
  feedback: string;
  sharedMemberships?: number;
  consent: EventRegistrationPhotoConsent;
}

interface EventPoolBase {
  id: ID;
  name: string;
  capacity: number;
  activationDate: Dateish;
}

export interface EventPool extends EventPoolBase {
  registrations?: Array<EventRegistration>;
  registrationCount: number;
  permissionGroups: Array<Object>;
}

/* interface EventTransformPool extends EventPoolBase {
  permissionGroups: Array<SelectInput>;
} */

export interface GroupMembership {
  user: User;
  role: string;
}

/* export interface CreateAnnouncement extends Announcement {
  send: ?boolean
}; */

export interface File {
  id: ID;
  file: Link;
}

export interface Calender {
  name: string;
  description: string;
  path: string;
}

export interface DecodedToken {
  user_id: number;
  username: string;
  exp: number;
  email: string;
  orig_iat: number;
}

export interface Activity {
  activityId: string;
  verb: number;
  time: Dateish;
  extraContext: TODO;
  actor: string;
  object: string;
  target: string;
}

export interface Option {
  id: ID;
  name: string;
  votes: number;
}

interface BaseCover {
  file: string;
  thumbnail: Link;
  id: ID;
}

export interface Workplace {
  id: number;
  town: string;
}

export interface Scopes {
  user: string;
}

export interface Site {
  name: string;
  slogan: string;
  contactEmail: Mail;
  documentationUrl: string;
  domain: Link;
  owner: string;
}

export interface SurveyOption {
  id: number;
  optionText: string;
}

export interface SurveyQuestion {
  id: number;
  questionType: string;
  questionText: string;
  mandatory?: boolean;
  options: Array<SurveyOption>;
  relativeIndex: number;
}

export interface SurveySubmission {
  id: number;
  user: User;
  survey: Survey;
  submitted: boolean;
  submittedTime?: string;
  answers: Array<SurveryAnswer>;
}

export interface SurveryAnswer {
  id: ID;
  submission: SurveySubmission;
  question: SurveyQuestion;
  answerText: string;
  selectedOptions: Array<SurveyOption>;
  hideFromPublic: boolean;
}

export interface GalleryPictureEntity {
  id: ID;
  title: string;
  gallery: number;
  description: string;
  text: string;
  active: boolean;
  comments: Array<Comment>;
  file: File;
  thumbnail: TODO;
  rawFile: TODO;
}

export interface UploadStatus {
  imageCount: number;
  successCount: number;
  failCount: number;
  failedImages: Array<string>;
  lastUploadedImage?: ID;
  showStatus: boolean;
}

export interface Auth {
  id: ID | Maybe;
  username: string | Maybe;
  token: string | Maybe;
  registrationToken: string | Maybe;
  loginFailed: boolean;
  loggingIn: boolean;
  studentConfirmed: boolean | Maybe;
}

export interface UploadStatus {
  imageCount: number;
  successCount: number;
  failCount: number;
  failedImages: Array<string>;
  lastUploadedImage?: ID;
  showStatus: boolean;
}

export interface Company {
  id?: ID;
  name: string;
  companyId?: ID;
  description?: string;
  studentContact?: User | number;
  phone?: string;
  companyType?: string;
  website?: Link;
  address?: string;
  paymentMail?: string;
  active?: boolean;
  adminComment?: string;
  commentTarget: string;
  comments: Array<Comment>;
  semesterStatuses: Array<SemesterStatus>;
  logo?: string;
  files?: Array<File>;
  companyContacts: Array<CompanyContact>;
}

export interface SemesterStatus {
  id?: ID;
  companyId?: ID;
  year: string;
  semester?: number;
  contactedStatus: Array<CompanySemesterContactedStatus>;
  contract?: string;
  contractName?: string;
  statistics?: string;
  statisticsName?: string;
  evaluation?: string;
  evaluationName?: string;
}

export interface CompanyContact {
  id?: ID;
  name: string;
  role?: string;
  mail?: string;
  phone?: string;
  mobile?: string;
}
