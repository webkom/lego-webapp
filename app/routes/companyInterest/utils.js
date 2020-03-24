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
  spring: {
    norwegian: 'Vår',
    english: 'Spring'
  },
  autumn: {
    norwegian: 'Høst',
    english: 'Autumn'
  }
};

export const semesterToText = ({
  semester,
  year,
  language
}: {
  semester: string,
  year: number | string,
  language: string
}) => {
  return semester === 'spring' || semester === 'autumn'
    ? `${SEMESTER_TRANSLATION[semester][language]} ${year}`
    : '';
};

export const interestText = {
  comment: {
    norwegian: 'Skriv om bedriften eller arrangementet.',
    english: 'Write about your company or the event.'
  },
  text: {
    first: {
      norwegian:
        'Dersom dere ikke har hatt arrangement med Abakus før, eller om det er lenge siden vi har samarbeidet, ønsker vi at dere skriver litt om selskapet. Dette hjelper oss mye når vi skal sette sammen arrangementskalenderen.',
      english:
        "If you haven't held an event with Abakus previously, or if it has been a long time since we cooperated, we would like if you told us a bit about your company. This helps us when distributing dates for events."
    },
    second: {
      norwegian:
        'Vi ønsker også at dere skriver litt om hva slags type arrangement dere ser for dere å holde. Ønsker dere å gjøre noe utenfor de vanlige rammene, eller helst en standard bedpres? Uansett vil vi gjerne vite det!',
      english:
        "We'd prefer that you also write a little bit about what kind of event you would like to have. Do you want something outside the given options, or is it a regular company presentation? Either way, we'd like to know!"
    }
  },
  bedex: {
    norwegian:
      '«Husk å ranger datoer og gruppestørrelse dersom du har huket av for BedEx»',
    english: '«Remeber to rank dates and groupsize if you have checked BedEx»'
  }
};
