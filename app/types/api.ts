import {
  ID,
  Link,
  Dateish,
  ActionGrant,
  TODO,
  Calender,
  Company,
  Mail,
  EventType,
  EventStatusType,
  Semester,
  Maybe,
  Activity,
  Grade,
  Cover,
  GroupMembership,
  Workplace,
  Permissions,
  Option,
  Gender,
  Scopes,
  Site,
  SurveyOption
} from './utils';

export interface Announcement {
  // https://lego.abakus.no/api/v1/announcements/
  id: ID;
  message: string;
  users: Array<User>;
  groups: Array<Group>;
  events: Array<Event>;
  meetings: Array<Meeting>;
  sent: Dateish;

  // https://lego.abakus.no/api/v1/announcements/xxx
  actionGrant?: ActionGrant;
}

export interface Article {
  // https://lego.abakus.no/api/v1/articles/
  id: ID;
  title: string;
  cover: Cover;
  author: User;
  description: string;
  text: string;
  tags: Array<Tag>;
  createdAt: ID;
  pinned: boolean;

  // https://lego.abakus.no/api/v1/articles/xxx
  comments?: Array<Comment>;
  content?: string;
  commentTarget?: string;
  youtubeUrl?: string;
  canEditUsers?: Array<User>;
  canViewGroups?: Array<User>;
  canEditGroups?: Array<User>;
  requireAuth?: boolean;
  startTime?: string;
  actionGrant?: ActionGrant;
}

export interface Bdb {
  // https://lego.abakus.no/api/v1/bdb/
  id: ID;
  name: string;
  semesterStatuses: TODO;
  studentContact: Array<TODO>; // This is not a normal user
  adminComment: string;
  active: boolean;

  //https://lego.abakus.no/api/v1/bdb/xxx
  phone?: TODO;
  companyType?: string;
  website?: Link;
  address?: string;
  paymentMail?: string;
  comments?: Array<Comment>;
  commentTarget?: string;
  logo?: Link;
  files?: Array<File>;
  companyContacts?: Array<TODO>; // This is not a normal user
  actionGrant?: ActionGrant;
}

export interface Calender {
  // https://lego.abakus.no/api/v1/calendar-ical/
  calenders: Array<Calender>;
  token: IcalToken;
}

export interface IcalToken {
  // https://lego.abakus.no/api/v1/calendar-token/
  token: string;
  created: Dateish;
}

export interface Comment {
  // https://lego.abakus.no/api/v1/comments/
  id: ID;
  createdAt: Dateish;
  children: Array<TODO>;
  text: string | null;
  author: User | null;
  parent?: ID;
}

export interface CompanyInterest {
  // https://lego.abakus.no/api/v1/company-interests/
  id: ID;
  companyName: string;
  contactPerson: string;
  mail: Mail;
  semesters: Array<CompanySemester>;
  createdAt: Dateish;

  // https://lego.abakus.no/api/v1/company-interests/xxx
  events?: Array<EventType>;
  otherOffers?: Array<string>;
  comment?: string;
  actionGrant?: ActionGrant;

  // TODO UNKNOWN TYPES FROM FLOW
  companyPresentation?: boolean;
  course?: boolean;
  itdagene?: boolean;
  lunchPresentation?: boolean;
  readme?: boolean;
  collaboration?: boolean;
}

export interface CompanySemester {
  // https://lego.abakus.no/api/v1/company-semesters/
  id: ID;
  year: number | string;
  semester: Semester;
  activeInterestForm: boolean;
}

// TODO
// https://lego.abakus.no/api/v1/contact-form/
// https://lego.abakus.no/api/v1/device-apns/
// https://lego.abakus.no/api/v1/device-gcm/

export interface EmailList {
  // https://lego.abakus.no/api/v1/email-lists/
  id: ID;
  name: string;
  email: Mail;
  users: TODO; // This is always an empty array when looking at the API
  groups: Array<number> | Array<Group>;
  groupRoles: Array<string>;
  requireInternalAddress: boolean;

  // https://lego.abakus.no/api/v1/email-lists/xxx
  actionGrant?: ActionGrant;
}

export interface EmailUser {
  // https://lego.abakus.no/api/v1/email-users/
  id: ID;
  user: User;
  internalEmail: Mail;
  internalEmailEnabled: boolean;

  // https://lego.abakus.no/api/v1/email-users/xxx
  actionGrant: ActionGrant;
}

export interface Event {
  // https://lego.abakus.no/api/v1/events/
  id: ID;
  title: string;
  description: string;
  cover: Cover;
  eventType: EventType;
  eventStatusType: EventStatusType;
  location: string;
  startTime: Dateish;
  endTime: Dateish;
  thumbnail: Link;
  totalCapacity: number;
  company: Company;
  registrationCount: number;
  tags: Array<Tag>;
  activationTime: Dateish | Maybe;
  isAdmitted: boolean;

  // https://lego.abakus.no/api/v1/events/xxx
  text?: string;
  comments?: Array<Comment>;
  commentTarget?: string;
  mergeTime?: Dateish | Maybe;
  pools?: Array<TODO>;
  registrationCloseTime?: Dateish;
  registrationDeadlineHours?: number;
  unregistrationDeadline?: Dateish;
  responsibleGroup?: Array<Group>;
  activeCapacity?: number;
  feedbackDescription?: string;
  feedbackRequired?: boolean;
  isPriced?: boolean;
  priceMember?: number;
  priceGuest?: number;
  useStripe?: boolean;
  paymentDueDate?: null;
  useCaptcha?: boolean;
  waitingRegistrationCount?: number;
  isMerged?: boolean;
  heedPenalties?: boolean;
  createdBy?: User;
  isAbakomOnly?: boolean;
  survey?: ID | Maybe;
  useConsent?: boolean;
  youtubeUrl?: Link;
  price?: number;
  spotsLeft?: number;
  waitingRegistrations?: Array<User>;
  unansweredSurveys?: Array<ID>;
  actionGrant?: ActionGrant;

  // TODO UNKNOWN TYPES FROM FLOW
  userReg: TODO;
}

/* export interface TransformEvent extends Event {
  addFee: boolean;
  pools: Array<EventTransformPool>;
  company: SelectInput;
  responsibleGroup: SelectInput;
} */

export interface Feed {
  //https://lego.abakus.no/api/v1/feed-notifications/
  id: ID;
  orderingKey: string;
  verb: string;
  createdAt: Dateish;
  updatedAt: Dateish;
  lastActivity: Activity;
  activities: Array<Activity>;
  activityCount: number;
  actorIds: Array<string>;
  read: boolean;
  seen: boolean;
  context: TODO;
}

// TODO
// https://lego.abakus.no/api/v1/files/
// https://lego.abakus.no/api/v1/followers-company/
// https://lego.abakus.no/api/v1/followers-user/
// https://lego.abakus.no/api/v1/followers-event/

export interface FrontPage {
  // https://lego.abakus.no/api/v1/frontpage/
  articles: Array<Article>;
  events: Array<Event>;
  poll: Array<Poll>;
}

export interface Gallery {
  // https://lego.abakus.no/api/v1/galleries/
  id: ID;
  title: string;
  cover: Cover;
  location: string;
  takenAt: Dateish;
  createdAt: Dateish;
  pictureCount: number;

  // https://lego.abakus.no/api/v1/galleries/xxx
  description?: string;
  text?: string;
  actionGrant?: ActionGrant;
  event?: Event | Maybe;
  photographers?: Array<User>;
  publicMetadata?: boolean;
  canEditUsers?: Array<Group>;
  canViewGroups?: Array<Group>;
  canEditGroups?: Array<Group>;
  requireAuth?: boolean;
}

export interface Group {
  // https://lego.abakus.no/api/v1/groups/
  id: ID;
  name: string;
  description: string;
  contactEmail: string;
  parent: TODO;
  logo: string | Maybe;
  type: string;
  showBadge: boolean;
  numberOfUsers: number;

  // https://lego.abakus.no/api/v1/groups/1/
  text?: string;
  permissions?: Permissions;
  actionGrant?: ActionGrant;

  // TODO UNKNOWN TYPES FROM FLOW
  memberships?: Array<GroupMembership>;
}

export interface Joblisting {
  // https://lego.abakus.no/api/v1/joblistings/
  id: ID;
  title: string;
  company: Company;
  deadline: Dateish;
  jobType: string;
  workplaces: Array<Workplace>;
  fromYear: number;
  toYear: number;

  // https://lego.abakus.no/api/v1/joblistings/xxx
  text?: string;
  responsible?: User | Maybe;
  contactMail?: Mail;
  description?: string;
  visibleFrom?: Dateish;
  visibleTo?: Dateish;
  applicationUrl?: Link;
  youtubeUrl?: Link;
  actionGrant?: ActionGrant;
}

// TODO
// https://lego.abakus.no/api/v1/meeting-token/

export interface Meeting {
  // https://lego.abakus.no/api/v1/meetings/
  id: ID;
  title: string;
  location: string;
  startTime: Dateish;
  endTime: Dateish | Maybe;
  report: string;
  reportAuthor: User;
  createdBy: User;

  // https://lego.abakus.no/api/v1/meetings/xxx
  comments?: Array<Comment>;
  invitations?: Array<User>;
  commentTarget?: string;
  actionGrant?: ActionGrant;
}

export interface MembershipHistory {
  // https://lego.abakus.no/api/v1/membership-history/
  id: ID;
  user: User;
  abakusGroup: Group;
  role: string;
  startDate?: Dateish;
  endDate?: Dateish;
}

export interface OAuthAccessToken {
  // https://lego.abakus.no/api/v1/oauth2-access-tokens/
  id: ID;
  user: ID;
  token: string;
  application: OAuthApplication;
  expires: Dateish;
  scopes: Scopes;
}

export interface OAuthApplication {
  // https://lego.abakus.no/api/v1/oauth2-applications/
  id: ID;
  name: string;
  description: string;
  redirectUris: Link;
  clientId: string;
  clientSecret: string;
  user?: User;
}

export interface Page {
  // https://lego.abakus.no/api/v1/pages/
  pk: ID; // TODO PK????????????????????????
  title: string;
  slug: string;
  category: string;

  // TODO UNKNOWN TYPES FROM FLOW
  id: number;
  content: string;
  comments: Array<Comment>;
  picture: Link;
}

// TODO
// https://lego.abakus.no/api/v1/password-change/
// https://lego.abakus.no/api/v1/password-reset-perform/
// https://lego.abakus.no/api/v1/password-reset-request/

export interface Penalty {
  // https://lego.abakus.no/api/v1/penalties/
  id: ID;
  createdAt: Dateish;
  user: User | ID;
  reason: string;
  weight: number;
  sourceEvent: Event | ID;
  exactExpiration: Dateish;
}

export interface Podcast {
  // https://lego.abakus.no/api/v1/podcasts/
  id: ID;
  createdAt: Dateish;
  source: Link;
  title: string;
  discription: string;
  authors: Array<User>;
  thanks: Array<User>;

  //https://lego.abakus.no/api/v1/podcasts/xxx
  actionGrant?: ActionGrant;
}

export interface Poll {
  // https://lego.abakus.no/api/v1/polls/
  id: ID;
  title: string;
  description: string;
  pinned: boolean;
  tags: Array<Tag>;
  hasAnswered: boolean;
  totalVotes: number;
  options: Array<Option>;

  // https://lego.abakus.no/api/v1/polls/xxx
  createdAt?: Dateish;
  validUntil?: Dateish;
  comments?: Array<Comment>;
  commentTarget?: string;
  actionGrant?: ActionGrant;
}

export interface Quote {
  // https://lego.abakus.no/api/v1/quotes/
  id: ID;
  createdAt?: Dateish;
  text: string;
  source: Link;
  approved: boolean;
  tags: Array<Tag>;
  comments: Array<Comment>;
  commentTarget: string;

  //https://lego.abakus.no/api/v1/quotes/321/
  actionGrant?: ActionGrant;

  // TODO UNKNOWN TYPES FROM FLOW
  commentCount?: string;
}

// TODO
// https://lego.abakus.no/api/v1/reaction-types/
// https://lego.abakus.no/api/v1/reactions/

export interface RestrictedMail {
  // https://lego.abakus.no/api/v1/restricted-mail/
  id: ID;
  fromAddress: Mail;
  hideAddress: boolean;
  used: boolean | Maybe;
  createdAt: Dateish;
  weekly: boolean;

  // https://lego.abakus.no/api/v1/restricted-mail/xxx
  users?: Array<User> | Array<ID>;
  groups?: Array<Group> | Array<ID>;
  events?: Array<Event> | Array<ID>;
  meetings?: Array<Meeting> | Array<ID>;
  rawAddresses?: Array<string>;
  actionGrant?: ActionGrant;
}

// TODO
// https://lego.abakus.no/api/v1/search-autocomplete/

export interface SearchResult {
  // https://lego.abakus.no/api/v1/search-search/
  label: string;
  color: string;
  picture: TODO;
  path: TODO;
  value: string;
  link: TODO;
  content: string;
  icon: TODO;
}

export interface SiteMeta {
  // https://lego.abakus.no/api/v1/site-meta/
  site: Site;
  isAllowed: { [key: string]: boolean };
}

export interface SurveyTempalte extends Survey {
  // https://lego.abakus.no/api/v1/survey-templates/
}

export interface Survey {
  // https://lego.abakus.no/api/v1/surveys/
  id: ID;
  title: string;
  event: Event;
  activeFrom?: Dateish;
  questions: Array<SurveyOption>;
  templateType?: EventType;
  token?: TODO;
  results?: Object;
  submissionCount?: number;

  // https://lego.abakus.no/api/v1/surveys/xxx
  actionGrant?: ActionGrant;
}

export interface Tag {
  // https://lego.abakus.no/api/v1/tags/
  tag: string;
  usages: number;
}

export interface User {
  // https://lego.abakus.no/api/v1/users/
  id: ID;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  profilePicture: Link;
  internalEmailAddress: Mail;

  // https://lego.abakus.no/api/v1/users/me/
  grade?: Grade;
  allergies?: string;
  email?: Mail;
  emailListsEnabled?: boolean;
  emailAddress?: Mail;
  isActive?: boolean;
  isStudent?: boolean;
  abakusGroups?: Array<Group>;
  isAbakusMember?: boolean;
  isAbakomMember?: boolean;
  penalties?: Array<Penalty>;
  icalToken?: IcalToken;
  memberships?: Array<TODO>; // Are these the same models as the `Membership-history'
  pastMemberships?: Array<TODO>; // Are these the same models as the `Membership-history'
}

// TODO
// https://lego.abakus.no/api/v1/users-registration-request/
// https://lego.abakus.no/api/v1/users-student-confirmation-perform/
// https://lego.abakus.no/api/v1/users-student-confirmation-request/
// https://lego.abakus.no/api/v1/webhooks-stripe/
