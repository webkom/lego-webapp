import type { Dateish } from 'app/models';
import type Company from 'app/store/models/Company';
import type { ID } from 'app/store/models/index';

interface CompleteCompanyInterest {
  id: ID;
  companyName: string;
  company: Company | null;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: ID[];
  createdAt: Dateish;

  events: string[];
  otherOffers: string[];
  collaborations: string[];
  targetGrades: number[];
  participantRangeStart: number;
  participantRangeEnd: number;
  comment: string;
  courseComment: string;
  breakfastTalkComment: string;
  otherEventComment: string;
}

export type DetailedCompanyInterest = Pick<
  CompleteCompanyInterest,
  | 'id'
  | 'companyName'
  | 'company'
  | 'contactPerson'
  | 'mail'
  | 'phone'
  | 'semesters'
  | 'events'
  | 'otherOffers'
  | 'collaborations'
  | 'targetGrades'
  | 'participantRangeStart'
  | 'participantRangeEnd'
  | 'comment'
  | 'courseComment'
  | 'breakfastTalkComment'
  | 'otherEventComment'
>;

export type ListCompanyInterest = Pick<
  CompleteCompanyInterest,
  | 'id'
  | 'companyName'
  | 'company'
  | 'contactPerson'
  | 'mail'
  | 'phone'
  | 'semesters'
  | 'createdAt'
>;

export type UnknownCompanyInterest =
  | ListCompanyInterest
  | DetailedCompanyInterest;
