// @flow

import moment from 'moment';

// TODO: Id handling could be opaque
export type ID = number;

export type Dateish = moment | Date | string;

export type ActionGrant = Array<string>;

export type GalleryPictureDto = {
  description?: string,
  active?: boolean,
  file?: string
};

export type GalleryPicture = {
  id: ID,
  description: string,
  active: boolean,
  file: string
};

export type Photo = GalleryPicture;

export type Gallery = Object;

type EventType =
  | 'company_presentation'
  | 'lunch_presentation'
  | 'course'
  | 'kid_event'
  | 'party'
  | 'social'
  | 'other';

export type Event = {
  id: ID,
  title: string,
  description: string,
  eventType: EventType,
  registrationCount: number,
  totalCapacity: number,
  startTime: Dateish,
  activationTime: ?Dateish,
  cover: string,
  thumbnail: string,
  location: string
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
  allergies: string
};

export type EventRegistrationPresence = 'PRESENT' | 'NOT_PRESENT' | 'UNKNOWN';

export type EventRegistrationChargeStatus = 'manual' | 'succeeded' | 'failed';

export type EventRegistration = {
  id: number,
  user: User,
  registrationDate: Dateish,
  unregistrationDate: Dateish,
  presence: EventRegistrationPresence,
  chargeStatus: EventRegistrationChargeStatus,
  feedback: string
};

export type EventPool = Object;

export type Workplace = {
  town: string
};

export type Joblisting = {
  id: ID,
  fromYear: number,
  toYear: number,
  workplaces: Array<Workplace>
};

export type InterestGroup = {
  id: ID,
  name: string,
  memberships: Array<GroupMembership>,
  description: string,
  text: string,
  logo: ?string
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
