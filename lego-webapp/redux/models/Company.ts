import type { EventType } from './Event';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { AutocompleteContentType } from '~/redux/models/Autocomplete';
import type { ContentTarget } from '~/utils/contentTarget';

export const INTERESTED = 'interested';

export type CompanySemesterStatus = EventType | typeof INTERESTED;

export interface SemesterStatus {
  semester: EntityId;
  statuses: CompanySemesterStatus[];
}

export interface SemesterFiles {
  id: EntityId;
  semester: EntityId;
  contract?: string;
  statistics?: string;
  evaluation?: string;
  contractName?: string;
  statisticsName?: string;
  evaluationName?: string;
}

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
  semesterFiles?: SemesterFiles[];
  studentContacts?: StudentCompanyContact[];
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
>;

export type AdminListCompany = Pick<
  Company,
  'id' | 'name' | 'semesterStatuses' | 'studentContacts'
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
  | 'semesterFiles'
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
