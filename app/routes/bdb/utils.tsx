import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { EventTypeConfig, colorForEventType } from 'app/routes/events/utils';
import { NonEventContactStatus } from 'app/store/models/Company';
import { EventType } from 'app/store/models/Event';
import type { ConfigProperties } from '../events/utils';
import type { Semester } from 'app/models';
import type { TransformedSemesterStatus } from 'app/reducers/companies';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';
import type CompanySemester from 'app/store/models/CompanySemester';

export const NonEventContactStatusConfig: Record<
  NonEventContactStatus,
  ConfigProperties
> = {
  [NonEventContactStatus.BEDEX]: {
    displayName: 'Bedex',
    color: colorForEventType(EventType.ALTERNATIVE_PRESENTATION),
    textColor: '#000',
  },
  [NonEventContactStatus.INTERESTED]: {
    displayName: 'Interessert',
    color: 'var(--success-color)',
    textColor: '#000',
  },
  [NonEventContactStatus.NOT_INTERESTED]: {
    displayName: 'Ikke interessert',
    color: 'var(--danger-color)',
    textColor: '#ff0000',
  },
  [NonEventContactStatus.CONTACTED]: {
    displayName: 'Kontaktet',
    color: 'var(--color-yellow-5)',
    textColor: '#000',
  },
  [NonEventContactStatus.NOT_CONTACTED]: {
    displayName: 'Ikke kontaktet',
    color: 'var(--additive-background)',
    textColor: '#000',
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

export const indexToYearAndSemester = (
  index: number,
  startYear: number,
  startSem: number,
) => {
  const semester = semesterNameOf(((index % 2) + startSem) % 2);
  let year = 0;

  if (startSem === 0) {
    year = index < 2 ? startYear : startYear + 1;
  } else if (index === 0) {
    year = startYear;
  } else if (index === 3) {
    year = startYear + 2;
  } else {
    year = startYear + 1;
  }

  return {
    year,
    semester,
  };
};
export const indexToCompanySemester = (
  index: number,
  startYear: number,
  startSem: number,
  companySemesters: CompanySemester[],
) => {
  const { year, semester } = indexToYearAndSemester(index, startYear, startSem);

  return companySemesters.find(
    (companySemester) =>
      companySemester.year === year && companySemester.semester === semester,
  );
};

export const httpCheck = (link: string) => {
  const httpLink =
    link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `http://${link}`;
  return link === '' ? link : httpLink;
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

export const BdbTabs = () => (
  <>
    <NavigationTab href="/companyInterest">Interesseskjema</NavigationTab>
    <NavigationTab href="/bdb">BDB</NavigationTab>
  </>
);
