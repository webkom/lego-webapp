import React from 'react';

export const statusStrings = {
  0: 'Bedpres',
  1: 'Bedpres & kurs',
  2: 'Kurs',
  3: 'Interessert',
  4: 'Ikke interessert',
  5: 'Kontaktet',
  6: 'Ikke kontaktet'
};

export const selectColorCode = status => {
  const statusToClass = {
    0: 'companyPresentation',
    1: 'companyPresentationAndCourse',
    2: 'course',
    3: 'notOffered',
    4: 'notInterested',
    5: 'contacted',
    6: 'notContacted'
  };
  return statusToClass[status] || 'notContacted';
};

export const indexToSemester = (index, startYear, startSem) => {
  const semester = (index % 2 + startSem) % 2;

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
  <i className="fa fa-check" style={{ color: 'green', fontSize: '25px' }} />
);
export const falseIcon = (
  <i className="fa fa-times" style={{ color: '#d13c32', fontSize: '25px' }} />
);

export const httpCheck = link => {
  const httpLink = link.startsWith('http://') || link.startsWith('https://')
    ? link
    : `http://${link}`;
  return link === '' ? link : httpLink;
};
