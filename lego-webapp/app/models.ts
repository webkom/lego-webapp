import type { EntityId } from '@reduxjs/toolkit';
import type { Moment } from 'moment';
import type Comment from '~/redux/models/Comment';
import type { ListCompany } from '~/redux/models/Company';
import type { EventType } from '~/redux/models/Event';
import type { ReactionsGrouped } from '~/redux/models/Reaction';
import type { Presence } from '~/redux/models/Registration';
import type { PublicUser } from '~/redux/models/User';
import type { RoleType } from '~/utils/constants';
// TODO: Id handling could be opaque
export type Dateish = Moment | Date | string;
export type ActionGrant = (
  | 'create'
  | 'edit'
  | 'delete'
  | 'list'
  | 'view'
  | string
)[];
export type IcalToken = string;
export enum EventTime {
  activate = 'activationTime',
  start = 'startTime',
}
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

export type GroupMembership = {
  user: User;
  role: RoleType;
};

export type UserMembership = {
  id: EntityId;
  user: User;
  abakusGroup: EntityId;
  role: RoleType;
  isActive: boolean;
  emailListsEnabled: boolean;
  createdAt: Dateish;
  startDate?: Dateish;
  endDate?: Dateish;
};

type UserPastMembership = UserMembership & {
  abakusGroup: Group;
};

export type PhotoConsent = {
  year: number;
  semester: Semester;
  domain: PhotoConsentDomain;
  isConsenting: boolean | null | undefined;
  updatedAt: Dateish | null | undefined;
};
export type PermissionPerGroup = {
  abakusGroup: Group;
  permissions: string[];
  parentPermissions: PermissionPerGroup[];
};

export type EmailList = {
  id: EntityId;
  users: EntityId[];
  name: string;
  email: string;
  groups: EntityId[];
  groupRoles: string[];
  requireInternalEmailAddress: boolean[];
};

export type User = {
  id: EntityId;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  emailAddress?: string;
  grade: Grade;
  abakusGroups: Group[];
  gender: string;
  allergies: string;
  profilePicture: string;
  profilePicturePlaceholder?: string;
  email?: string;
  phoneNumber?: string;
  photoConsents: Array<PhotoConsent>;

  // UserDetail properties
  pastMemberships?: UserPastMembership[];
  memberships?: UserMembership[];
  abakusEmailLists?: EmailList[];
  permissionsPerGroup?: PermissionPerGroup[];
  isAbakusMember?: boolean;
  githubUsername?: string;
  linkedinId?: string;
};

export enum GroupType {
  Committee = 'komite',
  Board = 'styre',
  Revue = 'revy',
  Interest = 'interesse',
  SubGroup = 'under',
  Ordained = 'ordenen',
  Grade = 'klasse',
  Other = 'annen',
}

/**
 * @deprecated Use a group model from app/store/Group.d.ts instead
 */
export type Group = {
  id: EntityId;
  actionGrant: ActionGrant;
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
  id: EntityId;
  title: string;
  slug: string;
  cover: string;
  coverPlaceholder: string;
  description: string;
  createdAt: Dateish | null | undefined;
  createdBy: User | null | undefined;
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
  tags: string[];
  separateDeadlines: boolean;
  registrationDeadlineHours: number;
  unregistrationDeadline: Dateish;
  unregistrationDeadlineHours: number;
  pinned: boolean;
  youtubeUrl: string;
  legacyRegistrationCount: number;
};

export type Permission = string;

export type LEGACY_EventRegistrationPhotoConsent =
  | 'PHOTO_NOT_CONSENT'
  | 'PHOTO_CONSENT'
  | 'UNKNOWN';
export type EventRegistrationPaymentStatus =
  | 'pending'
  | 'manual'
  | 'succeeded'
  | 'failed'
  | 'card_declined'
  | 'expired_card';
export type EventRegistrationStatus =
  | 'PENDING_REGISTER'
  | 'SUCCESS_REGISTER'
  | 'FAILURE_REGISTER'
  | 'PENDING_UNREGISTER'
  | 'SUCCESS_UNREGISTER'
  | 'FAILURE_UNREGISTER';

export type EventRegistration = {
  id: EntityId;
  user: User;
  createdBy?: User;
  updatedBy?: User;
  adminRegistrationReason: string;
  registrationDate: Dateish;
  unregistrationDate: Dateish;
  status: EventRegistrationStatus;
  pool: number;
  presence: Presence;
  paymentStatus: EventRegistrationPaymentStatus;
  feedback: string;
  sharedMemberships?: number;
  consent: LEGACY_EventRegistrationPhotoConsent;
  clientSecret?: string;
  paymentError?: string;
};

type EventPoolBase = {
  id: EntityId;
  name: string;
  capacity: number;
  activationDate: Dateish;
};

export type EventPool = EventPoolBase & {
  registrations: Array<EventRegistration>;
  registrationCount: number;
  permissionGroups: Array<Record<string, any>>;
};

type ImageGalleryEntry = {
  key: string;
  cover: string;
  token: string;
  coverPlaceholder: string;
};

export type ImageGallery = ImageGalleryEntry[];

export type Event = EventBase & {
  actionGrant: ActionGrant;
  activationTime: Dateish | null | undefined;
  isAdmitted: boolean | null | undefined;
  following: false | EntityId;
  activeCapacity: number;
  eventType: EventType;
  eventStatusType: EventStatusType;
  registrationCount: number;
  waitingRegistrationCount: number;
  totalCapacity: number;
  thumbnail: string | null | undefined;
  company: ListCompany;
  spotsLeft: number;
  comments: Comment[];
  contentTarget: string;
  pools: Array<EventPool>;
  survey: EntityId | undefined;
  userReg: EventRegistration;
  useConsent: boolean;
  unansweredSurveys: Array<EntityId>;
  responsibleGroup: Group;
  price?: number;
  registrationCloseTime?: Dateish | null | undefined;
  unregistrationCloseTime?: Dateish | null | undefined;
  mazemapPoi: number;
  photoConsents?: Array<PhotoConsent>;
  documentType?: 'event';
  responsibleUsers: EntityId[];
  isForeignLanguage: boolean;
  showCompanyDescription: boolean;
};

type EventTransformPool = EventPoolBase & {
  permissionGroups: Array<SelectInput>;
};

export type TransformEvent = EventBase & {
  pools: Array<EventTransformPool>;
  company: SelectInput;
  responsibleGroup: SelectInput;
  eventStatusType: SelectInput;
  eventType: SelectInput;
  mazemapPoi: Record<string, any>;
  useMazemap: boolean;
  hasFeedbackQuestion: boolean;
  responsibleUsers: PublicUser[];
  isForeignLanguage: boolean;
  date: [Dateish, Dateish];
  showCompanyDescription: boolean;
};

export type Workplace = {
  town: string;
};

export type Joblisting = {
  id: EntityId;
  fromYear: number;
  toYear: number;
  workplaces: Array<Workplace>;
};

export type Meeting = {
  id: EntityId;
  createdBy: EntityId;
  title: string;
  location: string;
  startTime: Dateish;
  endTime: Dateish;
  reportAuthor: EntityId | null;
  mazemapPoi: number | null;
  description?: string;
  report?: string;
  invitations: string[];
  comments?: EntityId[];
  contentTarget?: string;
  actionGrant?: ActionGrant;
  reactionsGrouped?: ReactionsGrouped;
};

export type FollowerItem = {
  id: EntityId;
  follower: PublicUser;
  target: EntityId;
};

export type Readme = {
  title: string;
  image: string;
  pdf: string;
  year: number;
  utgave: number;
};

export type EventAdministrate = Omit<Event, 'createdBy' | 'comments'> & {
  createdBy: number;
  comments: number[];
};
