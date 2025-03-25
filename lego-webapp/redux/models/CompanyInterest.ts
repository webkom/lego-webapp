import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { SearchCompany } from '~/redux/models/Company';

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

interface CompleteCompanyInterest {
  id: EntityId;
  companyName: string;
  company: SearchCompany | null;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: EntityId[];
  createdAt: Dateish;
  officeInTrondheim: boolean;
  wantsThursdayEvent: boolean;
  events: CompanyInterestEventType[];
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
  | 'wantsThursdayEvent'
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
  | 'events'
  | 'createdAt'
>;

export type UnknownCompanyInterest =
  | ListCompanyInterest
  | DetailedCompanyInterest;
