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

export const TOOLTIP = {
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
      'Frokostforedragene foregår fra klokken 8 til 10/11, og holdes vanligvis på campus. Tildeling av frokostforedrag skjer uavhengig av andre tildelinger, så dere kan få frokostforedrag i tillegg til et annet arrangement. Vi ønsker gjerne at dere foreslår temaer til frokostforedraget dere ønsker å holde. Det er åpent for alt. Tidligere temaer har blant annet vært softskills, spennende caser fra jobb, teknologiutvikling, motivasjonsforedrag eller bærekraft.',
    english:
      'The breakfast talks take place from 8 am to 10/11 am, and are usually held on campus. Allocation of breakfast talks takes place independently of other allocations, so you can receive breakfast lectures in addition to another event. We would like you to suggest topics for the breakfast talks you wish to give. We are open to everything. Previous topics have included soft skills, exciting cases from work, technology development, motivational talks or sustainability.',
  },
  bedex: {
    norwegian:
      'BedEx er Abakus sin bedriftsekskursjon til Oslo, spesialtilrettelagt for studenter i 4. og 5. klasse. Gjennom et firedagers opphold i Oslo, får studentene muligheten til å besøke 6 fremstående bedrifter. Disse bedriftene ønsker studentene velkommen i sine lokaler, hvor de gjennom nøye planlagte aktiviteter og direkte dialog med ansatte, tilbyr dybdeinnsikt i både sine operasjoner og arbeidskultur. BedEx-teamet organiserer en gruppeflyvning fra Trondheim til Oslo på formiddagen tirsdag 10. september, samt hotellopphold frem til og med fredag 13. september. Returreisen står hver student fritt til å arrangere selv, noe som gir rom for de som ønsker å tilbringe ekstra tid med familie i området eller nyte en forlenget helg i Oslo.',
    english:
      "BedEx is Abakus' company excursion to Oslo for students in their 4th and 5th year of study. During a four-day stay in Oslo, students have the opportunity to visit 6 prominent companies. These companies welcome the students to their premises, where, through carefully planned activities and direct dialogue with employees, they provide in-depth insight into both their operations and work culture. The BedEx team organizes a group flight from Trondheim to Oslo on the morning of tuesday September 10, as well as hotel accommodation until friday September 13. Each student is free to arrange their journey back to Trondheim, allowing those who wish to spend extra time with family in the area or enjoy an extended weekend in Oslo.",
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
      'Bedrift-til-bedrift er et arrangement som arrangeres i samarbeid med to andre bedrifter. 3 grupper med studenter rullerer på å besøke bedriftene deres i ca. 40 minutter og ser hvordan dere har det i deres lokaler. Her kan dere presentere caser fra deres bedrift, ha escape room, konkurranser eller finne på noe annet gøy. Etter at alle gruppene har besøkt alle bedriftene, drar alle ut på felles mingling.',
    english:
      'Company-to-company is an event organized in collaboration with two other companies. 3 groups of students rotate to visit their companies for approximately 40 minutes and have a look around your workspace. Here you can present cases from your company, have escape rooms, competitions or come up with something else fun. After all the groups have visited all the businesses, everyone goes out for joint mingling.',
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
  readme: {
    norwegian: 'Annonse i readme',
    english: 'Advertisement in readme',
  },
  social_media: {
    norwegian: 'Profilering på sosiale medier',
    english: 'Profiling on social media',
  },
  thursday_event: {
    norwegian: 'Ønsker arrangement torsdag',
    english: 'Wish event thursday',
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
  // collaboration_revue: {
  //   norwegian: 'Samarbeid med Revyen',
  //   english: 'Collaboration with the revue',
  // },
  // collaboration_anniversary: {
  //   english: "Collaboration with Abakus' anniversary committee*",
  //   norwegian: 'Samarbeid med Abakus sitt Jubileum*',
  // },
  // collaboration_revue_anniversary: {
  //   english: "Collaboration with the revue's anniversary committee*",
  //   norwegian: 'Samarbeid med Revyen sitt Jubileum*',
  // },
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
    norwegian: 'Skibidi events😛💯🚽',
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
      'Dette er temaer som studenter har uttrykt interesse for å lære mer om i vår bedriftsundersøkelse. Kryss av for de temaene dere kan ønske å holde kurs om eller snakke om på deres presentasjoner. (Uforpliktende)',
    english:
      'These are topics that students expressed interest in learning more about in our company survey. Check off the topics that you might be interested in arranging a course or workshop about or talk about in your presentations. (Non-binding)',
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
