import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type Company from 'app/store/models/Company';

interface CompleteCompanyInterest {
  id: EntityId;
  companyName: string;
  company: Company | null;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: EntityId[];
  createdAt: Dateish;
  officeInTrondheim: string;
  events: string[];
  companyCourseThemes: string[];
  otherOffers: string[];
  collaborations: string[];
  targetGrades: number[];
  participantRangeStart: number;
  participantRangeEnd: number;
  comment: string;
  courseComment: string;
  breakfastTalkComment: string;
  otherEventComment: string;
  startupComment: string;
  lunchPresentationComment: string;
  bedexComment: string;
  companyToCompanyComment: string;
  companyPresentationComment: string;
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
  | 'companyCourseThemes'
  | 'otherOffers'
  | 'collaborations'
  | 'targetGrades'
  | 'participantRangeStart'
  | 'participantRangeEnd'
  | 'comment'
  | 'courseComment'
  | 'breakfastTalkComment'
  | 'otherEventComment'
  | 'startupComment'
  | 'lunchPresentationComment'
  | 'bedexComment'
  | 'companyToCompanyComment'
  | 'companyPresentationComment'
  | 'officeInTrondheim'
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
