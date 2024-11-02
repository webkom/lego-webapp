import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { SearchCompany } from 'app/store/models/Company';

export enum CompanyInterestEventType {
  All = '',
  CompanyPresentation = 'company_presentation',
  Course = 'course',
  BreakfastTalk = 'breakfast_talk',
  LunchPresentation = 'lunch_presentation',
  Bedex = 'bedex',
  DigitalPresentation = 'digital_presentation',
  Other = 'other',
  Sponsor = 'sponsor',
  StartUp = 'start_up',
  CompanyToCompany = 'company_to_company',
}

export interface CompanyInterestEventFullType {
  id: number;
  name: CompanyInterestEventType;
  priority: number;
}

interface CompleteCompanyInterest {
  id: EntityId;
  companyName: string;
  company: SearchCompany | null;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: EntityId[];
  createdAt: Dateish;
  officeInTrondheim: string;
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
  interestEvents: CompanyInterestEventFullType[];
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
  | 'interestEvents'
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
  | 'interestEvents'
>;

export type UnknownCompanyInterest =
  | ListCompanyInterest
  | DetailedCompanyInterest;
