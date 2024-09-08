import type { PublicGroup } from './Group';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type { ListCompany } from 'app/store/models/Company';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { DetailedUser, PublicUser } from 'app/store/models/User';
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

interface Event {
  id: EntityId;
  title: string;
  slug: string;
  description: string;
  cover: string;
  coverPlaceholder: string;
  text: string;
  eventType: EventType;
  eventStatusType: string;
  location: string;
  comments: EntityId[];
  contentTarget: ContentTarget;
  startTime: Dateish;
  endTime: Dateish;
  mergeTime?: Dateish;
  thumbnail: string;
  pools: EntityId[];
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
  survey?: EntityId;
  useConsent: boolean;
  youtubeUrl: string;
  mazemapPoi?: number;
  pinned: boolean;
  responsibleUsers: DetailedUser[];
  isForeignLanguage: boolean;

  // for survey
  attendedCount: number;

  // user specific
  price: number;
  activationTime: Dateish;
  isAdmitted: boolean;
  following: false | EntityId;
  spotsLeft: number;
  pendingRegistration: EntityId;
  photoConsents: EntityId[];

  unansweredSurveys: EntityId[];
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
  | 'responsibleUsers'
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
  | 'mazemapPoi'
  | 'activationTime'
  | 'responsibleUsers'
  | 'isForeignLanguage'
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

export type AutocompleteEvent = Pick<Event, 'title' | 'startTime' | 'id'> & {
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
