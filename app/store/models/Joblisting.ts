import type { Dateish } from 'app/models';
import type { ID } from 'app/store/models/index';

enum JobType {
  FullTime = 'full_time',
  PartTime = 'part_time',
  SummerJob = 'summer_job',
  MasterThesis = 'master_thesis',
  Other = 'other',
}

type JoblistingYear = 1 | 2 | 3 | 4 | 5;

interface Workplace {
  id: ID;
  town: string;
}

interface Joblisting {
  id: ID;
  title: string;
  text: string;
  company: ID;
  responsible: ID;
  contactEmail: string;
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
  | 'text'
  | 'company'
  | 'responsible'
  | 'contactEmail'
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
