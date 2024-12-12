import type { PublicGroup } from './Group';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type { ListCompany } from 'app/store/models/Company';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { ReadRegistration } from 'app/store/models/Registration';
import type { PhotoConsent, PublicUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export enum EventType {
  ALTERNATIVE_PRESENTATION = 'alternative_presentation',
  BREAKFAST_TALK = 'breakfast_talk',
  COMPANY_PRESENTATION = 'company_presentation',
  COURSE = 'course',
  EVENT = 'event',
  NEXUS_EVENT = 'nexus_event',
  LUNCH_PRESENTATION = 'lunch_presentation',
  OTHER = 'other',
  PARTY = 'party',
  SOCIAL = 'social',
}

export enum EventStatusType {
  NORMAL = 'NORMAL',
  OPEN = 'OPEN',
  TBA = 'TBA',
  INFINITE = 'INFINITE',
}

export interface CompleteEvent {
  id: EntityId;
  title: string;
  slug: string;
  description: string;
  cover: string;
  coverPlaceholder: string;
  text: string;
  eventType: EventType;
  eventStatusType: EventStatusType;
  location: string;
  comments: EntityId[];
  contentTarget: ContentTarget;
  startTime: Dateish;
  endTime: Dateish;
  mergeTime?: Dateish;
  thumbnail: string;
  pools: EntityId[];
  totalCapacity?: number;
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
  waitingRegistrations?: EntityId[];
  waitingRegistrationCount?: number;
  tags: string[];
  isMerged: boolean;
  heedPenalties: boolean;
  createdBy?: PublicUser;
  registrationCount?: number;
  legacyRegistrationCount?: number;
  survey?: EntityId;
  useConsent: boolean;
  youtubeUrl: string;
  mazemapPoi?: number;
  pinned: boolean;
  responsibleUsers: PublicUser[];
  isForeignLanguage: boolean;
  unregistered: EntityId[];
  userReg?: ReadRegistration;

  // for survey
  attendedCount: number;

  // user specific
  price: number;
  activationTime: Dateish;
  isAdmitted: boolean;
  following: false | EntityId;
  spotsLeft: number;
  pendingRegistration?: EntityId;
  photoConsents: PhotoConsent[];

  unansweredSurveys: EntityId[];

  actionGrant: ActionGrant;
}

export type PublicEvent = Pick<
  CompleteEvent,
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'eventType'
  | 'eventStatusType'
  | 'location'
  | 'thumbnail'
  | 'actionGrant'
>;

// This corresponds to EventReadSerializer in the backend
export type ListEvent = Pick<
  CompleteEvent,
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
  | 'responsibleUsers'
  | 'actionGrant'
  | 'userReg'
> &
  ObjectPermissionsMixin;

export type DetailedEvent = Pick<
  CompleteEvent,
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
  | 'mazemapPoi'
  | 'activationTime'
  | 'responsibleUsers'
  | 'isForeignLanguage'
  | 'actionGrant'
  | 'isAdmitted'
> &
  ObjectPermissionsMixin;

export type EventForSurvey = Pick<
  CompleteEvent,
  'registrationCount' | 'waitingRegistrationCount' | 'attendedCount'
> &
  ListEvent;

// User specific event serializer that appends data based on request.user
// Used when an authenticated user who CANNOT register is viewing an event
export type UserDetailedEvent = Pick<
  CompleteEvent,
  | 'price'
  | 'activationTime'
  | 'isAdmitted'
  | 'following'
  | 'spotsLeft'
  | 'pendingRegistration'
  | 'photoConsents'
> &
  DetailedEvent;

// Used when an authenticated user who CAN register is viewing an event
export type AuthUserDetailedEvent = Pick<
  CompleteEvent,
  'waitingRegistrations' | 'unansweredSurveys'
> &
  UserDetailedEvent;

// Used in /administrate endpoint
export type AdministrateEvent = Pick<
  CompleteEvent,
  | 'pools'
  | 'unregistered'
  | 'waitingRegistrations'
  | 'useConsent'
  | 'createdBy'
  | 'responsibleGroup'
  | 'feedbackRequired'
> &
  DetailedEvent &
  ListEvent;

export type FrontpageEvent = Pick<
  CompleteEvent,
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
  CompleteEvent,
  | 'id'
  | 'title'
  | 'description'
  | 'text'
  | 'cover'
  | 'location'
  | 'startTime'
  | 'endTime'
>;

export type AutocompleteEvent = Pick<
  CompleteEvent,
  'title' | 'startTime' | 'id'
> & {
  contentType: AutocompleteContentType.Event;
  text: 'text';
};

export type UnknownEvent = (
  | PublicEvent
  | ListEvent
  | DetailedEvent
  | EventForSurvey
  | UserDetailedEvent
  | AuthUserDetailedEvent
  | AdministrateEvent
  | FrontpageEvent
) & {
  comments?: EntityId[];
};
