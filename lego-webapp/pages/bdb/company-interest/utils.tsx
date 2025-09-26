import qs from 'qs';
import { CompanyInterestEventType } from '~/redux/models/CompanyInterest';
import { appConfig } from '~/utils/appConfig';
import {
  COLLABORATION_TYPES,
  EVENTS,
  SURVEY_OFFERS,
  OTHER_OFFERS,
  TARGET_GRADES,
  COLLABORATION_DESCRIPTIONS,
} from './Translations';
import type CompanySemester from '~/redux/models/CompanySemester';

export const sortSemesterChronologically = (
  a: CompanySemester,
  b: CompanySemester,
) => {
  const semesterCodeToPriority = {
    spring: 0,
    autumn: 1,
  };
  return Number(a.year) !== Number(b.year)
    ? Number(a.year) - Number(b.year)
    : semesterCodeToPriority[a.semester] - semesterCodeToPriority[b.semester];
};

export const PARTICIPANT_RANGE_TYPES = {
  first: '0-10',
  second: '10-20',
  third: '20-30',
  fourth: '30-40',
  fifth: '40-50',
  sixth: '50-60',
  seventh: '60+',
};

export const PARTICIPANT_RANGE_MAP = {
  first: [0, 10],
  second: [10, 20],
  third: [20, 30],
  fourth: [30, 40],
  fifth: [40, 50],
  sixth: [50, 60],
  seventh: [60, null],
};

export type CompanyInterestEventTypeOption = {
  value: CompanyInterestEventType;
  label: string;
};
export const EVENT_TYPE_OPTIONS: CompanyInterestEventTypeOption[] = [
  { value: CompanyInterestEventType.All, label: 'Vis alle arrangementstyper' },
  {
    value: CompanyInterestEventType.CompanyPresentation,
    label: 'Bedriftspresentasjon',
  },
  { value: CompanyInterestEventType.Course, label: 'Kurs' },
  { value: CompanyInterestEventType.BreakfastTalk, label: 'Frokostforedrag' },
  {
    value: CompanyInterestEventType.LunchPresentation,
    label: 'Lunsjpresentasjon',
  },
  { value: CompanyInterestEventType.Bedex, label: 'BedEx' },
  {
    value: CompanyInterestEventType.DigitalPresentation,
    label: 'Digital presentasjon',
  },
  { value: CompanyInterestEventType.Other, label: 'Alternativt arrangement' },
  { value: CompanyInterestEventType.Sponsor, label: 'Sponser' },
  { value: CompanyInterestEventType.StartUp, label: 'Start-up kveld' },
  {
    value: CompanyInterestEventType.CompanyToCompany,
    label: 'Bedrift-til-bedrift',
  },
];

export const eventToString = (event) =>
  Object.keys(EVENTS)[Number(event.charAt(event.length - 2))];

export const surveyOffersToString = (offer) =>
  Object.keys(SURVEY_OFFERS)[Number(offer.charAt(offer.length - 2))];

export const otherOffersToString = (offer) =>
  Object.keys(OTHER_OFFERS)[Number(offer.charAt(offer.length - 2))];

export const collaborationToString = (collab) =>
  Object.keys(COLLABORATION_TYPES)[Number(collab.charAt(collab.length - 2))];

export const targetGradeToString = (targetGrade) =>
  Object.keys(TARGET_GRADES)[
    Number(targetGrade.charAt(targetGrade.length - 2))
  ];

export const collaborationDescriptionToString = (collab) =>
  Object.keys(COLLABORATION_DESCRIPTIONS)[
    Number(collab.charAt(collab.length - 2))
  ];

export const getCsvUrl = (
  year: number | string,
  semester: string,
  event?: string,
) =>
  `${appConfig.serverUrl}/company-interests/csv/?${qs.stringify({
    year,
    semester,
    event,
  })}`;

export const SEMESTER_TRANSLATION = {
  spring: {
    norwegian: 'Vår',
    english: 'Spring',
  },
  autumn: {
    norwegian: 'Høst',
    english: 'Autumn',
  },
};

export const semesterToText = ({
  semester,
  year,
  language,
}: {
  semester: string;
  year: number | string;
  language: string;
}) => {
  return semester === 'spring' || semester === 'autumn'
    ? `${SEMESTER_TRANSLATION[semester][language]} ${year}`
    : '';
};
export const interestText = {
  comment: {
    norwegian: 'Skriv litt om bedriften.',
    english: 'Write a little about your company.',
  },
  courseComment: {
    norwegian: 'Skriv litt om hva slags faglig arrangement dere ønsker.',
    english: 'Write a litte about the course you wish for.',
  },
  breakfastTalkComment: {
    norwegian: 'Skriv litt om hva slags frokostforedrag dere ønsker.',
    english: 'Write a litte about the breakfast talk you wish for.',
  },
  otherEventComment: {
    norwegian: 'Skriv litt om hva slags alternativt arrangement dere ønsker.',
    english: 'Write a litte about the alternative event you wish for.',
  },
  startUpComment: {
    norwegian: 'Skriv litt om hva slags startup-arrangement dere ønsker.',
    english: 'Write a litte about the startup event you wish for.',
  },
  lunchPresentationComment: {
    norwegian: 'Skriv litt om hva slags lunsjpresentasjon dere ønsker.',
    english: 'Write a litte about the lunch presentation you wish for.',
  },
  bedexComment: {
    norwegian: 'Skriv litt om hva slags bedex-arrangement dere ønsker.',
    english: 'Write a litte about the bedex event you wish for.',
  },
  companyToCompanyComment: {
    norwegian:
      'Skriv litt om hva slags bedrift-til-bedriftsarrangement dere ønsker.',
    english: 'Write a litte about the company to company event you wish for.',
  },
  companyPresentationComment: {
    norwegian: 'Skriv litt om hva slags bedriftspresentasjon dere ønsker.',
    english: 'Write a litte about the company presentation event you wish for.',
  },
  bedex: {
    norwegian:
      '«Husk å ranger datoer og gruppestørrelse dersom du har huket av for BedEx»',
    english: '«Remember to rank dates and groupsize if you have checked BedEx»',
  },
  anniversaryCollaboration: {
    norwegian:
      '*Samarbeid med Jubileum vil si promoteringsmuligheter på Abakus sitt jubileum i vår, eller Revyen sitt Jubileum i november 2021. Dersom det er av interesse, vil dere informeres om hva et slikt samarbeid vil innebære.',
    english:
      '*A collaboration with the anniversary committees would mean great opportunities  for your company to promote oneself. Either while Abakus has its anniversary in the  spring, or while the revue´s anniversary is celebrated in November 2021. If this is of  interest, we will further inform you what exactly is offered your company.',
  },
  revueCollaboration: {
    norwegian:
      '**Samarbeid med Revyen innebærer at dere får holde bedriftspresentasjon på datoen for Revyen, samt gode promoteringsmuligheter (logo på revy-gensere, logo på revyplakater o.l.)',
    english:
      '**A collaboration with the Revue means being their main sponsor. The Revue is a “show”, made and starred by students, and is widely popular within Abakus. As part of the collaboration, we offer you to give a Company presentation the same date as the revue. The company proceeds to join the students at the show after the presentation, guaranteeing a popular event. We also offer promotion opportunities, including your logo on merch/posters associated with the revue, etc.',
  },
  priorityReasoningTitle: {
    norwegian: 'Abakus sin begrunnelse for prioritering',
    english: 'How we in Abakus prioritize',
  },
  priorityReasoning: {
    norwegian:
      'Vi velger bedrifter på bakgrunn av mange faktorer. Vi ønsker å ha et sammensatt og variert tilbud som representerer flere ulike bransjer, teknologier og type arrangement. Viktige faktorer er kreativitet, nytenking og interaktivitet.',
    english:
      'We choose companies based on many factors. We want to have a varied and diverse offer that represents many different industries, technologies and types of events. Important factors are creativity, innovation and interactivity.',
  },
  companyPresentationDescription: {
    norwegian:
      'Vi ønsker gjerne at dere vil beskrive hvordan bedriftspresentasjon dere ønsker. Har dere noen tanker om innhold i presentasjonen dere ønsker å fokusere på eller typen mingling i etterkant?',
    english:
      'We would like for you to describe the type of company presentation you want. Do you have any thoughts about the content of the presentation that you want to focus on or the type of networking afterwards?',
  },

  lunchPresentationDescriptiont: {
    norwegian:
      'Skriv gjerne litt om hvordan presentasjon dere ønsker i forhold til innhold og mingling. I motsetning til bedriftspresentasjon legger denne opp til å starte ved lunsjtider og holder minglingen på Gløshaugen.',
    english:
      'Please write a little bit about the type of presentation you would like in terms of content and networking. In contrast to the company presentation, this is scheduled to start at lunchtime and will hold networking at Gløshaugen.',
  },
  courseDescription: {
    norwegian:
      'På et faglig arrangement skal dere lære bort noe til studentene. Dette kan være gjennom foredrag, workshops eller lignende. Fortell hva dere kan holde kurs i, og pitch gjerne en fullstendig idé til gjennomføring av kurset. Er det noe dere kan lære bort som sammenfaller med temaene studentene har svart at de ønsker seg, eller driver dere med noe annet studentene vil være interesserte i?',
    english:
      'At a course or workshop, you must teach something to the students. This can be through talks or interactive workshops. Tell us what you can hold a course about, and feel free to pitch a complete idea for carrying out the course. Is there something you can teach that coincides with the topics the students have answered that they want, or do you do something else the students will be interested in?',
  },
  breakfastTalkDescription: {
    norwegian:
      'Frokostforedragene foregår fra klokken 8 til 10/11, og holdes vanligvis på campus. Tildeling av frokostforedrag skjer uavhengig av andre tildelinger, så dere kan få frokostforedrag i tillegg til et annet arrangement. Vi ønsker gjerne at dere foreslår temaer til frokostforedraget dere ønsker å holde. Det er åpent for alt. Tidligere temaer har blant annet vært softskills, spennende caser fra jobb, teknologiutvikling, motivasjonsforedrag eller bærekraft.',
    english:
      'The breakfast talks take place from 8 am to 10/11 am, and are usually held on campus. Allocation of breakfast talks takes place independently of other allocations, so you can receive breakfast lectures in addition to another event. We would like you to suggest topics for the breakfast talks you wish to give. We are open to everything. Previous topics have included soft skills, exciting cases from work, technology development, motivational talks or sustainability.',
  },
  bedexDescription: {
    norwegian:
      'BedEx er Abakus sin bedriftsekskursjon til Oslo, spesialtilrettelagt for studenter i 4. og 5. klasse. Gjennom et firedagers opphold i Oslo, får studentene muligheten til å besøke 6 fremstående bedrifter. Disse bedriftene ønsker studentene velkommen i sine lokaler, hvor de gjennom nøye planlagte aktiviteter og direkte dialog med ansatte, tilbyr dybdeinnsikt i både sine operasjoner og arbeidskultur. BedEx-teamet organiserer en gruppeflyvning fra Trondheim til Oslo på formiddagen tirsdag 10. september, samt hotellopphold frem til og med fredag 13. september. Returreisen står hver student fritt til å arrangere selv, noe som gir rom for de som ønsker å tilbringe ekstra tid med familie i området eller nyte en forlenget helg i Oslo.',
    english:
      "BedEx is Abakus' company excursion to Oslo for students in their 4th and 5th year of study. During a four-day stay in Oslo, students have the opportunity to visit 6 prominent companies. These companies welcome the students to their premises, where, through carefully planned activities and direct dialogue with employees, they provide in-depth insight into both their operations and work culture. The BedEx team organizes a group flight from Trondheim to Oslo on the morning of tuesday September 10, as well as hotel accommodation until friday September 13. Each student is free to arrange their journey back to Trondheim, allowing those who wish to spend extra time with family in the area or enjoy an extended weekend in Oslo.",
  },
  otherEventDescription: {
    norwegian:
      'Har dere ønsker om å arrangere noe mer enn en vanlig bedriftspresentasjon eller noe som ikke helt passer som et faglig arrangement? Skriv en beskrivelse av hva dere har tenkt eller ønsker. Også mulig å sparre med oss så kan vi finne på spennende arrangementer.',
    english:
      "Do you have any wishes to arrange something more than a regular company presentation or something that doesn't quite fit as a professional event? Write a description of what you have in mind or want. It is also possible to brainstorm with us so that we can come up with exciting events.",
  },
  startUpDescription: {
    norwegian:
      'Er dere en start-up som hadde vært spennende å høre om på en av våre start-up kvelder? Da er det bare å skrive en beskrivelse her og gjerne litt hva/hvordan arrangement dere kan ha lyst på.',
    english:
      'Are you a start-up that would be exciting to hear about at one of our start-up evenings? Then just write a description here and also what kind of event you might want.',
  },
  companyToCompanyDescription: {
    norwegian:
      'Bedrift-til-bedrift er et arrangement som arrangeres i samarbeid med to andre bedrifter. 3 grupper med studenter rullerer på å besøke bedriftene deres i ca. 40 minutter og ser hvordan dere har det i deres lokaler. Her kan dere presentere caser fra deres bedrift, ha escape room, konkurranser eller finne på noe annet gøy. Skriv gjerne om dere har noen gode ideer! Etter at alle gruppene har besøkt alle bedriftene, drar alle ut på felles mingling.',
    english:
      'Company-to-company is an event organized in collaboration with two other companies. 3 groups of students rotate to visit their companies for approximately 40 minutes and have a look around your workspace. Here you can present cases from your company, have escape rooms, competitions or come up with something else fun. Feel free to write if you have any good ideas! After all the groups have visited all the businesses, everyone goes out for joint mingling.',
  },
};
