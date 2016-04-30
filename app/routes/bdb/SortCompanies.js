
const sortByAttribute = (attribute) => (ascending) => (a, b) => {
  if (a[attribute] === b[attribute]) {
    return a.name.localeCompare(b.name);
  } return ascending ? a[attribute].localeCompare(b[attribute]) :
      b[attribute].localeCompare(a[attribute]);
};

const sortByContactStatus = (index, startYear, startSem) => (ascending) => (a, b) => {
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
  const semesterA = a.semesterStatuses.find((obj) =>
    obj.year === year && obj.semester === semester
  ); const statusA = semesterA ? semesterA.contactedStatus : 6;

  const semesterB = b.semesterStatuses.find((obj) =>
    obj.year === year && obj.semester === semester
  ); const statusB = semesterB ? semesterB.contactedStatus : 6;

  if (statusA === statusB) {
    return a.name.localeCompare(b.name);
  }
  if (ascending) {
    return statusA - statusB;
  } return statusB - statusA;
};

const sortCompanies = (companies, query, startYear, startSem) => {
  const sortType = query.sortBy;
  const ascending = query.ascending === 'true';
  const sortTypeToFunction = {
    name: sortByAttribute('name'),
    sem0: sortByContactStatus(0, startYear, startSem),
    sem1: sortByContactStatus(1, startYear, startSem),
    sem2: sortByContactStatus(2, startYear, startSem),
    sem3: sortByContactStatus(3, startYear, startSem),
    studentContact: sortByAttribute('studentContact'),
    comment: sortByAttribute('comment')
  };

  for (const sortTypeName in sortTypeToFunction) {
    if (sortType === sortTypeName) {
      const sortFunction = sortTypeToFunction[sortTypeName](ascending);
      return companies.sort(sortFunction);
    }
  } // Sort by company name by default
  return companies.sort((a, b) => a.name - b.name);
};

export default sortCompanies;
