import moment from 'moment';
import { EventTypeConfig } from '~/pages/events/utils';
import { INTERESTED, JOB_POSTING } from '~/redux/models/Company';
import type { ConfigProperties } from '../events/utils';
import type { EntityId } from '@reduxjs/toolkit';
import type { Semester } from 'app/models';
import type { CompanySemesterStatus } from '~/redux/models/Company';
import type CompanySemester from '~/redux/models/CompanySemester';
import type { PublicUser } from '~/redux/models/User';
import type { TransformedStudentCompanyContact } from '~/redux/slices/companies';

export const SemesterStatusConfig: Record<
  CompanySemesterStatus,
  ConfigProperties
> = {
  ...EventTypeConfig,
  [JOB_POSTING]: {
    displayName: 'Jobbannonse',
    color: '#F28C8C',
    textColor: '#000',
  },
  [INTERESTED]: {
    displayName: 'Interessert',
    color: 'var(--success-color)',
    textColor: '#000',
  },
};

export const semesterStatuses = (
  Object.keys(SemesterStatusConfig) as CompanySemesterStatus[]
).filter((s) => !['event', 'gala', 'interest_event'].includes(s));

export const semesterToHumanReadable = (semester: Semester, year: number) => {
  const semesterName = semesterCodeToName(semester);
  return `${year} ${semesterName}`;
};
export const semesterCodeToName = (code: Semester) => {
  const codeToName = {
    spring: 'Vår',
    autumn: 'Høst',
  };
  return codeToName[code] || '-';
};
export type GroupedStudentContactsBySemester = {
  id: EntityId;
  semester: CompanySemester;
  users: PublicUser[];
};

export const groupStudentContactsBySemester = (
  studentContacts: TransformedStudentCompanyContact[],
): GroupedStudentContactsBySemester[] => {
  const studentContactsInSemester: Record<EntityId, PublicUser[]> = {};
  const semestersById: Record<EntityId, CompanySemester> = Object.fromEntries(
    studentContacts.map((studentContact) => [
      studentContact.semester.id,
      studentContact.semester,
    ]),
  );

  for (const studentContact of studentContacts) {
    const { semester, user } = studentContact;
    const semesterId = semester.id;

    if (!studentContactsInSemester[semesterId]) {
      studentContactsInSemester[semesterId] = [];
    }

    studentContactsInSemester[semesterId].push(user);
  }

  return Object.keys(studentContactsInSemester).map((semesterId) => ({
    id: semesterId,
    semester: semestersById[semesterId],
    users: studentContactsInSemester[semesterId],
  }));
};

export const getCompanySemesterBySlug = (
  slug: string,
  companySemesters: CompanySemester[],
) => {
  const parts = /^(\d+)(h|v)$/.exec(slug);
  if (!parts) {
    return undefined;
  }

  const year = parseInt(parts[1]);
  const season: Semester = parts[2] === 'h' ? 'autumn' : 'spring';

  return companySemesters.find(
    (companySemester) =>
      companySemester.semester === season && companySemester.year === year,
  );
};

export const getSemesterSlugById = (
  id: EntityId,
  companySemesters: CompanySemester[],
) => {
  const semester = companySemesters.find((semester) => semester.id === id);
  if (!semester) {
    return undefined;
  }
  return `${semester.year}${semester.semester === 'autumn' ? 'h' : 'v'}`;
};

export const getSemesterSlugOffset = (
  id: EntityId,
  companySemesters: CompanySemester[],
  offset: 'previous' | 'next',
) => {
  return getSemesterSlugById(
    companySemesters.find(
      (semester) =>
        semester.id === (id as number) + (offset === 'previous' ? -1 : 1),
    )?.id as number,
    companySemesters,
  );
};

export const httpCheck = (link: string) => {
  const httpLink =
    link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `http://${link}`;
  return link === '' ? link : httpLink;
};

export const getClosestCompanySemester = (
  companySemesters: CompanySemester[],
) => {
  let closestSemesterIndex: number | undefined = undefined;
  let closestSemesterDateDiff: number = Number.MAX_SAFE_INTEGER;

  const currentTerm = moment().month() < 6 ? 0 : 1;
  const currentYear = moment().year() + currentTerm * 0.5;

  for (let i = 0; i < companySemesters.length; i++) {
    const companySemester = companySemesters[i];

    const year =
      companySemester.year + (companySemester.semester === 'autumn' ? 0.5 : 0);
    const semesterDateDiff = Math.abs(currentYear - year);

    if (
      closestSemesterIndex === undefined ||
      semesterDateDiff < closestSemesterDateDiff
    ) {
      closestSemesterIndex = i;
      closestSemesterDateDiff = semesterDateDiff;
    }
  }

  if (closestSemesterIndex === undefined) return undefined;

  return companySemesters[closestSemesterIndex];
};
