import type { Moment } from 'moment';
// TODO: Id handling could be opaque
export type ID = number;
export type Dateish = Moment | Date | string;
export type ActionGrant = Array<string>;
export type IcalToken = string;
export type EventTimeType = 'activationTime' | 'startTime';
export type EventType =
  | 'company_presentation'
  | 'alternative_presentation'
  | 'lunch_presentation'
  | 'course'
  | 'breakfast_talk'
  | 'kid_event'
  | 'party'
  | 'social'
  | 'other'
  | 'event';
type SelectInput = {
  label: string;
  value: string;
};
export type EventStatusType = 'NORMAL' | 'OPEN' | 'TBA' | 'INFINITE';
export type Grade = {
  name: string;
};
export enum PhotoConsentDomain {
  WEBSITE = 'WEBSITE',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
}
export type Semester = 'spring' | 'autumn';
export type EventSemester = {
  year: number;
  semester: Semester;
};
export type PhotoConsent = {
  year: number;
  semester: Semester;
  domain: PhotoConsentDomain;
  isConsenting: boolean | null | undefined;
  updatedAt: Dateish | null | undefined;
};
export type User = {
  id: ID;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  emailAddress?: string;
  grade: Grade;
  abakusGroups: number[];
  gender: string;
  allergies: string;
  profilePicture: string;
  profilePicturePlaceholder?: string;
  email?: string;
  phoneNumber?: string;
  photoConsents: Array<PhotoConsent>;
};

export type Penalty = {
  id: ID;
  createdAt: Dateish;
  user: ID;
  reason: string;
  weight: number;
  sourceEvent: ID;
  exactExpiration: Dateish;
};
export type Tags = string;

export enum GroupType {
  Committee = 'komite',
  Board = 'styre',
  Revue = 'revy',
  Interest = 'interesse',
  SubGroup = 'under',
  Grade = 'klasse',
  Other = 'annen',
}
export type GroupMembership = {
  user: User;
  role: string;
};

export type UserMembership = {
  id: ID;
  user: User;
  abakusGroup: ID;
  role: string;
  isActive: boolean;
  emailListsEnabled: boolean;
  createdAt: Dateish;
  startDate?: Dateish;
  endDate?: Dateish;
};
export type Group = {
  id: ID;
  actionGrant: Array<string>;
  type: GroupType;
  name: string;
  numberOfUsers?: number;
  memberships: Array<GroupMembership>;
  description: string;
  text: string;
  logo: string | null | undefined;
  logoPlaceholder?: string;
  showBadge: boolean;
  active: boolean;
  contactEmail: string;
};
type EventBase = {
  id: ID;
  title: string;
  cover: string;
  coverPlaceholder: string;
  description: string;
  createdAt: Dateish | null | undefined;
  createdBy: User;
  text: string;
  feedbackDescription: string;
  feedbackRequired: boolean;
  location: string;
  isPriced: boolean;
  isGroupOnly: boolean;
  canViewGroups: Group[];
  heedPenalties: boolean;
  priceMember: number;
  priceGuest: number | null | undefined;
  useStripe: boolean;
  paymentDueDate: Dateish | null | undefined;
  startTime: Dateish;
  endTime: Dateish;
  mergeTime: Dateish | null | undefined;
  useCaptcha: boolean;
  tags: Array<Tags>;
  separateDeadlines: boolean;
  registrationDeadlineHours: number;
  unregistrationDeadline: Dateish;
  unregistrationDeadlineHours: number;
  pinned: boolean;
  youtubeUrl: string;
  useContactTracing: boolean;
  legacyRegistrationCount: number;
};
export type Company = Record<string, any>;
export type Comment = Record<string, any>;
export type Permission = string;
export type EventRegistrationPresence = 'PRESENT' | 'NOT_PRESENT' | 'UNKNOWN';
export type LEGACY_EventRegistrationPhotoConsent =
  | 'PHOTO_NOT_CONSENT'
  | 'PHOTO_CONSENT'
  | 'UNKNOWN';
export type EventRegistrationPaymentStatus =
  | 'pending'
  | 'manual'
  | 'succeeded'
  | 'failed'
  | 'card_declined';
export type EventRegistrationStatus =
  | 'PENDING_REGISTER'
  | 'SUCCESS_REGISTER'
  | 'FAILURE_REGISTER'
  | 'PENDING_UNREGISTER'
  | 'SUCCESS_UNREGISTER'
  | 'FAILURE_UNREGISTER';
export type EventRegistration = {
  id: number;
  user: User;
  createdBy?: User;
  updatedBy?: User;
  adminRegistrationReason: string;
  registrationDate: Dateish;
  unregistrationDate: Dateish;
  status: EventRegistrationStatus;
  pool: number;
  presence: EventRegistrationPresence;
  paymentStatus: EventRegistrationPaymentStatus;
  feedback: string;
  sharedMemberships?: number;
  consent: LEGACY_EventRegistrationPhotoConsent;
  clientSecret?: string;
  paymentError?: string;
};
type EventPoolBase = {
  id: ID;
  name: string;
  capacity: number;
  activationDate: Dateish;
};
export type EventPool = EventPoolBase & {
  registrations?: Array<EventRegistration>;
  registrationCount: number;
  permissionGroups: Array<Record<string, any>>;
};
export type Event = EventBase & {
  actionGrant: Array<string>;
  activationTime: Dateish | null | undefined;
  isAdmitted: boolean | null | undefined;
  activeCapacity: number;
  eventType: EventType;
  eventStatusType: EventStatusType;
  registrationCount: number;
  waitingRegistrationCount: number;
  totalCapacity: number;
  thumbnail: string | null | undefined;
  company: Company;
  comments: Array<Comment>;
  contentTarget: string;
  pools: Array<EventPool>;
  survey: ID | null | undefined;
  userReg: EventRegistration;
  useConsent: boolean;
  unansweredSurveys: Array<ID>;
  responsibleGroup: Group;
  price?: number;
  registrationCloseTime?: Dateish | null | undefined;
  unregistrationCloseTime?: Dateish | null | undefined;
  mazemapPoi: number;
  photoConsents?: Array<PhotoConsent>;
};
type EventTransformPool = EventPoolBase & {
  permissionGroups: Array<SelectInput>;
};
export type TransformEvent = EventBase & {
  addFee: boolean;
  pools: Array<EventTransformPool>;
  company: SelectInput;
  responsibleGroup: SelectInput;
  eventStatusType: SelectInput;
  eventType: SelectInput;
  mazemapPoi: Record<string, any>;
  useMazemap: boolean;
  hasFeedbackQuestion: boolean;
};
export type UserFollowing = {
  id: ID;
  follower: User;
  target: ID;
};
export type Article = Record<string, any>;
export type Feed = Record<string, any>;
export type FeedItem = Record<string, any>;
export type Workplace = {
  town: string;
};
export type Joblisting = {
  id: ID;
  fromYear: number;
  toYear: number;
  workplaces: Array<Workplace>;
};
export type CompanySemesterContactedStatus =
  | 'company_presentation'
  | 'course'
  | 'breakfast_talk'
  | 'lunch_presentation'
  | 'interested'
  | 'bedex'
  | 'not_interested'
  | 'contacted'
  | 'not_contacted';
export type Announcement = {
  id: ID;
  message: string;
  users: Array<Record<string, any>>;
  groups: Array<Record<string, any>>;
  events: Array<Record<string, any>>;
  meetings: Array<Record<string, any>>;
  fromGroup: Group;
  sent?: Dateish;
};
export type CreateAnnouncement = Announcement & {
  send: boolean | null | undefined;
};
export type AddPenalty = {
  id: ID;
  user: ID;
  reason: string;
  weight: number;
  sourceEvent: ID;
};
export type LocationType = {
  key: string;
  pathname: string;
  search: string;
  hash: string;
  state: { [key in any]?: boolean };
};
export type FollowerItem = {
  id: ID;
  follower: ID;
  target: ID;
};
