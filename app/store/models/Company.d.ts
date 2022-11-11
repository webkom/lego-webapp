import type { ID } from 'app/store/models/index';
import { ContentTarget } from 'app/store/utils/contentTarget';

export interface SemesterStatus {
  id: ID;
  semester: ID;
  contactedStatus: string[]; // TODO: Enum
}

interface File {
  id: ID;
  file: string;
}

export interface CompanyContact {
  id: ID;
  name: string;
  role?: string;
  mail?: string;
  phone?: string;
  mobile?: string;
}

export default interface Company {
  id: ID;
  name: string;
  active: boolean;

  // not in bdb list
  description: string;
  website: string;
  companyType: string;
  logo: string;
  logoPlaceholder: string;

  // only in detail/bdb-detail view
  phone?: string;
  address?: string;

  // only in list view
  eventCount?: number;
  joblistingCount?: number;
  thumbnail?: string;

  // only in bdb
  semesterStatuses?: SemesterStatus[];
  studentContact?: ID | null;
  adminComment?: string;

  // only in bdb detail
  paymentMail: string;
  comments: ID[];
  contentTarget: ContentTarget;
  files: File[];
  companyContacts: CompanyContact[];
}

// Not sure what the best way to do this is
// Here are some types I made to separate the different types of data we get from different endpoints

// interface BaseCompany {
//   id: ID;
//   name: string;
//   active: boolean;
// }
//
// export interface BdbListCompany extends BaseCompany {
//   semesterStatuses: SemesterStatus[];
//   studentContact: ID | null;
//   adminComment: string;
// }
//
// interface CompanyWithDetails extends BaseCompany {
//   description: string;
//   website: string;
//   companyType: string;
//   logo: string;
//   logoPlaceholder: string;
// }
//
// export interface BdbCompanyDetail extends BdbListCompany, CompanyWithDetails {
//   paymentMail: string;
//   comments: ID[];
//   contentTarget: ContentTarget;
//   files: File[];
//   companyContacts: CompanyContact[];
//   phone: string;
//   address: string;
// }
//
// export interface ListCompany extends CompanyWithDetails {
//   eventCount: number;
//   joblistingCount: number;
//   thumbnail: string;
// }
//
// export interface CompanyDetail extends CompanyWithDetails {
//   phone: string;
//   address: string;
// }
//
// type Company = BdbListCompany | BdbCompanyDetail | ListCompany | CompanyDetail;
