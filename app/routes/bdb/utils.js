import React from 'react';

export const statusStrings = {
  company_presentation: 'Bedpres',
  course: 'Kurs',
  lunch_presentation: 'Lunsjpresentasjon',
  interested: 'Interessert',
  bedex: 'Bedex',
  anniversary: 'Jubileum',
  not_interested: 'Ikke interessert',
  contacted: 'Kontaktet',
  not_contacted: 'Ikke kontaktet',
  other: 'Annet'
};

export const getStatusString = status =>
  statusStrings[status] || (status || 'Ikke kontaktet');

export const selectColorCode = status => {
  const statusToClass = {
    bedex: 'bedex',
    bedpress: 'companyPresentation',
    course: 'course',
    lunch_presentation: 'lunchPresentation',
    anniversary: 'other',
    interested: 'interested',
    not_interested: 'notInterested',
    contacted: 'contacted',
    not_contacted: 'notContacted',
    other: 'other'
  };
  return statusToClass[status] || 'notContacted';
};

export const semesterNameOf = index => {
  const indexToSemesterName = {
    0: 'spring',
    1: 'autumn'
  };
  return indexToSemesterName[index] || 'spring';
};

export const indexToSemester = (index, startYear, startSem) => {
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

  return {
    year,
    semester
  };
};

export const trueIcon = (
  <i
    className="fa fa-check"
    style={{ color: 'green', fontSize: '25px', marginLeft: '5px' }}
  />
);
export const falseIcon = (
  <i
    className="fa fa-times"
    style={{ color: '#d13c32', fontSize: '25px', marginLeft: '5px' }}
  />
);

export const httpCheck = link => {
  const httpLink =
    link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `http://${link}`;
  return link === '' ? link : httpLink;
};
