import type { EventType } from './store/models/Event';
import type {
  EventRegistrationPaymentStatus,
  EventRegistrationStatus,
  LEGACY_EventRegistrationPhotoConsent,
  Presence,
} from './store/models/Registration';
import type { EntityId } from '@reduxjs/toolkit';
import type Comment from 'app/store/models/Comment';
import type { ListCompany } from 'app/store/models/Company';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { PhotoConsent } from 'app/store/models/User';
import type { RoleType } from 'app/utils/constants';
import type { Moment } from 'moment';

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
export type EventStatusType = 'NORMAL' | 'OPEN' | 'TBA' | 'INFINITE';
export type Grade = {
  name: string;
};
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

export type Tags = string;

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
  tags: Array<Tags>;
  separateDeadlines: boolean;
  registrationDeadlineHours: number;
  unregistrationDeadline: Dateish;
  unregistrationDeadlineHours: number;
  pinned: boolean;
  youtubeUrl: string;
  legacyRegistrationCount: number;
};

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

export type Readme = {
  title: string;
  image: string;
  pdf: string;
  year: number;
  utgave: number;
};
