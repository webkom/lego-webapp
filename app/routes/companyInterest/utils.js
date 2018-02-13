// @flow
import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';

export const sortSemesterChronologically = (a: Object, b: Object) => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1
  };
  return a.year !== b.year
    ? a.year - b.year
    : semesterCodeToPriority[a.semester] - semesterCodeToPriority[b.semester];
};

export const SemesterNavigation = ({ title }: { title: Node }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/companyInterest/">Tilbake til skjema</NavigationLink>
    <NavigationLink to="/bdb">BDB</NavigationLink>
    <NavigationLink to="/bdb/add">Ny bedrift</NavigationLink>
  </NavigationTab>
);
