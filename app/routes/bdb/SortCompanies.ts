import {
  selectMostProminentStatus,
  contactStatuses,
  indexToYearAndSemester,
} from './utils';
import type { TransformedAdminCompany } from 'app/reducers/companies';
import type { ParsedQs } from 'qs';

const sortByAttribute = (attribute) => (ascending) => (a, b) => {
  const aAttribute = a?.[attribute];
  const bAttribute = b?.[attribute];

  // Check if both attributes are null, undefined or equal (notice we only use "==", instead of the strict equality)
  if ((aAttribute == null && bAttribute == null) || aAttribute === bAttribute) {
    return ascending
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  }

  // Handle cases where one of the attributes is null or undefined
  if (aAttribute == null) {
    return ascending ? 1 : -1;
  }
  if (bAttribute == null) {
    return ascending ? -1 : 1;
  }

  // If the attribute has a `fullName` property
  if (
    typeof aAttribute === 'object' &&
    aAttribute.fullName &&
    typeof bAttribute === 'object' &&
    bAttribute.fullName
  ) {
    return ascending
      ? aAttribute.fullName.localeCompare(bAttribute.fullName)
      : bAttribute.fullName.localeCompare(aAttribute.fullName);
  }

  // If the attribute is a string
  if (typeof aAttribute === 'string' && typeof bAttribute === 'string') {
    return ascending
      ? aAttribute.localeCompare(bAttribute)
      : bAttribute.localeCompare(aAttribute);
  }

  // Fallback for unexpected types
  return 0;
};

const sortByContactStatus =
  (index: number, startYear: number, startSem: number) =>
  (ascending: boolean) =>
  (a: TransformedAdminCompany, b: TransformedAdminCompany) => {
    // Index is either 0, 1 or 2: it's displayed left, middle or right in the table
    // startYear and startSem is the year and semester of the leftmost status
    const { year, semester } = indexToYearAndSemester(
      index,
      startYear,
      startSem,
    );
    const semesterA = a.semesterStatuses?.find(
      (obj) => obj.year === year && obj.semester === semester,
    );
    const statusA = selectMostProminentStatus(semesterA?.contactedStatus);
    const semesterB = b.semesterStatuses?.find(
      (obj) => obj.year === year && obj.semester === semester,
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

const sortCompanies = (
  companies: TransformedAdminCompany[],
  query: ParsedQs,
  startYear: number,
  startSem: number,
) => {
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
    (sortTypeName) => sortTypeName === sortType,
  );
  const sortFunction = sortTypeName
    ? sortTypeToFunction[sortTypeName](ascending)
    : sortTypeToFunction.name(true);
  return companies.sort(sortFunction);
};

export default sortCompanies;
