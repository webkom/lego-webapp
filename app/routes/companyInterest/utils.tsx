
import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { CompanySemesterEntity } from 'app/reducers/companySemesters';

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
    norwegian:
      'For at vi skal kunne legge tilrette for deres ønsker på best ' +
      'mulig måte, ønsker vi at dere skriver litt om hvordan dere ' +
      'ønsker å gjennomføre arrangementet.',
    english:
      'Please explain your expectations and plans for the event to help us take your preferences ' +
      'into consideration.'
  },
  text: {
    first: {
      norwegian:
        'Dersom dere ønsker noe utenfor de vanlige rammene, huk gjerne av på ' +
        '“Alternativt arrangement” og skriv en kommentar om hva dere kunne ' +
        'tenkt dere å gjøre i kommentarfeltet. Vi i Abakus ønsker å kunne tilby ' +
        'et bredt spekter av arrangementer som er gunstig for våre studenter. ',
      english:
        'If you wish to host something different than a traditional event, you can check the “other” box and ' +
        'write a comment explaining what you have in mind. Abakus wishes to ' +
        'offer a wide range of events that are beneficial for our students. '
    },
    second: {
      norwegian:
        'Kommentarfeltet kan også brukes til å spesifisere annen informasjon, ' +
        'som for eksempel hvilken teknologi dere ønsker å lære bort hvis dere ' +
        'får faglig arrangement.',
      english:
        'The comment box can also be used for other types of information, such as ' +
        'which technologies you would like to present for our students when hosting a course or a workshop.'
    }
  },
  bedex: {
    norwegian:
      '«Husk å ranger datoer og gruppestørrelse dersom du har huket av for BedEx»',
    english: '«Remeber to rank dates and groupsize if you have checked BedEx»'
  }
};
