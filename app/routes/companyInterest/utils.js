// @flow
import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

export const sortSemesterChronologically = (
  a: CompanySemesterEntity,
  b: CompanySemesterEntity
) => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1
  };
  return Number(a.year) !== Number(b.year)
    ? Number(a.year) - Number(b.year)
    : semesterCodeToPriority[a.semester] - semesterCodeToPriority[b.semester];
};

export const SemesterNavigation = ({ title }: { title: Node }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/companyInterest/">Tilbake til skjema</NavigationLink>
    <NavigationLink to="/bdb">BDB</NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
  </NavigationTab>
);

export const SEMESTER_TRANSLATION = {
  spring: 'Vår',
  autumn: 'Høst'
};

export const semesterToText = (semester: CompanySemesterEntity) =>
  `${SEMESTER_TRANSLATION[semester.semester]} ${semester.year}`;
