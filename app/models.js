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
  | 'kid_event'
  | 'party'
  | 'social'
  | 'other'
  | 'event';

type SelectInput = { label: string, value: string };

export type EventStatusType = 'NORMAL' | 'OPEN' | 'TBA' | 'INFINITE';

type EventBase = {
  id: ID,
  title: string,
  cover: string,
  description: string,
  createdAt: ?Dateish,
  createdBy: User,
  text: string,
  feedbackDescription: string,
  feedbackRequired: boolean,
  eventType: EventType,
  eventStatusType: EventStatusType,
  location: string,
  isPriced: boolean,
  isAbakomOnly: boolean,
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
  registrationDeadlineHours: number,
  unregistrationDeadline: Dateish,
  pinned: boolean,
  youtubeUrl: string
};

export type Event = EventBase & {
  actionGrant: Array<string>,
  activationTime: ?Dateish,
  isAdmitted: ?boolean,
  activeCapacity: number,
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
  isUserFollowing: UserFollowing,
  unansweredSurveys: Array<ID>,
  responsibleGroup: Group,
  price?: number
};

export type TransformEvent = EventBase & {
  addFee: boolean,
  pools: Array<EventTransformPool>,
  company: SelectInput,
  responsibleGroup: SelectInput
};

export type Tags = string;

export type UserFollowing = {
  id: ID,
  follower: User,
  target: ID
};

export type Article = Object;
export type Feed = Object;
export type FeedItem = Object;

export type Grade = {
  name: string
};

export type User = {
  id: ID,
  firstName: string,
  fullName: string,
  username: string,
  grade: Grade,
  allergies: string,
  profilePicture: string,
  email?: string
};

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

export type EventRegistration = {
  id: number,
  user: User,
  createdBy?: User,
  updatedBy?: User,
  adminRegistrationReason: string,
  registrationDate: Dateish,
  unregistrationDate: Dateish,
  pool: number,
  presence: EventRegistrationPresence,
  chargeStatus: EventRegistrationChargeStatus,
  feedback: string,
  sharedMemberships?: number,
  consent: EventRegistrationPhotoConsent
};

type EventPoolBase = {
  id: ID,
  name: string,
  capacity: number,
  activationDate: Dateish
};

export type EventPool = EventPoolBase & {
  registrations?: Array<EventRegistration>,
  registrationCount: number,
  permissionGroups: Array<Object>
};

type EventTransformPool = EventPoolBase & {
  permissionGroups: Array<SelectInput>
};

export type Workplace = {
  town: string
};

export type Joblisting = {
  id: ID,
  fromYear: number,
  toYear: number,
  workplaces: Array<Workplace>
};

export type Group = {
  id: ID,
  actionGrant: Array<string>,
  type: string,
  name: string,
  numberOfUsers?: number,
  memberships: Array<GroupMembership>,
  description: string,
  text: string,
  logo: ?string,
  showBadge: boolean,
  contactEmail: string
};

export type GroupMembership = {
  user: User,
  role: string
};

export type Company = Object;

export type Permission = string;

export type Comment = Object;

export type Semester = 'spring' | 'autumn';

export type CompanySemesterContactedStatus =
  | 'company_presentation'
  | 'course'
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
  sent?: boolean
};

export type CreateAnnouncement = Announcement & {
  send: ?boolean
};

export type AddPenalty = {
  id: ID,
  user: ID,
  reason: string,
  weight: number,
  sourceEvent: ID
};

export type LocationType = {
  key: string,
  pathname: string,
  search: string,
  hash: string,
  state: { [any]: boolean }
};
