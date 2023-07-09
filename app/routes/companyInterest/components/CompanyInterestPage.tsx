import arrayMutators from 'final-form-arrays';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import english from 'app/assets/great_britain.svg';
import norwegian from 'app/assets/norway.svg';
import Card from 'app/components/Card';
import { Content } from 'app/components/Content';
import { FlexRow } from 'app/components/FlexBox';
import {
  TextEditor,
  TextInput,
  Button,
  CheckBox,
  SelectInput,
  RadioButton,
  RadioButtonGroup,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import Flex from 'app/components/Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { readmeIfy } from 'app/components/ReadmeLogo';
import Tooltip from 'app/components/Tooltip';
import type {
  CompanyInterestEntity,
  CompanyInterestCompanyType,
} from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { spySubmittable, spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { interestText, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import type { ReactNode } from 'react';

export const EVENT_TYPES = {
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
  bedex: {
    norwegian: 'Bedriftsekskursjon (BedEx)',
    english: 'Company excursion (BedEx)',
  },
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
export const SURVEY_OFFER_TYPES = {
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
export const OTHER_TYPES = {
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

export const EVENT_TYPE_OPTIONS = [
  { value: '', label: 'Vis alle arrangementstyper' },
  { value: 'company_presentation', label: 'Bedriftspresentasjon' },
  { value: 'course', label: 'Kurs' },
  { value: 'breakfast_talk', label: 'Frokostforedrag' },
  { value: 'lunch_presentation', label: 'Lunsjpresentasjon' },
  { value: 'bedex', label: 'BedEx' },
  { value: 'digital_presentation', label: 'Digital presentasjon' },
  { value: 'other', label: 'Alternativt arrangement' },
  { value: 'sponsor', label: 'Sponser' },
  { value: 'start_up', label: 'Start-up kveld' },
  { value: 'company_to_company', label: 'Bedrift-til-bedrift' },
];

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
export const TARGET_GRADE_TYPES = {
  '1': {
    norwegian: '1. klasse',
    english: '1st Years',
  },
  '2': {
    norwegian: '2. klasse',
    english: '2nd Years',
  },
  '3': {
    norwegian: '3. klasse',
    english: '3rd Years',
  },
  '4': {
    norwegian: '4. klasse',
    english: '4th Years',
  },
  '5': {
    norwegian: '5. klasse',
    english: '5th Years',
  },
};
export const PARTICIPANT_RANGE_TYPES = {
  first: '10-30',
  second: '30-60',
  third: '60-100',
  fourth: '100+',
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
export const PARTICIPANT_RANGE_MAP = {
  first: [10, 40],
  second: [30, 60],
  third: [60, 100],
  fourth: [100, null],
};

const eventToString = (event) =>
  Object.keys(EVENT_TYPES)[Number(event.charAt(event.length - 2))];

const surveyOffersToString = (offer) =>
  Object.keys(SURVEY_OFFER_TYPES)[Number(offer.charAt(offer.length - 2))];

const otherOffersToString = (offer) =>
  Object.keys(OTHER_TYPES)[Number(offer.charAt(offer.length - 2))];

const collaborationToString = (collab) =>
  Object.keys(COLLABORATION_TYPES)[Number(collab.charAt(collab.length - 2))];

const targetGradeToString = (targetGrade) =>
  Object.keys(TARGET_GRADE_TYPES)[
    Number(targetGrade.charAt(targetGrade.length - 2))
  ];

const SemesterBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <Field
        key={`semester${index}`}
        name={`semesters[${index}].checked`}
        label={semesterToText({ ...fields.value[index], language })}
        type="checkbox"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
    ))}
  </Flex>
);

const SurveyOffersBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <Field
        key={`companyCourseThemes[${index}]`}
        name={`companyCourseThemes[${index}].checked`}
        label={SURVEY_OFFER_TYPES[surveyOffersToString(item)][language]}
        type="checkbox"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
    ))}
  </Flex>
);

const EventBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Field
        key={`events[${index}]`}
        name={`events[${index}].checked`}
        label={EVENT_TYPES[eventToString(key)][language]}
        type="checkbox"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
    ))}
  </Flex>
);

const TargetGradeBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Field
        key={`targetGrades[${index}]`}
        name={`targetGrades[${index}].checked`}
        label={TARGET_GRADE_TYPES[targetGradeToString(key)][language]}
        type="checkbox"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
    ))}
  </Flex>
);

const OtherBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Field
        key={`otherOffers[${index}]`}
        name={`otherOffers[${index}].checked`}
        label={readmeIfy(OTHER_TYPES[otherOffersToString(key)][language])}
        type="checkbox"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
    ))}
  </Flex>
);

const CollaborationBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Field
        key={`collaborations[${index}]`}
        name={`collaborations[${index}].checked`}
        label={COLLABORATION_TYPES[collaborationToString(key)][language]}
        type="checkbox"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
    ))}
  </Flex>
);

const LanguageFlag = ({ language }: { language: string }) => {
  let flag;

  switch (language) {
    case 'english':
      flag = norwegian;
      break;

    case 'norwegian':
      flag = english;
      break;

    default:
      flag = english;
      break;
  }

  return <Image src={flag} className={styles.flag} alt="country_flag" />;
};

type CompanyInterestFormEntity = {
  companyName: string;
  company: number | null | undefined;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: Array<CompanySemesterEntity>;
  events: Array<{
    name: string;
    checked: boolean;
  }>;
  companyCourseThemes: Array<{ name: string; checked: boolean }>;
  otherOffers: Array<{
    name: string;
    checked: boolean;
  }>;
  comment: string;
  courseComment: string;
  breakfastTalkComment: string;
  otherEventComment: string;
  startupComment: string;
  lunchPresentationComment: string;
  bedexComment: string;
  companyToCompanyComment: string;
  companyPresentationComment: string;
  companyType: string;
  officeInTrondheim: boolean;
};

type Props = {
  allowedBdb: boolean;
  onSubmit: (
    arg0: CompanyInterestFormEntity,
    arg1: boolean | null | undefined
  ) => Promise<any>;
  push: (arg0: string) => void;
  events: Array<Record<string, any>>;
  companyCourseThemes: Array<Record<string, any>>;
  semesters: Array<CompanySemesterEntity>;
  otherOffers: Array<Record<string, any>>;
  collaborations: Array<Record<string, any>>;
  targetGrades: Array<Record<string, any>>;
  participantRange: string;
  edit: boolean;
  interestForm: Record<string, any>;
  companyInterest?: CompanyInterestEntity;
  language: string;
  comment: string;
  courseComment: string;
  breakfastTalkComment: string;
  otherEventComment: string;
  startupComment: string;
  lunchPresentationComment: string;
  bedexComment: string;
  companyToCompanyComment: string;
  companyPresentationComment: string;
  companyType: string;
  officeInTrondheim: boolean;
  initialValues: any;
};

const validate = createValidator({
  company: [required()],
  contactPerson: [required()],
  mail: [required(), isEmail()],
  phone: [required()],
  comment: [required()],
});

const CompanyInterestPage = (props: Props) => {
  if (props.edit && !props.companyInterest) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (data) => {
    const { company } = data;
    const companyId = company['value'] ? Number(company['value']) : null;
    const companyName = companyId === null ? company['label'] : '';
    const [range_start, range_end] = data.participantRange
      ? PARTICIPANT_RANGE_MAP[data.participantRange]
      : [null, null];
    const newData = {
      companyName: companyName,
      company: companyId,
      companyType: data.companyType,
      contactPerson: data.contactPerson,
      mail: data.mail,
      phone: data.phone,
      officeInTrondheim: data.officeInTrondheim === 'yes',
      semesters: data.semesters
        .filter((semester) => semester.checked)
        .map((semester) => semester.id),
      events: data.events
        .filter((event) => event.checked)
        .map((event) => event.name),
      companyCourseThemes: data.companyCourseThemes
        .filter((offer) => offer.checked)
        .map((offer) => offer.name),
      otherOffers: data.otherOffers
        .filter((offer) => offer.checked)
        .map((offer) => offer.name),
      collaborations: data.collaborations
        .filter((collab) => collab.checked)
        .map((collab) => collab.name),
      targetGrades: data.targetGrades
        .filter((targetGrade) => targetGrade.checked)
        .map((targetGrade) => Number(targetGrade.name)),
      participantRangeStart: range_start,
      participantRangeEnd: range_end,
      comment: data.comment,
      courseComment: data.courseComment,
      breakfastTalkComment: data.breakfastTalkComment,
      otherEventComment: data.otherEventComment,
      startupComment: data.startupComment,
      lunchPresentationComment: data.lunchPresentationComment,
      bedexComment: data.bedexComment,
      companyToCompanyComment: data.companyToCompanyComment,
      companyPresentationComment: data.companyPresentationComment,
    };
    return props
      .onSubmit(newData, isEnglish)
      .then(() =>
        props.push(
          props.allowedBdb
            ? '/companyInterest/'
            : '/pages/bedrifter/for-bedrifter'
        )
      )
      .catch((err) => {
        if (err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
  };

  const labels = {
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
      norwegian: 'Om bedriften',
      english: 'About the company',
    },
    secondComment: {
      norwegian: 'Annen kommentar',
      english: 'Other comment',
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
  const { language } = props;
  const isEnglish = language === 'english';

  return (
    <Content>
      <Helmet title={isEnglish ? 'Company interest' : 'Bedriftsinteresse'} />

      <LegoFinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={props.initialValues}
        subscription={{}}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <h1>{labels.mainHeading[language]}</h1>
              {!props.edit && (
                <Link to={isEnglish ? '/interesse' : '/register-interest'}>
                  <LanguageFlag language={language} />
                </Link>
              )}
            </FlexRow>
            <Card info>
              {labels.subHeading[language]}
              <a href={'mailto:bedriftskontakt@abakus.no'}>
                bedriftskontakt@abakus.no
              </a>
            </Card>

            <Field
              name="company"
              label={labels.company.header[language]}
              placeholder={labels.company.placeholder[language]}
              filter={['companies.company']}
              fieldClassName={styles.metaField}
              component={SelectInput.AutocompleteField}
              required
            />
            <Field
              label={labels.contactPerson.header[language]}
              placeholder={labels.contactPerson.placeholder[language]}
              name="contactPerson"
              component={TextInput.Field}
              required
            />
            <Field
              label={labels.mail[language]}
              placeholder="example@gmail.com"
              name="mail"
              component={TextInput.Field}
              required
            />
            <Field
              label={labels.phone[language]}
              placeholder="+47 909 09 090"
              name="phone"
              component={TextInput.Field}
              required
            />

            <Flex wrap justifyContent="space-between">
              <Flex column className={styles.interestBox}>
                <label htmlFor="companyType" className={styles.heading}>
                  {labels.companyTypes[language]}
                </label>
                <RadioButtonGroup name="companyType">
                  {Object.keys(COMPANY_TYPES).map((key) => (
                    <Field
                      key={key}
                      name={key}
                      label={COMPANY_TYPES[key][language]}
                      type="radio"
                      component={RadioButton.Field}
                      value={key}
                    />
                  ))}
                </RadioButtonGroup>
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="officeInTrondheim" className={styles.heading}>
                  {labels.officeInTrondheim[language]}
                </label>
                <RadioButtonGroup name="officeInTrondheim">
                  {Object.keys(OFFICE_IN_TRONDHEIM).map((key) => (
                    <Field
                      key={key}
                      name={key}
                      label={OFFICE_IN_TRONDHEIM[key][language]}
                      type="radio"
                      component={RadioButton.Field}
                      value={key}
                    />
                  ))}
                </RadioButtonGroup>
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="companyCourseThemes" className={styles.heading}>
                  <Flex alignItems="center" gap="5px">
                    {labels.companyCourseThemes[language]}
                    <Tooltip
                      className={styles.tooltip}
                      content={
                        <span>
                          {language === 'norwegian'
                            ? 'Dette er temaer som studenter uttrykte interesse for å lære mer om i vår bedriftsundersøkelse. Er dette relevante temaer for deres bedrift dere kan være interessert i å avholde faglige arrangementer eller snakke om på deres presentasjoner? (Uforpliktende)'
                            : 'These are topics that students expressed interest in learning more about in our company survey. Are these relevant topics for your company that you might be interested in arranging a course or workshop about or talk about in your presentations? (Non-binding'}
                        </span>
                      }
                    >
                      <Icon name="information-circle-outline" />
                    </Tooltip>
                  </Flex>
                </label>

                <FieldArray
                  label="companyCourseThemes"
                  name="companyCourseThemes"
                  language={language}
                  component={SurveyOffersBox}
                />
              </Flex>
            </Flex>
            <div className={styles.topline}>
              {interestText.text.first[language]}
              {/*
          <br />
          <br />
          {interestText.text.second[language]}
          <br />
          <br />
          {interestText.bedex[language]
          <br />
          <br />
          {interestText.anniversaryCollaboration[language]}
          */}
              {/*           <br />
          <br />
          {interestText.revueCollaboration[language]}
 */}{' '}
            </div>

            <Field
              placeholder={interestText.comment[language]}
              name="comment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={labels.comment[language]}
              required
            />

            <Flex wrap justifyContent="space-between">
              <Flex column className={styles.interestBox}>
                <label htmlFor="semesters" className={styles.heading}>
                  {labels.semester[language]}
                </label>
                <FieldArray
                  label="semesters"
                  name="semesters"
                  language={language}
                  component={SemesterBox}
                />
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="events" className={styles.heading}>
                  {labels.events[language]}
                </label>
                <FieldArray
                  name="events"
                  language={language}
                  component={EventBox}
                />
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="collaborations" className={styles.heading}>
                  {labels.collaborations[language]}
                </label>
                <FieldArray
                  name="collaborations"
                  language={language}
                  component={CollaborationBox}
                />
              </Flex>
            </Flex>

            <Flex wrap justifyContent="space-between">
              <Flex column className={styles.interestBox}>
                <label htmlFor="targetGrades" className={styles.heading}>
                  {labels.targetGrades[language]}
                </label>
                <FieldArray
                  name="targetGrades"
                  language={language}
                  component={TargetGradeBox}
                />
              </Flex>

              <Flex column className={styles.interestBox}>
                <label htmlFor="participantRange" className={styles.heading}>
                  {labels.participantRange[language]}
                </label>
                <RadioButtonGroup name="participantRange">
                  {Object.keys(PARTICIPANT_RANGE_TYPES).map((key) => (
                    <Field
                      key={key}
                      name={key}
                      label={PARTICIPANT_RANGE_TYPES[key]}
                      type="radio"
                      component={RadioButton.Field}
                      value={key}
                    />
                  ))}
                </RadioButtonGroup>
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="otherOffers" className={styles.heading}>
                  {labels.otherOffers[language]}
                </label>
                <FieldArray
                  name="otherOffers"
                  language={language}
                  component={OtherBox}
                />
              </Flex>
            </Flex>
            <h3 className={styles.topline}>
              {labels.eventDescriptionHeader[language]}
            </h3>
            <p>{labels.eventDescriptionIntro[language]}</p>

            {spyValues((values: CompanyInterestFormEntity) => {
              const showCompanyPresentation = values.events?.some(
                (e) => e.name === 'company_presentation' && e.checked === true
              );

              return (
                showCompanyPresentation && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.company_presentation[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>
                    <p>
                      {interestText.companyPresentationDescription[language]}
                    </p>
                    <Field
                      placeholder={
                        interestText.companyPresentationComment[language]
                      }
                      name="companyPresentationComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            {spyValues((values: CompanyInterestFormEntity) => {
              const showLunchPresentationComment = values.events?.some(
                (e) => e.name === 'lunch_presentation' && e.checked === true
              );

              return (
                showLunchPresentationComment && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.lunch_presentation[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>
                    <p>
                      {interestText.lunchPresentationDescriptiont[language]}
                    </p>
                    <Field
                      placeholder={
                        interestText.lunchPresentationComment[language]
                      }
                      name="lunchPresentationComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            {spyValues((values: CompanyInterestFormEntity) => {
              const showCourseComment = values.events?.some(
                (e) => e.name === 'course' && e.checked === true
              );

              return (
                showCourseComment && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.course[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>
                    <p>{interestText.courseDescription[language]}</p>
                    <Field
                      placeholder={interestText.courseComment[language]}
                      name="courseComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            {spyValues((values: CompanyInterestFormEntity) => {
              const showBreakfastTalkComment = values.events?.some(
                (e) => e.name === 'breakfast_talk' && e.checked === true
              );

              return (
                showBreakfastTalkComment && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.breakfast_talk[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>
                    <p>{interestText.breakfastTalkDescription[language]}</p>
                    <Field
                      placeholder={interestText.breakfastTalkComment[language]}
                      name="breakfastTalkComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            {spyValues((values: CompanyInterestFormEntity) => {
              const showBedexComment = values.events?.some(
                (e) => e.name === 'bedex' && e.checked === true
              );

              return (
                showBedexComment && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.bedex[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>
                    <p>{interestText.bedexDescription[language]}</p>
                    <Field
                      placeholder={interestText.bedexComment[language]}
                      name="bedexComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            {spyValues((values: CompanyInterestFormEntity) => {
              const showOtherEventComment = values.events?.some(
                (e) => e.name === 'other' && e.checked === true
              );

              return (
                showOtherEventComment && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.other[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>
                    <p>{interestText.otherEventDescription[language]}</p>
                    <Field
                      placeholder={interestText.otherEventComment[language]}
                      name="otherEventComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            {spyValues((values: CompanyInterestFormEntity) => {
              const showStartupComment = values.events?.some(
                (e) => e.name === 'start_up' && e.checked === true
              );

              return (
                showStartupComment && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.start_up[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>
                    <p>{interestText.startUpDescription[language]}</p>
                    <Field
                      placeholder={interestText.startUpComment[language]}
                      name="startupComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            {spyValues((values: CompanyInterestFormEntity) => {
              const showCompanyToCompanyComment = values.events?.some(
                (e) => e.name === 'company_to_company' && e.checked === true
              );

              return (
                showCompanyToCompanyComment && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENT_TYPES.company_to_company[language]}</h4>
                      <p className={styles.label}>*</p>
                    </Flex>

                    <p>{interestText.companyToCompanyDescription[language]}</p>
                    <Field
                      placeholder={
                        interestText.companyToCompanyComment[language]
                      }
                      name="companyToCompanyComment"
                      component={TextEditor.Field}
                      rows={10}
                      className={styles.textEditor}
                    />
                  </div>
                )
              );
            })}

            <div className={styles.topline}>
              <b>{interestText.priorityReasoningTitle[language]}</b>
              <br />
              {interestText.priorityReasoning[language]}
            </div>

            {spySubmittable((submittable) => (
              <Button success disabled={!submittable} submit>
                {props.edit
                  ? 'Oppdater bedriftsinteresse'
                  : labels.create[language]}
              </Button>
            ))}
          </form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default CompanyInterestPage;
