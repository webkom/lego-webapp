import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models';
import type Group from 'app/store/models/Group';
import type User from 'app/store/models/User';

export enum EventType {
  CompanyPresentation = 'company_presentation',
  AlternativePresentation = 'alternative_presentation',
  LunchPresentation = 'lunch_presentation',
  Course = 'course',
  BreakfastTalk = 'breakfast_talk',
  KidEvent = 'kid_event',
  Party = 'party',
  Social = 'social',
  Other = 'other',
  Event = 'event',
}

// TODO: Go though and type this properly (it will be alot of work)
export default interface Event {
  id: ID;
  title: string;
  description: string;
  cover: string;
  coverPlaceholder: string;
  eventType: EventType;
  eventStatusType: string;

  createdAt: Dateish;
  createdBy: User;
  text: string;
  feedbackDescription: string;
  feedbackRequired: boolean;
  location: string;
  isPriced: boolean;
  isGroupOnly: boolean;
  canViewGroups: Group[];
  heedPenalties: boolean;
  priceMember: number;
  priceGuest?: number;
  useStripe: boolean;
  paymentDueDate?: Dateish;
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
  useContactTracing: boolean;
  legacyRegistrationCount: number;
  activationTime: Dateish;
  comments: ID[];

  isUsersUpcoming: boolean;
  registrationCount?: number;
  waitingRegistrations?: ID[];
  waitingRegistrationCount?: number;

  loading?: boolean;
}
