import type { Dateish } from 'app/models';
import type { SearchCompany } from 'app/store/models/Company';
import type { ID } from 'app/store/models/index';

export enum CompanyInterestEventType {
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

export enum CompanyInterestCompanyType {
  SmallConsultant = 'company_types_small_consultant',
  MediumConsultant = 'company_types_medium_consultant',
  LargeConsultant = 'company_types_large_consultant',
  Inhouse = 'company_types_inhouse',
  Others = 'company_types_others',
  StartUp = 'company_types_start_up',
  Governmental = 'company_types_governmental',
}

interface CompleteCompanyInterest {
  id: ID;
  companyName: string;
  company: SearchCompany | null;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: ID[];
  events: CompanyInterestEventType[];
  otherOffers: string[];
  collaborations: string[];
  companyType: CompanyInterestCompanyType;
  targetGrades: number[];
  participantRangeStart: number;
  participantRangeEnd: number;
  comment: string;
  courseComment: string;
  breakfastTalkComment: string;
  otherEventComment: string;
  startupComment: string;
  companyToCompanyComment: string;
  lunchPresentationComment: string;
  companyPresentationComment: string;
  bedexComment: string;
  companyCourseThemes: string[];
  officeInTrondheim: boolean;
  createdAt: Dateish;
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
  | 'companyType'
  | 'targetGrades'
  | 'participantRangeStart'
  | 'participantRangeEnd'
  | 'comment'
  | 'courseComment'
  | 'breakfastTalkComment'
  | 'otherEventComment'
  | 'startupComment'
  | 'companyToCompanyComment'
  | 'lunchPresentationComment'
  | 'companyPresentationComment'
  | 'bedexComment'
  | 'companyCourseThemes'
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
  | 'events'
  | 'createdAt'
>;

export type UnknownCompanyInterest =
  | ListCompanyInterest
  | DetailedCompanyInterest;
