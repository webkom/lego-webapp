import type { EventType } from './Event';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import { PublicUser } from './User';

export enum NonEventContactStatus {
  BEDEX = 'bedex',
  INTERESTED = 'interested',
  NOT_INTERESTED = 'not_interested',
  CONTACTED = 'contacted',
  NOT_CONTACTED = 'not_contacted',
}

export type CompanySemesterContactStatus =
  | EventType.BREAKFAST_TALK
  | EventType.COMPANY_PRESENTATION
  | EventType.COURSE
  | EventType.LUNCH_PRESENTATION
  | NonEventContactStatus;

interface CompleteSemesterStatus {
  id: EntityId;
  semester: EntityId;
  contactedStatus: CompanySemesterContactStatus[];
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
  id: EntityId;
  name: string;
  role?: string;
  mail?: string;
  phone?: string;
  mobile?: string;
  updatedAt?: Dateish;
}

interface CompanyFile {
  id: EntityId;
  file: string;
}

export interface StudentCompanyContact {
  id: EntityId;
  company: EntityId;
  semester: EntityId;
  user: EntityId;
}

interface Company {
  id: EntityId;
  name: string;
  active: boolean;
  description?: string;
  website?: string;
  companyType?: string;
  logo?: string;
  logoPlaceholder?: string;
  phone?: string;
  address?: string;
  eventCount?: number;
  joblistingCount?: number;
  thumbnail?: string;
  semesterStatuses?: SemesterStatus[];
  studentContacts?: StudentCompanyContact[];
  adminComment?: string;
  paymentMail: string;
  comments: EntityId[];
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
  | 'studentContacts'
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

export type AutocompleteCompany = Pick<
  Company,
  'name' | 'description' | 'id'
> & {
  contentType: AutocompleteContentType.Company;
  text: 'text';
};

export type AdminDetailCompany = Pick<
  Company,
  | 'id'
  | 'name'
  | 'studentContacts'
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
  | 'logoPlaceholder'
>;

export type UnknownCompany = (
  | ListCompany
  | AdminListCompany
  | DetailedCompany
  | SearchCompany
  | AdminDetailCompany
) & { comments?: EntityId[] };
