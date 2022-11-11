import type { Dateish } from 'app/models';
import type Company from 'app/store/models/Company';
import type { ID } from 'app/store/models/index';

export default interface CompanyInterest {
  id: ID;
  companyName: string;
  company: Company | null;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: ID[];
  createdAt: Dateish;

  // only in detail view
  events?: string[];
  otherOffers?: string[];
  collaborations?: string[];
  targetGrades?: number[];
  participantRangeStart?: number;
  participantRangeEnd?: number;
  comment?: string;
  courseComment?: string;
  breakfastTalkComment?: string;
  otherEventComment?: string;
}
