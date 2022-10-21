// @flow

import type Moment from 'moment';

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

type SelectInput = { label: string, value: string };

export type EventStatusType = 'NORMAL' | 'OPEN' | 'TBA' | 'INFINITE';

export type Grade = {
  name: string,
};

export type PhotoConsentDomain = 'WEBSITE' | 'SOCIAL_MEDIA';

export type Semester = 'spring' | 'autumn';

export type EventSemester = {
  year: number,
  semester: Semester,
};

export type PhotoConsent = {
  year: number,
  semester: Semester,
  domain: PhotoConsentDomain,
  isConsenting: ?boolean,
  updatedAt: ?Dateish,
};

export type User = {
  id: ID,
  firstName: string,
  fullName: string,
  username: string,
  grade: Grade,
  allergies: string,
  profilePicture: string,
  profilePicturePlaceholder?: string,
  email?: string,
  phoneNumber?: string,
  photoConsents: Array<PhotoConsent>,
};

export type Tags = string;

export const GroupTypeCommittee = 'komite';
export const GroupTypeBoard = 'styre';
export const GroupTypeRevue = 'revy';
export const GroupTypeInterest = 'interesse';
export const GroupTypeSub = 'under';
export const GroupTypeGrade = 'klasse';
export const GroupTypeOther = 'annen';
export const GroupTypes = {
  GroupTypeCommittee,
  GroupTypeBoard,
  GroupTypeInterest,
  GroupTypeSub,
  GroupTypeGrade,
  GroupTypeOther,
};

export type GroupType =
  | typeof GroupTypeCommittee
  | typeof GroupTypeBoard
  | typeof GroupTypeInterest
  | typeof GroupTypeSub
  | typeof GroupTypeGrade
  | typeof GroupTypeOther;

export type GroupMembership = {
  user: User,
  role: string,
};

export type Group = {
  id: ID,
  actionGrant: Array<string>,
  type: GroupType,
  name: string,
  numberOfUsers?: number,
  memberships: Array<GroupMembership>,
  description: string,
  text: string,
  logo: ?string,
  logoPlaceholder?: string,
  showBadge: boolean,
  active: boolean,
  contactEmail: string,
};

type EventBase = {
  id: ID,
  title: string,
  cover: string,
  coverPlaceholder: string,
  description: string,
  createdAt: ?Dateish,
  createdBy: User,
  text: string,
  feedbackDescription: string,
  feedbackRequired: boolean,
  location: string,
  isPriced: boolean,
  isGroupOnly: boolean,
  canViewGroups: Group[],
  heedPenalties: boolean,
  priceMember: number,
  priceGuest: ?number,
  useStripe: boolean,
  paymentDueDate: ?Dateish,
  startTime: Dateish,
  endTime: Dateish,
  mergeTime: ?Dateish,
  useCaptcha: boolean,
  tags: Array<Tags>,
  separateDeadlines: boolean,
  registrationDeadlineHours: number,
  unregistrationDeadline: Dateish,
  unregistrationDeadlineHours: number,
  pinned: boolean,
  youtubeUrl: string,
  useContactTracing: boolean,
  legacyRegistrationCount: number,
};

export type Company = Object;

export type Comment = Object;

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
  id: number,
  user: User,
  createdBy?: User,
  updatedBy?: User,
  adminRegistrationReason: string,
  registrationDate: Dateish,
  unregistrationDate: Dateish,
  status: EventRegistrationStatus,
  pool: number,
  presence: EventRegistrationPresence,
  paymentStatus: EventRegistrationPaymentStatus,
  feedback: string,
  sharedMemberships?: number,
  consent: LEGACY_EventRegistrationPhotoConsent,
  clientSecret?: string,
  paymentError?: string,
};

type EventPoolBase = {
  id: ID,
  name: string,
  capacity: number,
  activationDate: Dateish,
};

export type EventPool = EventPoolBase & {
  registrations?: Array<EventRegistration>,
  registrationCount: number,
  permissionGroups: Array<Object>,
};
export type Event = EventBase & {
  actionGrant: Array<string>,
  activationTime: ?Dateish,
  isAdmitted: ?boolean,
  activeCapacity: number,
  eventType: EventType,
  eventStatusType: EventStatusType,
  registrationCount: number,
  waitingRegistrationCount: number,
  totalCapacity: number,
  thumbnail: ?string,
  company: Company,
  comments: Array<Comment>,
  contentTarget: string,
  pools: Array<EventPool>,
  survey: ?ID,
  userReg: EventRegistration,
  useConsent: boolean,
  unansweredSurveys: Array<ID>,
  responsibleGroup: Group,
  price?: number,
  registrationCloseTime?: ?Dateish,
  unregistrationCloseTime?: ?Dateish,
  mazemapPoi: number,
};

type EventTransformPool = EventPoolBase & {
  permissionGroups: Array<SelectInput>,
};

export type TransformEvent = EventBase & {
  addFee: boolean,
  pools: Array<EventTransformPool>,
  company: SelectInput,
  responsibleGroup: SelectInput,
  eventStatusType: SelectInput,
  eventType: SelectInput,
  mazemapPoi: Object,
  useMazemap: boolean,
  hasFeedbackQuestion: boolean,
};

export type UserFollowing = {
  id: ID,
  follower: User,
  target: ID,
};

export type Article = Object;
export type Feed = Object;
export type FeedItem = Object;

export type Workplace = {
  town: string,
};

export type Joblisting = {
  id: ID,
  fromYear: number,
  toYear: number,
  workplaces: Array<Workplace>,
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
  id: ID,
  message: string,
  users: Array<Object>,
  groups: Array<Object>,
  events: Array<Object>,
  meetings: Array<Object>,
  fromGroup: Group,
  sent?: Dateish,
};

export type CreateAnnouncement = Announcement & {
  send: ?boolean,
};

export type AddPenalty = {
  id: ID,
  user: ID,
  reason: string,
  weight: number,
  sourceEvent: ID,
};

export type LocationType = {
  key: string,
  pathname: string,
  search: string,
  hash: string,
  state: { [any]: boolean },
};

export type FollowerItem = {
  id: ID,
  follower: ID,
  target: ID,
};
