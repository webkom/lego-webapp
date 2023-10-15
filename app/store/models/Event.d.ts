import type { Dateish, Cover } from 'app/models';
import type { ID } from 'app/store/models';
import type { ListCompany } from 'app/store/models/Company';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { PublicUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import type { PublicGroup } from './Group';

export enum EventType {
  CompanyPresentation = 'company_presentation',
  LunchPresentation = 'lunch_presentation',
  AlternativePresentation = 'alternative_presentation',
  Course = 'course',
  BreakfastTalk = 'breakfast_talk',
  KidEvent = 'kid_event',
  Party = 'party',
  Social = 'social',
  Other = 'other',
  Event = 'event',
}

interface Event {
  id: ID;
  title: string;
  slug: string;
  description: string;
  cover: Cover;
  coverPlaceholder: string;
  text: string;
  eventType: EventType;
  eventStatusType: string;
  location: string;
  comments: ID[];
  contentTarget: ContentTarget;
  startTime: Dateish;
  endTime: Dateish;
  mergeTime?: Dateish;
  thumbnail: string;
  pools: ID[];
  totalCapacity: number;
  registrationCloseTime?: Dateish;
  registrationDeadlineHours?: number;
  unregistrationCloseTime?: Dateish;
  unregistrationDeadline?: Dateish;
  unregistrationDeadlineHours?: number;
  company?: ListCompany;
  responsibleGroup?: PublicGroup;
  activeCapacity?: number;
  feedbackDescription: string;
  feedbackRequired: boolean;
  isPriced: boolean;
  priceMember: number;
  priceGuest?: number;
  useStripe: boolean;
  paymentDueDate?: Dateish;
  useCaptcha: boolean;
  waitingRegistrationCount?: number;
  tags: string[];
  isMerged: boolean;
  heedPenalties: boolean;
  createdBy?: PublicUser;
  registrationCount: number;
  legacyRegistrationCount: number;
  survey?: ID;
  useConsent: boolean;
  youtubeUrl: string;
  useContactTracing: boolean;
  mazemapPoi?: number;
  pinned: boolean;

  // for survey
  attendedCount: number;

  // user specific
  price: number;
  activationTime: Dateish;
  isAdmitted: boolean;
  following: false | ID;
  spotsLeft: number;
  pendingRegistration: ID;
  photoConsents: ID[];

  unansweredSurveys: ID[];
}

export type PublicEvent = Pick<
  Event,
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'eventType'
  | 'eventStatusType'
  | 'location'
  | 'thumbnail'
>;

// This corresponds to EventReadSerializer in the backend
export type ListEvent = Pick<
  Event,
  | 'id'
  | 'title'
  | 'slug'
  | 'description'
  | 'cover'
  | 'coverPlaceholder'
  | 'eventType'
  | 'eventStatusType'
  | 'location'
  | 'startTime'
  | 'endTime'
  | 'thumbnail'
  | 'totalCapacity'
  | 'company'
  | 'registrationCount'
  | 'tags'
  | 'activationTime'
  | 'isAdmitted'
  | 'survey'
> &
  ObjectPermissionsMixin;

export type DetailedEvent = Pick<
  Event,
  | 'id'
  | 'title'
  | 'slug'
  | 'description'
  | 'cover'
  | 'coverPlaceholder'
  | 'text'
  | 'eventType'
  | 'eventStatusType'
  | 'location'
  | 'comments'
  | 'contentTarget'
  | 'startTime'
  | 'endTime'
  | 'mergeTime'
  | 'pools'
  | 'registrationCloseTime'
  | 'registrationDeadlineHours'
  | 'unregistrationCloseTime'
  | 'unregistrationDeadline'
  | 'unregistrationDeadlineHours'
  | 'company'
  | 'responsibleGroup'
  | 'activeCapacity'
  | 'feedbackDescription'
  | 'feedbackRequired'
  | 'isPriced'
  | 'priceMember'
  | 'priceGuest'
  | 'useStripe'
  | 'paymentDueDate'
  | 'useCaptcha'
  | 'waitingRegistrationCount'
  | 'tags'
  | 'isMerged'
  | 'heedPenalties'
  | 'createdBy'
  | 'registrationCount'
  | 'legacyRegistrationCount'
  | 'survey'
  | 'useConsent'
  | 'youtubeUrl'
  | 'useContactTracing'
  | 'mazemapPoi'
  | 'activationTime'
> &
  ObjectPermissionsMixin;

export type EventForSurvey = Pick<
  Event,
  'registrationCount' | 'waitingRegistrationCount' | 'attendedCount'
> &
  ListEvent;

// User specific event serializer that appends data based on request.user
export type UserDetailedEvent = Pick<
  Event,
  | 'price'
  | 'activationTime'
  | 'isAdmitted'
  | 'following'
  | 'spotsLeft'
  | 'pendingRegistration'
  | 'photoConsents'
> &
  DetailedEvent;

export type AuthUserDetailedEvent = Pick<
  Event,
  'waitingRegistrations' | 'unansweredSurveys'
> &
  UserDetailedEvent;

export type AdministrateEvent = Pick<
  Event,
  | 'pools'
  | 'unregistered'
  | 'waitingRegistrations'
  | 'useConsent'
  | 'useContactTracing'
  | 'createdBy'
  | 'responsibleGroup'
  | 'feedbackRequired'
> &
  DetailedEvent &
  ListEvent;

export type FrontpageEvent = Pick<
  Event,
  | 'id'
  | 'title'
  | 'description'
  | 'cover'
  | 'coverPlaceholder'
  | 'text'
  | 'eventType'
  | 'eventStatusType'
  | 'location'
  | 'startTime'
  | 'thumbnail'
  | 'endTime'
  | 'totalCapacity'
  | 'company'
  | 'registrationCount'
  | 'tags'
  | 'activationTime'
  | 'isAdmitted'
  | 'pinned'
>;

export type SearchEvent = Pick<
  Event,
  | 'id'
  | 'title'
  | 'description'
  | 'text'
  | 'cover'
  | 'location'
  | 'startTime'
  | 'endTime'
>;

export type UnknownEvent =
  | PublicEvent
  | ListEvent
  | DetailedEvent
  | EventForSurvey
  | UserDetailedEvent
  | AuthUserDetailedEvent
  | AdministrateEvent
  | FrontpageEvent
  | SearchEvent;
