import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import React from 'react';

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

export const getStatusString = status =>
  statusStrings[status] || (status || 'Ikke kontaktet');

export const selectColorCode = status => {
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
  return statusToClass[status] || 'notContacted';
};

export const sortStatusesByProminence = (a, b) => {
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
  return priority[a] - priority[b];
};

export const selectMostProminentStatus = statuses => {
  return statuses.sort(sortStatusesByProminence)[0];
};

export const semesterNameOf = index => {
  const indexToSemesterName = {
    0: 'spring',
    1: 'autumn'
  };
  return indexToSemesterName[index] || 'spring';
};

export const semesterCodeToName = code => {
  const codeToName = {
    spring: 'Vår',
    autumn: 'Høst'
  };
  return codeToName[code] || '-';
};

export const sortByYearThenSemester = (a, b) => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1
  };
  return a.year !== b.year
    ? b.year - a.year
    : semesterCodeToPriority[b.semester] - semesterCodeToPriority[a.semester];
};

export const indexToSemester = (
  index,
  startYear,
  startSem,
  companySemesters
) => {
  const semester = semesterNameOf((index % 2 + startSem) % 2);

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

export const httpCheck = link => {
  const httpLink =
    link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `http://${link}`;
  return link === '' ? link : httpLink;
};

export const getContactedStatuses = (contactedStatuses, statusString) => {
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

export const ListNavigation = ({ title }: { title: string }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/bdb">Liste</NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
  </NavigationTab>
);

export const DetailNavigation = ({
  title,
  companyId
}: {
  title: string,
  companyId: number
}) => (
  <NavigationTab title={title}>
    <NavigationLink to="/bdb">Tilbake til liste</NavigationLink>
    <NavigationLink to={`/bdb/${companyId}`}>Bedriftens side</NavigationLink>
    <NavigationLink to={`/bdb/${companyId}/edit`}>
      Endre bedriften
    </NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
  </NavigationTab>
);
