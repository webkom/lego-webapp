// @flow

import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import type { Semester } from 'app/models';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { CompanySemesterContactedStatus } from 'app/models';

export const statusStrings = {
  company_presentation: 'Bedpres',
  course: 'Kurs',
  lunch_presentation: 'Lunsjpresentasjon',
  interested: 'Interessert',
  bedex: 'Bedex',
  not_interested: 'Ikke interessert',
  contacted: 'Kontaktet',
  not_contacted: 'Ikke kontaktet'
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
    lunch_presentation: 'lunchPresentation',
    interested: 'interested',
    not_interested: 'notInterested',
    contacted: 'contacted',
    not_contacted: 'notContacted'
  };

  return statusToClass[status];
};

export const sortStatusesByProminence = (
  a: CompanySemesterContactedStatus,
  b: CompanySemesterContactedStatus
) => {
  const priority = {
    bedex: 0,
    company_presentation: 1,
    course: 2,
    lunch_presentation: 3,
    interested: 4,
    not_interested: 5,
    contacted: 6,
    not_contacted: 7
  };
  console.log(
    'asd',
    priority[a] === undefined ||
      priority[b === undefined && 'asdasdasdasdasdasdasasd']
  );
  return priority[a] - priority[b];
};

export const selectMostProminentStatus = (
  statuses: Array<CompanySemesterContactedStatus> = []
) => {
  return statuses.sort(sortStatusesByProminence)[0];
};

export const semesterNameOf = (index: number) => {
  const indexToSemesterName = {
    '0': 'spring',
    '1': 'autumn'
  };
  return indexToSemesterName[index] || 'spring';
};

export const semesterCodeToName = (code: Semester) => {
  const codeToName = {
    spring: 'Vår',
    autumn: 'Høst'
  };
  return codeToName[code] || '-';
};

export const sortByYearThenSemester = (
  a: CompanySemesterEntity,
  b: CompanySemesterEntity
): number => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1
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
        companySemester =>
          companySemester.year === year && companySemester.semester === semester
      )) || { year, semester }
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
  const statusIsAlreadySelected =
    contactedStatuses.indexOf(statusString) !== -1;

  if (statusIsAlreadySelected) {
    contactedStatuses.splice(contactedStatuses.indexOf(statusString), 1);
  } else {
    contactedStatuses.push(statusString);
  }

  // Remove 'not contacted' if anything else is selected
  if (
    contactedStatuses.length > 1 &&
    contactedStatuses.indexOf('not_contacted') !== -1
  ) {
    contactedStatuses.splice(contactedStatuses.indexOf('not_contacted'), 1);
  }

  // Remove 'contacted', 'not_interested and 'interested'
  // as a statuses if any the other statuses are selected
  ['contacted', 'not_interested', 'interested'].map(status => {
    if (
      contactedStatuses.length > 1 &&
      contactedStatuses.indexOf(status) !== -1 &&
      status !== statusString
    ) {
      contactedStatuses.splice(contactedStatuses.indexOf(status), 1);
    }
  });

  return contactedStatuses;
};

export const ListNavigation = ({ title }: { title: Node }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/companyInterest/">Interesseskjema</NavigationLink>
    <NavigationLink to="/bdb">BDB</NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
  </NavigationTab>
);

export const DetailNavigation = ({
  title,
  companyId,
  deleteFunction
}: {
  title: Node,
  companyId: number,
  deleteFunction: number => Promise<*>
}) => (
  <NavigationTab title={title}>
    <NavigationLink to="/bdb">Tilbake til liste</NavigationLink>
    <NavigationLink to={`/bdb/${companyId}`}>Bedriftens side</NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
    <NavigationLink to={`/bdb/${companyId}/edit`}>Endre</NavigationLink>
    <ConfirmModalWithParent
      title="Slett bedrift"
      message="Er du sikker på at du vil slette denne bedriften?"
      onConfirm={() => deleteFunction(companyId)}
    >
      <div>
        <NavigationLink to="">Slett</NavigationLink>
      </div>
    </ConfirmModalWithParent>
  </NavigationTab>
);
