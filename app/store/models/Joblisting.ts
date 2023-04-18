import type { Dateish } from 'app/models';
import type { CompanyContact, ListCompany } from 'app/store/models/Company';
import type { ID } from 'app/store/models/index';

enum JobType {
  FullTime = 'full_time',
  PartTime = 'part_time',
  SummerJob = 'summer_job',
  MasterThesis = 'master_thesis',
  Other = 'other',
}

type JoblistingYear = 1 | 2 | 3 | 4 | 5;

export interface Workplace {
  id: ID;
  town: string;
}

interface Joblisting {
  id: ID;
  title: string;
  slug: string;
  text: string;
  company: ListCompany; // TODO: normalize?
  responsible: CompanyContact | null;
  contactMail: string;
  description: string;
  deadline: Dateish;
  jobType: JobType;
  workplaces: Workplace[];
  visibleFrom: Dateish;
  visibleTo: Dateish;
  fromYear: JoblistingYear;
  toYear: JoblistingYear;
  applicationUrl: string;
  youtubeUrl: string;
  createdAt: Dateish;
}

export type ListJoblisting = Pick<
  Joblisting,
  | 'id'
  | 'title'
  | 'slug'
  | 'company'
  | 'deadline'
  | 'jobType'
  | 'workplaces'
  | 'fromYear'
  | 'toYear'
  | 'createdAt'
>;

export type DetailedJoblisting = Pick<
  Joblisting,
  | 'id'
  | 'title'
  | 'slug'
  | 'text'
  | 'company'
  | 'responsible'
  | 'contactMail'
  | 'description'
  | 'deadline'
  | 'jobType'
  | 'workplaces'
  | 'visibleFrom'
  | 'visibleTo'
  | 'fromYear'
  | 'toYear'
  | 'applicationUrl'
  | 'youtubeUrl'
  | 'createdAt'
>;

export type UnknownJoblisting = ListJoblisting | DetailedJoblisting;
