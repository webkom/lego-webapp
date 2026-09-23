import type { CompanyInterestCompanyType } from '~/redux/slices/companyInterest';

export const EVENTS = {
  company_presentation: {
    norwegian: 'Bedriftspresentasjon',
    english: 'Company presentation',
  },
  lunch_presentation: {
    norwegian: 'Lunsjpresentasjon',
    english: 'Lunch presentation',
  },
  course: {
    norwegian: 'Bedriftskurs',
    english: 'Course or workshop',
  },
  breakfast_talk: {
    norwegian: 'Frokostforedrag',
    english: 'Breakfast talk',
  },
  // digital_presentation: {
  //   norwegian: 'Digital presentasjon',
  //   english: 'Digital presentation',
  // },
  bedex: {
    norwegian: 'Bedriftsekskursjon (BedEx)',
    english: 'Company excursion (BedEx)',
  },
  other: {
    norwegian: 'Alternativt arrangement',
    english: 'Other event',
  },
  // start_up: {
  //   norwegian: 'Start-up kveld',
  //   english: 'Start-up night',
  // },
  company_to_company: {
    norwegian: 'Bedrift-til-bedrift',
    english: 'Company-to-company',
  },
};

export const EVENT_DESCRIPTIONS = {
  company_presentation: {
    norwegian:
      'Kom og fortell om hvem dere er og hva dere gjør i bedriften deres.',
    english: 'Come and tell us who you are and what you do in your company.',
  },
  lunch_presentation: {
    norwegian:
      'I motsetning til bedriftspresentasjon legger denne opp til å starte ved lunsjtider og holder minglingen på Gløshaugen.',
    english:
      'In contrast to the company presentation, this is scheduled to start at lunchtime and will hold networking at Gløshaugen.',
  },
  course: {
    norwegian:
      'På et faglig arrangement skal dere lære bort noe til studentene. Dette kan være gjennom foredrag, workshops eller lignende. ',
    english:
      'At a course or workshop, you must teach something to the students. This can be through talks or interactive workshops.',
  },
  breakfast_talk: {
    norwegian:
      'Morgenforedrag på campus kl. 08–10/11 med fritt temavalg, tildelt uavhengig av andre arrangementer.',
    english:
      'Morning talks on campus from 8–10/11, on a topic of your choosing, allocated independently of other events.',
  },
  bedex: {
    norwegian:
      'Fire dagers bedriftsekskursjon til Oslo for 4.- og 5.-klassinger, med besøk hos seks bedrifter. Vi organiserer felles flyreise fra Trondheim og hotell 10.–13. september.',
    english:
      'A four day company excursion to Oslo for 4th and 5th years, visiting six companies. We organise a group flight from Trondheim and hotel from 10–13 September.',
  },
  other: {
    norwegian:
      'Har dere ønsker om å arrangere noe mer enn en vanlig bedriftspresentasjon eller noe som ikke helt passer som et faglig arrangement?  ',
    english:
      "Do you have any wishes to arrange something more than a regular company presentation or something that doesn't quite fit as a professional event? ",
  },
  start_up: {
    norwegian:
      'Er dere en start-up som hadde vært spennende å høre om på en av våre start-up kvelder?',
    english:
      'Are you a start-up that would be exciting to hear about at one of our start-up evenings?',
  },
  company_to_company: {
    norwegian:
      'Bli med på et unikt arrangement hvor studentene roterer mellom bedriftenes Trondheimskontorer. Hver bedrift får ca. 40 minutter med hver gruppe av studenter. Opplegget kan inkludere en introduksjon til bedriften og spennende konkurranser. Til slutt samles alle for mingling, hvor dere kan knytte nye kontakter og dele erfaringer.',
    english:
      'Join a unique event where students rotate between the offices of the companies in Trondheim. Each company gets approx. 40 minutes with each group of students. The program can include an introduction to the company and exciting competitions. Finally, everyone gathers for more socializing, where you can make new contacts and share experiences.',
  },
};

export const SURVEY_OFFERS = {
  company_survey_security: {
    norwegian: 'Sikkerhet',
    english: 'Security',
  },
  company_survey_ai: {
    norwegian: 'Kunstig intelligens',
    english: 'Artificial intelligence',
  },
  company_survey_big_data: {
    norwegian: 'Big data',
    english: 'Big data',
  },
  company_survey_front_back_end: {
    norwegian: 'Front- og backend',
    english: 'Front- and backend',
  },
  company_survey_iot: {
    norwegian: 'Internet of Things',
    english: 'Internet of Things',
  },
  company_survey_gamedev: {
    norwegian: 'Spillutvikling',
    english: 'Game development',
  },
  company_survey_softskills: {
    norwegian: 'Softskills',
    english: 'Soft skills',
  },
  company_survey_fintech: {
    norwegian: 'Finansiell teknologi',
    english: 'Financial technology',
  },
};

export const OTHER_OFFERS = {
  social_media: {
    norwegian: 'Profilering på sosiale medier',
    english: 'Profiling on social media',
  },
  readme: {
    norwegian: 'Annonse i readme',
    english: 'Advertisement in readme',
  },
};

export const COMPANY_TYPES: Record<
  CompanyInterestCompanyType,
  { norwegian: string; english: string }
> = {
  company_types_small_consultant: {
    norwegian: 'Liten konsulentbedrift ( < ~50)',
    english: 'Small consultant company ( < ~50)',
  },
  company_types_medium_consultant: {
    norwegian: 'Medium konsulentbedrift ( < 400)',
    english: 'Medium consultant company ( < 400)',
  },
  company_types_large_consultant: {
    norwegian: 'Stor konsulentbedrift ( > 400)',
    english: 'Large consultant company ( > 400)',
  },
  company_types_inhouse: { norwegian: 'In-house', english: 'In-house' },
  company_types_others: { norwegian: 'Annet', english: 'Other' },
  company_types_start_up: { norwegian: 'Start-up', english: 'Start-up' },
  company_types_governmental: { norwegian: 'Statlig', english: 'Governmental' },
};

export const COLLABORATION_TYPES = {
  collaboration_omega: {
    norwegian: 'Samarbeid med Omega linjeforening',
    english: 'Event in collaboration with Omega',
  },
  collaboration_online: {
    norwegian: 'Samarbeid med Online linjeforening',
    english: 'Event in collaboration with Online',
  },
  collaboration_tihlde: {
    norwegian: 'Samarbeid med TIHLDE linjeforening',
    english: 'Event in collaboration with TIHLDE',
  },
  collaboration_revue: {
    norwegian: 'Samarbeid med Revyen',
    english: 'Collaboration with the revue',
  },
  // collaboration_anniversary: {
  //   english: "Collaboration with Abakus' anniversary committee*",
  //   norwegian: 'Samarbeid med Abakus sitt Jubileum*',
  // },
  // collaboration_revue_anniversary: {
  //   english: "Collaboration with the revue's anniversary committee*",
  //   norwegian: 'Samarbeid med Revyen sitt Jubileum*',
  // },
};

export const COLLABORATION_DESCRIPTIONS = {
  collaboration_revue: {
    norwegian:
      'Hold bedriftspresentasjon på revydatoen, med promotering på revygensere, plakater o.l.',
    english:
      'Give a company presentation on the revue date, with promotion on revue merch, posters etc.',
  },
};

export const README_PROMO = {
  tagline: {
    norwegian: 'Gløshaugens største linjeforeningsmagasin',
    english: 'The largest student magazine at Gløshaugen',
  },
  stats: [
    {
      norwegian: '500 eksemplarer per utgave',
      english: '500 copies per issue',
    },
    {
      norwegian: 'Tre utgaver i semesteret',
      english: 'Three issues per semester',
    },
    {
      norwegian: 'Når 900+ teknologistudenter på campus',
      english: 'Reaches 900+ tech students on campus',
    },
  ],
};

export const TARGET_GRADES = {
  '1': {
    norwegian: '1. klasse',
    english: '1st years',
  },
  '2': {
    norwegian: '2. klasse',
    english: '2nd years',
  },
  '3': {
    norwegian: '3. klasse',
    english: '3rd years',
  },
  '4': {
    norwegian: '4. klasse',
    english: '4th years',
  },
  '5': {
    norwegian: '5. klasse',
    english: '5th years',
  },
};

export const FORM_LABELS = {
  mainHeading: {
    norwegian: 'Meld interesse',
    english: 'Register interest',
  },
  subHeading: {
    norwegian:
      'Dette skjemaet skal ikke brukes for annonser. For slikt, send en e-post til ',
    english:
      'This form is not to be used for job listings. For such enquiries, send an e-mail to ',
  },
  company: {
    header: {
      norwegian: 'Navn på bedrift',
      english: 'Name of company',
    },
    placeholder: {
      norwegian: 'Bedriftsnavn',
      english: 'Company name',
    },
  },
  officeInTrondheim: {
    norwegian: 'Har dere kontorer i Trondheim egnet for besøk?',
    english: 'Do you have offices in Trondheim suited for visiting?',
  },
  wantsThursdayEvent: {
    norwegian: 'Ønsker dere arrangement på torsdag?',
    english: 'Would you like to have the event on Thursday?',
  },
  wantsThursdayEventInfo: {
    norwegian:
      'Torsdags-arrangementer er av de mest populære blant studentene, med høyere påmelding og større engasjement.',
    english:
      'Thursday events are among the most popular with students, with higher sign-up numbers and greater engagement.',
  },
  contactPerson: {
    header: {
      norwegian: 'Kontaktperson',
      english: 'Contact person',
    },
    placeholder: {
      norwegian: 'Kari Nordmann',
      english: 'Jon Smith',
    },
  },
  mail: {
    norwegian: 'E-post',
    english: 'E-mail',
    placeholder: {
      norwegian: 'eksempel@bedrift.no',
      english: 'example@company.com',
    },
  },
  phone: {
    norwegian: 'Telefonnummer',
    english: 'Phone number',
    placeholder: {
      norwegian: '+47 909 09 090',
      english: '+44 117 234 5678',
    },
  },
  semesters: {
    norwegian: 'Semester',
    english: 'Semester',
  },
  events: {
    norwegian: 'Arrangementer',
    english: 'Events',
  },
  otherOffers: {
    norwegian: 'Annet',
    english: 'Other',
  },
  companyTypes: {
    norwegian: 'Bedriftstype',
    english: 'Company type',
  },
  collaborations: {
    norwegian: 'Samarbeid',
    english: 'Collaboration',
  },
  targetGrades: {
    norwegian: 'Klassetrinn',
    english: 'Target grades',
  },
  companyCourseThemes: {
    norwegian: 'Temaer som er relevant for dere',
    english: 'Topics that are relevant for you',
  },
  companyCourseThemesInfo: {
    norwegian:
      'Studentene har etterspurt disse temaene i bedriftsundersøkelsen vår. Kryss av for det dere kunne tenke dere å holde kurs om eller ta opp i presentasjonen. (Uforpliktende)',
    english:
      "Students asked for these topics in our company survey. Tick the ones you'd consider running a course on or covering in your presentation. (No commitment)",
  },
  participantRange: {
    norwegian: 'Antall deltagere',
    english: 'Number of participants',
  },
  comment: {
    norwegian: 'Om bedriften og hva dere jobber med',
    english: 'About the company and your work',
  },
  create: {
    norwegian: 'Send bedriftsinteresse',
    english: 'Submit interest',
  },
  eventDescriptionHeader: {
    norwegian: 'Pitch/beskriv ønsket deres',
    english: 'Pitch/describe your wishes',
  },
  eventDescriptionIntro: {
    norwegian:
      'Fortell gjerne litt om hvilke typer arrangementer dere ønsker å holde. Vi ønsker et variert og nyskapende program, og bedriftskontaktene våre hjelper gjerne til med å utvikle arrangementet.',
    english:
      "Tell us a bit about the kind of events you'd like to host. We aim for a varied and innovative programme, and our company contacts are happy to help develop the event with you.",
  },
};
