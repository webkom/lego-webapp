import { sortBy } from 'lodash';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import type { Semester, CompanySemesterContactedStatus } from 'app/models';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { ReactNode } from 'react';

export const statusStrings = {
  company_presentation: 'Bedpres',
  course: 'Kurs',
  breakfast_talk: 'Frokostforedrag',
  lunch_presentation: 'Lunsjpresentasjon',
  interested: 'Interessert',
  bedex: 'Bedex',
  not_interested: 'Ikke interessert',
  contacted: 'Kontaktet',
  not_contacted: 'Ikke kontaktet',
};
export const getStatusString = (
  status: CompanySemesterContactedStatus = 'not_contacted'
) => statusStrings[status];
export const selectColorCode = (
  status: CompanySemesterContactedStatus = 'not_contacted'
) => {
  const statusToClass = {
    bedex: 'bedex',
    company_presentation: 'companyPresentation',
    course: 'course',
    breakfast_talk: 'breakfastTalk',
    lunch_presentation: 'lunchPresentation',
    interested: 'interested',
    not_interested: 'notInterested',
    contacted: 'contacted',
    not_contacted: 'notContacted',
  };
  return statusToClass[status];
};
const priority = {
  bedex: 0,
  company_presentation: 1,
  course: 2,
  lunch_presentation: 3,
  breakfast_talk: 4,
  interested: 5,
  not_interested: 6,
  contacted: 7,
  not_contacted: 8,
};
export const sortStatusesByProminence = (
  statuses: Array<CompanySemesterContactedStatus>
): CompanySemesterContactedStatus[] =>
  sortBy(statuses, (status) => priority[status]);
export const selectMostProminentStatus = (
  statuses: Array<CompanySemesterContactedStatus> = []
) => {
  return sortStatusesByProminence(statuses)[0];
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
  a: CompanySemesterEntity,
  b: CompanySemesterEntity
): number => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1,
  };
  return a.year !== b.year
    ? parseInt(b.year, 10) - parseInt(a.year, 10)
    : semesterCodeToPriority[b.semester] - semesterCodeToPriority[a.semester];
};
export const indexToSemester = (
  index: number,
  startYear: number,
  startSem: number,
  companySemesters?: Array<CompanySemesterEntity>
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

  return (
    (companySemesters &&
      companySemesters.find(
        (companySemester) =>
          companySemester.year === year && companySemester.semester === semester
      )) || {
      year,
      semester,
    }
  );
};
export const httpCheck = (link: string) => {
  const httpLink =
    link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `http://${link}`;
  return link === '' ? link : httpLink;
};
export const getContactedStatuses = (
  contactedStatuses: Array<CompanySemesterContactedStatus>,
  statusString: CompanySemesterContactedStatus
) => {
  const contacted: Array<CompanySemesterContactedStatus> =
    contactedStatuses.slice();
  const statusIsAlreadySelected = contacted.indexOf(statusString) !== -1;

  if (statusIsAlreadySelected) {
    contacted.splice(contacted.indexOf(statusString), 1);
  } else {
    contacted.push(statusString);
  }

  // Remove 'not contacted' if anything else is selected
  if (contacted.length > 1 && contacted.indexOf('not_contacted') !== -1) {
    contacted.splice(contacted.indexOf('not_contacted'), 1);
  }

  // Remove 'contacted', 'not_interested and 'interested'
  // as a statuses if any the other statuses are selected
  ['contacted', 'not_interested', 'interested'].forEach((status) => {
    if (
      contacted.length > 1 &&
      contacted.indexOf(status) !== -1 &&
      status !== statusString
    ) {
      contacted.splice(contacted.indexOf(status), 1);
    }
  });
  return contacted;
};
export const ListNavigation = ({ title }: { title: ReactNode }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/companyInterest/">Interesseskjema</NavigationLink>
    <NavigationLink to="/bdb">BDB</NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
  </NavigationTab>
);
export const DetailNavigation = ({
  title,
  companyId,
  deleteFunction,
}: {
  title: ReactNode;
  companyId: number;
  deleteFunction: (arg0: number) => Promise<any>;
}) => (
  <NavigationTab
    title={title}
    back={{
      label: 'Tilbake til liste',
      path: '/bdb',
    }}
  >
    <NavigationLink to={`/bdb/${companyId}`}>Bedriftens side</NavigationLink>
    <NavigationLink to={`/bdb/${companyId}/edit`}>Rediger</NavigationLink>
    <NavigationLink to={'/bdb/add'}>Ny bedrift</NavigationLink>
    <ConfirmModal
      title="Slett bedrift"
      message="Er du sikker på at du vil slette denne bedriften?"
      onConfirm={() => deleteFunction(companyId)}
    >
      {({ openConfirmModal }) => (
        <Button onClick={openConfirmModal} danger>
          <Icon name="trash" size={19} />
          Slett bedrift
        </Button>
      )}
    </ConfirmModal>
  </NavigationTab>
);
