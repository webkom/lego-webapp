import type Comment from 'app/store/models/Comment';
import type { ListCompany } from 'app/store/models/Company';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { DetailedUser, PublicUser } from 'app/store/models/User';
import type { RoleType } from 'app/utils/constants';
import type { Moment } from 'moment';
// TODO: Id handling could be opaque
export type ID = number;
export type Dateish = Moment | Date | string;
export type ActionGrant = Array<string>;
export type IcalToken = string;
export enum EventTime {
  activate = 'activationTime',
  start = 'startTime',
}
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

export type GroupMembership = {
  user: User;
  role: RoleType;
};

export type UserMembership = {
  id: ID;
  user: User;
  abakusGroup: ID;
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
  id: ID;
  users: ID[];
  name: string;
  email: string;
  groups: ID[];
  groupRoles: string[];
  requireInternalEmailAddress: boolean[];
};

export type User = {
  id: ID;
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
export type Group = {
  id: ID;
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

export type Cover = {
  url: string;
  fileKey: string;
};

type EventBase = {
  id: ID;
  title: string;
  slug: string;
  cover: Cover;
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
  useContactTracing: boolean;
  legacyRegistrationCount: number;
};

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
  id: ID;
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
  following: false | ID;
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
  isUsersUpcoming?: boolean;
  documentType?: 'event';
  responsibleUsers: ID[];
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
  responsibleUsers: DetailedUser[];
};

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

export type Meeting = {
  id: ID;
  createdBy: ID;
  title: string;
  location: string;
  startTime: Dateish;
  endTime: Dateish;
  reportAuthor: ID | null;
  mazemapPoi: number | null;
  description?: string;
  report?: string;
  invitations: string[];
  comments?: ID[];
  contentTarget?: string;
  actionGrant?: ActionGrant;
  reactionsGrouped?: ReactionsGrouped;
};

export type AddPenalty = {
  id: ID;
  user: ID;
  reason: string;
  weight: number;
  sourceEvent: ID;
};

export type FollowerItem = {
  id: ID;
  follower: PublicUser;
  target: ID;
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
