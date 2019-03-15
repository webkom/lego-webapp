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
  | 'lunch_presentation'
  | 'course'
  | 'kid_event'
  | 'party'
  | 'social'
  | 'other'
  | 'event';

type SelectInput = { label: string, value: string };

type EventBase = {
  id: ID,
  title: string,
  cover: string,
  description: string,
  createdAt: ?Dateish,
  text: string,
  feedbackDescription: string,
  feedbackRequired: boolean,
  eventType: EventType,
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
  unregistrationDeadline: Dateish,
  pinned: boolean
};

export type Event = EventBase & {
  actionGrant: Array<string>,
  activationTime: ?Dateish,
  activeCapacity: number,
  registrationCount: number,
  waitingRegistrationCount: number,
  totalCapacity: number,
  thumbnail: ?string,
  company: Company,
  comments: Array<Comment>,
  pools: Array<EventPool>,
  survey: ?ID,
  userReg: EventRegistration,
  useConsent: ?boolean
};

export type TransformEvent = EventBase & {
  addFee: boolean,
  pools: Array<EventTransformPool>,
  company: SelectInput,
  responsibleGroup: SelectInput
};

export type Tags = string;

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
  profilePicture: string
};

export type EventRegistrationPresence = 'PRESENT' | 'NOT_PRESENT' | 'UNKNOWN';

export type EventRegistrationChargeStatus = 'manual' | 'succeeded' | 'failed';

export type EventRegistration = {
  id: number,
  user: User,
  adminRegistrationReason: string,
  registrationDate: Dateish,
  unregistrationDate: Dateish,
  pool: number,
  presence: EventRegistrationPresence,
  chargeStatus: EventRegistrationChargeStatus,
  feedback: string,
  sharedMemberships?: number
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
  showBadge: boolean
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
