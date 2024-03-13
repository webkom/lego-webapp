import {
  selectMostProminentStatus,
  indexToSemester,
  contactStatuses,
} from './utils';

const sortByAttribute = (attribute) => (ascending) => (a, b) => {
  if ((!a[attribute] && !b[attribute]) || a[attribute] === b[attribute]) {
    return ascending
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  }

  if (!a[attribute]) {
    return ascending ? 1 : -1;
  }

  if (!b[attribute]) {
    return ascending ? -1 : 1;
  }

  if (a[attribute].fullName) {
    return ascending
      ? a[attribute].fullName.localeCompare(b[attribute].fullName)
      : b[attribute].fullName.localeCompare(a[attribute].fullName);
  }

  return ascending
    ? a[attribute].localeCompare(b[attribute])
    : b[attribute].localeCompare(a[attribute]);
};

const sortByContactStatus =
  (index, startYear, startSem) => (ascending) => (a, b) => {
    // Index is either 0, 1 or 2: it's displayed left, middle or right in the table
    // startYear and startSem is the year and semester of the leftmost status
    const companySemester = indexToSemester(index, startYear, startSem);
    const semesterA = a.semesterStatuses.find(
      (obj) =>
        obj.year === companySemester.year &&
        obj.semester === companySemester.semester
    );
    const statusA = selectMostProminentStatus(semesterA?.contactedStatus);
    const semesterB = b.semesterStatuses.find(
      (obj) =>
        obj.year === companySemester.year &&
        obj.semester === companySemester.semester
    );
    const statusB = selectMostProminentStatus(semesterB?.contactedStatus);

    if (statusA === statusB) {
      return a.name.localeCompare(b.name);
    }

    return (
      (ascending ? 1 : -1) *
      (contactStatuses.indexOf(statusA) - contactStatuses.indexOf(statusB))
    );
  };

const sortCompanies = (companies, query, startYear, startSem) => {
  const sortType = query.sortBy;
  const ascending = query.ascending === 'true';
  const sortTypeToFunction = {
    name: sortByAttribute('name'),
    sem0: sortByContactStatus(0, startYear, startSem),
    sem1: sortByContactStatus(1, startYear, startSem),
    sem2: sortByContactStatus(2, startYear, startSem),
    studentContact: sortByAttribute('studentContact'),
    comment: sortByAttribute('adminComment'),
  };
  const sortTypeName = Object.keys(sortTypeToFunction).find(
    (sortTypeName) => sortTypeName === sortType
  );
  const sortFunction = sortTypeName
    ? sortTypeToFunction[sortTypeName](ascending)
    : sortTypeToFunction.name(true);
  return companies.sort(sortFunction);
};

export default sortCompanies;
