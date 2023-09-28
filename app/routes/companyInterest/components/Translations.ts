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
    norwegian: 'Faglig arrangement',
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
  // bedex: {
  //   norwegian: 'Bedriftsekskursjon (BedEx)',
  //   english: 'Company excursion (BedEx)',
  // },
  other: {
    norwegian: 'Alternativt arrangement',
    english: 'Other event',
  },
  start_up: {
    norwegian: 'Start-up kveld',
    english: 'Start-up night',
  },
  company_to_company: {
    norwegian: 'Bedrift-til-bedrift',
    english: 'Company-to-company',
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
    norwegian: 'Front- og back-end',
    english: 'Front- and back-end',
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

export const README = {
  readme: {
    norwegian: 'Annonse i readme',
    english: 'Advertisement in readme',
  },
  /*
    collaboration: {
      norwegian: 'Samarbeid med andre linjeforeninger',
      english: 'Collaboration with other student organizations',
    },
    */
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

export const OFFICE_IN_TRONDHEIM = {
  yes: { norwegian: 'Ja', english: 'Yes' },
  no: { norwegian: 'Nei', english: 'No' },
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

  /*
      collaboration_anniversary: {
        english: "Collaboration with Abakus' anniversary committee*",
        norwegian: 'Samarbeid med Abakus sitt Jubileum*',
      },
      collaboration_revue_anniversary: {
        english: "Collaboration with the revue's anniversary committee*",
        norwegian: 'Samarbeid med Revyen sitt Jubileum*',
      },
      */
  /*   collaboration_revue: {
        norwegian: 'Samarbeid med Revyen**',
        english: 'Collaboration with the revue**',
      }, */
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
  },
  phone: {
    norwegian: 'Telefonnummer',
    english: 'Phone number',
  },
  semester: {
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
    norwegian: 'Pitch/forklar dine ønsker for arrangementet',
    english: 'Pitch/explain your wishes for the event',
  },
  eventDescriptionIntro: {
    norwegian:
      'Skriv gjerne litt om hvilke type arrangementer dere ønsker å arrangere. Vi prøver å planlegge med flere ulike typer arrangementer og bedrifter der vi prøver å lage et variert, spennende og nyskapende program. Våre bedriftskontakter har også muligheten til å hjelpe med å utvikle gode arrangementer.',
    english:
      'Please write a bit about what types of events you would like to arrange. We try to plan with several different types of events and companies, where we try to create a varied, exciting and innovative program. Our company contacts also have the opportunity to help develop good events.',
  },
};
