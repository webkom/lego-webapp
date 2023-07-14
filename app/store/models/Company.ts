import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

export enum CompanyContactedStatus {
  CompanyPresentation = 'company_presentation',
  Course = 'course',
  BreakfastTalk = 'breakfast_talk',
  LunchPresentation = 'lunch_presentation',
  Bedex = 'bedex',
  Interested = 'interested',
  NotInterested = 'not_interested',
  Contacted = 'contacted',
  NotContacted = 'not_contacted',
}

interface CompleteSemesterStatus {
  id: ID;
  semester: ID;
  contactedStatus: CompanyContactedStatus[];
  contract?: string;
  statistics?: string;
  evaluation?: string;
  contractName?: string;
  statisticsName?: string;
  evaluationName?: string;
}

export type SemesterStatus = Pick<
  CompleteSemesterStatus,
  'id' | 'semester' | 'contactedStatus'
>;

export type DetailedSemesterStatus = Pick<
  CompleteSemesterStatus,
  | 'id'
  | 'semester'
  | 'contactedStatus'
  | 'contract'
  | 'statistics'
  | 'evaluation'
  | 'contractName'
  | 'statisticsName'
  | 'evaluationName'
>;

export type AnySemesterStatus = SemesterStatus | DetailedSemesterStatus;

export interface CompanyContact {
  id: ID;
  name: string;
  role?: string;
  mail?: string;
  phone?: string;
  mobile?: string;
}

interface CompanyFile {
  id: ID;
  file: string;
}

interface Company {
  id: ID;
  name: string;
  active: boolean;
  description: string;
  website: string;
  companyType: string;
  logo: string;
  logoPlaceholder: string;
  phone?: string;
  address?: string;
  eventCount?: number;
  joblistingCount?: number;
  thumbnail?: string;
  semesterStatuses?: SemesterStatus[];
  studentContact?: ID | null;
  adminComment?: string;
  paymentMail: string;
  comments: ID[];
  contentTarget: ContentTarget;
  files: CompanyFile[];
  companyContacts: CompanyContact[];
}

export type ListCompany = Pick<
  Company,
  | 'id'
  | 'name'
  | 'description'
  | 'eventCount'
  | 'joblistingCount'
  | 'website'
  | 'companyType'
  | 'address'
  | 'logo'
  | 'logoPlaceholder'
  | 'thumbnail'
  | 'active'
>;

export type AdminListCompany = Pick<
  Company,
  | 'id'
  | 'name'
  | 'semesterStatuses'
  | 'studentContact'
  | 'adminComment'
  | 'active'
>;

export type DetailedCompany = Pick<
  Company,
  | 'id'
  | 'name'
  | 'description'
  | 'phone'
  | 'companyType'
  | 'website'
  | 'address'
  | 'logo'
  | 'logoPlaceholder'
>;

export type SearchCompany = Pick<
  Company,
  'id' | 'name' | 'description' | 'website' | 'companyType' | 'address'
>;

export type AdminDetailCompany = Pick<
  Company,
  | 'id'
  | 'name'
  | 'studentContact'
  | 'description'
  | 'phone'
  | 'companyType'
  | 'website'
  | 'address'
  | 'paymentMail'
  | 'comments'
  | 'contentTarget'
  | 'semesterStatuses'
  | 'active'
  | 'adminComment'
  | 'logo'
  | 'files'
  | 'companyContacts'
>;

export type UnknownCompany = (
  | ListCompany
  | AdminListCompany
  | DetailedCompany
  | SearchCompany
  | AdminDetailCompany
) & {
  comments?: ID[];
};
