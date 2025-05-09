import moment from 'moment';
import { EventTypeConfig, colorForEventType } from '~/pages/events/utils';
import { NonEventContactStatus } from '~/redux/models/Company';
import { EventType } from '~/redux/models/Event';
import type { ConfigProperties } from '../events/utils';
import type { EntityId } from '@reduxjs/toolkit';
import type { Semester } from 'app/models';
import type { CompanySemesterContactStatus } from '~/redux/models/Company';
import type CompanySemester from '~/redux/models/CompanySemester';
import type { PublicUser } from '~/redux/models/User';
import type {
  TransformedAdminCompany,
  TransformedSemesterStatus,
  TransformedStudentCompanyContact,
} from '~/redux/slices/companies';

export const NonEventContactStatusConfig: Record<
  NonEventContactStatus,
  ConfigProperties
> = {
  [NonEventContactStatus.BEDEX]: {
    displayName: 'Bedex',
    color: colorForEventType(EventType.ALTERNATIVE_PRESENTATION),
    textColor: 'var(--color-absolute-white)',
  },
  [NonEventContactStatus.INTERESTED]: {
    displayName: 'Interessert',
    color: 'var(--success-color)',
    textColor: '#000',
  },
  [NonEventContactStatus.NOT_INTERESTED]: {
    displayName: 'Ikke interessert',
    color: 'var(--danger-color)',
    textColor: 'var(--color-absolute-white)',
  },
  [NonEventContactStatus.CONTACTED]: {
    displayName: 'Kontaktet',
    color: 'var(--color-yellow-5)',
    textColor: '#000',
  },
  [NonEventContactStatus.NOT_CONTACTED]: {
    displayName: 'Ikke kontaktet',
    color: 'var(--additive-background)',
    textColor: 'var(--lego-font-color)',
  },
};

export const contactStatuses: CompanySemesterContactStatus[] = [
  EventType.BREAKFAST_TALK,
  EventType.COMPANY_PRESENTATION,
  EventType.COURSE,
  EventType.LUNCH_PRESENTATION,
  ...(Object.keys(NonEventContactStatusConfig) as NonEventContactStatus[]),
];

export const getStatusDisplayName = (
  status: CompanySemesterContactStatus = NonEventContactStatus.NOT_CONTACTED,
) =>
  EventTypeConfig[status]?.displayName ||
  NonEventContactStatusConfig[status]?.displayName;

export const getStatusColor = (
  status: CompanySemesterContactStatus = NonEventContactStatus.NOT_CONTACTED,
) =>
  EventTypeConfig[status]?.color || NonEventContactStatusConfig[status]?.color;

export const getStatusTextColor = (
  status: CompanySemesterContactStatus = NonEventContactStatus.NOT_CONTACTED,
) =>
  EventTypeConfig[status]?.textColor ||
  NonEventContactStatusConfig[status]?.textColor;

export const sortStatusesByProminence = (
  statuses: CompanySemesterContactStatus[],
): CompanySemesterContactStatus[] => {
  // Create a copy of the array before sorting
  return [...statuses].sort((a, b) => {
    return contactStatuses.indexOf(a) - contactStatuses.indexOf(b);
  });
};

export const selectMostProminentStatus = (
  statuses: CompanySemesterContactStatus[] = [],
) => {
  return (
    contactStatuses.find((status) => statuses.includes(status)) ||
    NonEventContactStatus.NOT_CONTACTED
  );
};

export const semesterNameOf = (index: number) => {
  const indexToSemesterName = {
    '0': 'spring',
    '1': 'autumn',
  };
  return indexToSemesterName[index] || 'spring';
};
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
export const sortByYearThenSemester = (
  a: TransformedSemesterStatus,
  b: TransformedSemesterStatus,
): number => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1,
  };
  return a.year !== b.year
    ? b.year - a.year
    : semesterCodeToPriority[b.semester] - semesterCodeToPriority[a.semester];
};

export const getSemesterStatus = (
  company: TransformedAdminCompany,
  companySemester: CompanySemester,
) =>
  company.semesterStatuses.find(
    (semesterStatus) =>
      semesterStatus.year == companySemester.year &&
      semesterStatus.semester == companySemester.semester,
  );

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

export const getContactStatuses = (
  contactStatuses: CompanySemesterContactStatus[],
  statusString: CompanySemesterContactStatus,
) => {
  const statuses = new Set(contactStatuses);

  if (statuses.has(statusString)) {
    statuses.delete(statusString);
  } else {
    statuses.add(statusString);
  }

  // Remove 'not contacted' if anything else is selected
  if (statuses.size > 1 && statuses.has(NonEventContactStatus.NOT_CONTACTED)) {
    statuses.delete(NonEventContactStatus.NOT_CONTACTED);
  }

  // Remove 'contacted', 'not_interested and 'interested'
  // as statuses if any the other statuses are selected
  if (
    statuses.size > 1 &&
    statusString !== NonEventContactStatus.NOT_CONTACTED
  ) {
    [
      NonEventContactStatus.CONTACTED,
      NonEventContactStatus.NOT_INTERESTED,
      NonEventContactStatus.INTERESTED,
    ].forEach((status) => {
      if (status !== statusString) {
        statuses.delete(status);
      }
    });
  }

  return Array.from(statuses);
};
