
export const selectColorCode = (status) => {
  const statusToClass = {
    0: 'bedpres',
    1: 'bedpresKurs',
    2: 'kurs',
    3: 'notOffered',
    4: 'notInterested',
    5: 'contacted',
    6: 'notContacted'
  };
  return statusToClass[status] || 'notContacted';
};

export const statusIntToString = (status) => {
  const statusStrings = {
    0: 'Bedpres',
    1: 'Bedpres & kurs',
    2: 'Kurs',
    3: 'Interessert, ikke tilbudt',
    4: 'Ikke interessert',
    5: 'Kontaktet',
    6: 'Ikke kontaktet'
  };
  return statusStrings[status] || 6;
};

export const indexToSemester = (index, startYear, startSem) => {
  const semester = (index % 2 + startSem) % 2;

  let year = 0;
  if (startSem === 0) {
    year = index < 2 ? startYear : startYear + 1;
  } else {
    if (index === 0) {
      year = startYear;
    } else if (index === 3) {
      year = startYear + 2;
    } else {
      year = startYear + 1;
    }
  }

  return {
    year,
    semester
  };
};
