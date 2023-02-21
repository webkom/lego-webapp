import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError, FieldArray } from 'redux-form';
import english from 'app/assets/great_britain.svg';
import norwegian from 'app/assets/norway.svg';
import { Content } from 'app/components/Content';
import { FlexRow } from 'app/components/FlexBox';
import {
  TextEditor,
  TextInput,
  Button,
  CheckBox,
  SelectInput,
  Form,
  RadioButton,
  RadioButtonGroup,
} from 'app/components/Form';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import Flex from 'app/components/Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator';
import withAutocomplete from 'app/components/Search/withAutocomplete';
import Tooltip from 'app/components/Tooltip';
import type {
  CompanyInterestEntity,
  CompanyInterestCompanyType,
} from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { interestText, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import type { ReactNode } from 'react';
import type { FormProps, FieldArrayProps } from 'redux-form';

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
    english: 'AI',
  },
  company_survey_big_data: {
    norwegian: 'Big data',
    english: 'Big data',
  },
  company_survey_front_back_end: {
    norwegian: 'Front end/Back end',
    english: 'Front and back-end',
  },
  company_survey_iot: {
    norwegian: 'Internet of things',
    english: 'IoT',
  },
  company_survey_gamedev: {
    norwegian: 'Spillutvikling',
    english: 'Gamedev',
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
    norwegian: 'Annonsere i readme',
    english: 'Advertisement in readme',
  },
  /*
  collaboration: {
    norwegian: 'Samarbeid med andre linjeforeninger',
    english: `Event in collaboration with other student organizations`,
  },
  */
};

export const OFFICE_IN_TRONDHEIM = {
  true: { norwegian: 'Ja', english: 'Yes' },
  false: { norwegian: 'Nei', english: 'No' },
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
    norwegian: 'Liten Konsulentbedrift ( < ∼50)',
    english: 'Small Consultant ( < ∼50)',
  },
  company_types_medium_consultant: {
    norwegian: 'Medium Konsulentbedrift ( < 400)',
    english: 'Medium Consultant ( < 400)',
  },
  company_types_large_consultant: {
    norwegian: 'Stor Konsulentbedrift ( > 400)',
    english: 'Large Consultant ( > 400)',
  },
  company_types_inhouse: { norwegian: 'Inhouse', english: 'Inhouse' },
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
  language: string;
} & FieldArrayProps): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <Flex key={item}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`semester${index}`}
              name={`semesters[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <Flex gap="4px" alignItems="center">
            {semesterToText({ ...fields.get(index), language })}
          </Flex>
        </label>
      </Flex>
    ))}
  </Flex>
);

const SurveyOffersBox = ({
  fields,
  language,
}: {
  language: string;
} & FieldArrayProps): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <Flex key={item}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`companyCourseThemes[${index}]`}
              name={`companyCourseThemes[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <Flex gap="4px" alignItems="center">
            {SURVEY_OFFER_TYPES[surveyOffersToString(item)][language]}
          </Flex>
        </label>
      </Flex>
    ))}
  </Flex>
);

const EventBox = ({
  fields,
  language,
}: {
  language: string;
} & FieldArrayProps): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={key} alignItems="center">
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`events[${index}]`}
              name={`events[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <Flex gap="4px" alignItems="center">
            {EVENT_TYPES[eventToString(key)][language]}

            <Tooltip
              content={
                interestText[
                  Object.keys(interestText).filter((key) =>
                    key.includes('Description')
                  )[index]
                ][language]
              }
            >
              <Icon name="information-circle-outline" />
            </Tooltip>
          </Flex>
        </label>
      </Flex>
    ))}
  </Flex>
);

const TargetGradeBox = ({
  fields,
  language,
}: {
  language: string;
} & FieldArrayProps): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={key}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`targetGrades[${index}]`}
              name={`targetGrades[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <Flex gap="4px" alignItems="center">
            {TARGET_GRADE_TYPES[targetGradeToString(key)][language]}
          </Flex>
        </label>
      </Flex>
    ))}
  </Flex>
);

const OtherBox = ({
  fields,
  language,
}: {
  language: string;
} & FieldArrayProps): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={key}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`otherOffers[${index}]`}
              name={`otherOffers[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <Flex gap="4px" alignItems="center">
            {OTHER_TYPES[otherOffersToString(key)][language]}
          </Flex>
        </label>
      </Flex>
    ))}
  </Flex>
);

const CollaborationBox = ({
  fields,
  language,
}: {
  language: string;
} & FieldArrayProps): ReactNode => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={key}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`collaborations[${index}]`}
              name={`collaborations[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <Flex gap="4px" alignItems="center">
            {COLLABORATION_TYPES[collaborationToString(key)][language]}
          </Flex>
        </label>
      </Flex>
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
type Props = FormProps & {
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
};

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
      officeInTrondheim: data.officeInTrondheim,
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
      english: 'Contact us',
    },
    subHeading: {
      norwegian:
        'Dette skjemaet bør ikke brukes for annonser. For Annonser, send epost til ',
      english:
        'This form is not to be used for job listings. For such enquiries, send an email to ',
    },
    company: {
      header: {
        norwegian: 'Navn på bedrift',
        english: 'Company',
      },
      placeholder: {
        norwegian: 'Bedriftsnavn',
        english: 'Company name',
      },
    },
    officeInTrondheim: {
      norwegian:
        'Har bedriften et kontor i Trondheim som ønsker/egner seg for besøk?',
      english:
        'Does the company have an office in Trondheim that wishes/is suited for visiting?',
    },
    contactPerson: {
      header: {
        norwegian: 'Kontaktperson',
        english: 'Your contact person',
      },
      placeholder: {
        norwegian: 'Kari Nordmann',
        english: 'Jon Smith',
      },
    },
    mail: {
      norwegian: 'Mail',
      english: 'E-Mail',
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
      english: 'Company Type',
    },
    collaborations: {
      norwegian: 'Samarbeid',
      english: 'Collaborations',
    },
    targetGrades: {
      norwegian: 'Klassetrinn',
      english: 'Target Grades',
    },
    companyCourseThemes: {
      norwegian: 'Spørreundersøkelser',
      english: 'Survey Offers',
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
      norwegian: 'Opprett bedriftsinteresse',
      english: 'Submit',
    },
  };
  const { language } = props;
  const isEnglish = language === 'english';
  const showCourseComment = props.interestForm.events?.some(
    (e) => e.name === 'course' && e.checked === true
  );
  const showBreakfastTalkComment = props.interestForm.events?.some(
    (e) => e.name === 'breakfast_talk' && e.checked === true
  );
  const showOtherEventComment = props.interestForm.events?.some(
    (e) => e.name === 'other' && e.checked === true
  );
  const showStartupComment = props.interestForm.events?.some(
    (e) => e.name === 'start_up' && e.checked === true
  );
  const showLunchPresentationComment = props.interestForm.events?.some(
    (e) => e.name === 'lunch_presentation' && e.checked === true
  );
  const showCompanyToCompanyComment = props.interestForm.events?.some(
    (e) => e.name === 'company_to_company' && e.checked === true
  );
  const showBedexComment = props.interestForm.events?.some(
    (e) => e.name === 'bedex' && e.checked === true
  );
  const showCompanyPresentation = props.interestForm.events?.some(
    (e) => e.name === 'company_presentation' && e.checked === true
  );

  return (
    <Content>
      <Form onSubmit={props.handleSubmit(onSubmit)}>
        <FlexRow alignItems="center" justifyContent="space-between">
          <h1 className={styles.mainHeading}>{labels.mainHeading[language]}</h1>
          <Link
            to={isEnglish ? '/interesse' : '/register-interest'}
            style={{
              display: props.edit ? 'none' : 'block',
            }}
          >
            <LanguageFlag language={language} />
          </Link>
        </FlexRow>
        <h5 className={styles.subHeading}>
          {labels.subHeading[language]}
          <a href={'mailto:bedriftskontakt@abakus.no'}>
            bedriftskontakt@abakus.no
          </a>
        </h5>
        <Field
          name="company"
          label={labels.company.header[language]}
          placeholder={labels.company.placeholder[language]}
          filter={['companies.company']}
          fieldClassName={styles.metaField}
          component={withAutocomplete({
            WrappedComponent: SelectInput.Field,
            retainFailedQuery: true,
          })}
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
        <Flex column className={styles.interestBox}>
          <label htmlFor="companyType" className={styles.heading}>
            {labels.companyTypes[language]}
          </label>
          <RadioButtonGroup name="companyType">
            {Object.keys(COMPANY_TYPES).map((key, index) => (
              <Field
                key={key}
                name={key}
                label={COMPANY_TYPES[key][language]}
                component={RadioButton.Field}
                inputValue={key}
              />
            ))}
          </RadioButtonGroup>
        </Flex>
        <Flex column className={styles.interestBox}>
          <label htmlFor="officeInTrondheim" className={styles.heading}>
            {labels.officeInTrondheim[language]}
          </label>
          <RadioButtonGroup name="officeInTrondheim">
            {Object.keys(OFFICE_IN_TRONDHEIM).map((key, index) => (
              <Field
                key={key}
                name={key}
                label={OFFICE_IN_TRONDHEIM[key][language]}
                component={RadioButton.Field}
                inputValue={key === 'true'}
                normalize={(value) => value === 'true'}
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
                renderDirection="right"
                content={
                  <span>
                    {language === 'norwegian'
                      ? 'Dette er temaer fra bedriftsundersøkelsen som studenter uttrykte interesse for å lære mer om. Vil noen av disse være av interesse å inkludere for dere? (Uforpliktende)'
                      : 'These are topics from the company survey that students expressed interest in learning more about. Would any of these be of interest to you to include? (Non-binding)'}
                  </span>
                }
              >
                <Icon name="alert-circle-outline" />
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
              {Object.keys(PARTICIPANT_RANGE_TYPES).map((key, index) => (
                <Field
                  key={key}
                  name={key}
                  label={PARTICIPANT_RANGE_TYPES[key]}
                  component={RadioButton.Field}
                  inputValue={key}
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
        {showCompanyPresentation && (
          <div className={styles.topline}>
            <p>{interestText.companyPresentationDescription[language]}</p>
            <Field
              placeholder={interestText.companyPresentationComment[language]}
              name="companyPresentationComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.company_presentation[language]}
              required
            />
          </div>
        )}
        {showLunchPresentationComment && (
          <div className={styles.topline}>
            <p>{interestText.lunchPresentationDescriptiont[language]}</p>
            <Field
              placeholder={interestText.lunchPresentationComment[language]}
              name="lunchPresentationComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.lunch_presentation[language]}
              required
            />
          </div>
        )}
        {showCourseComment && (
          <div className={styles.topline}>
            <p>{interestText.courseDescription[language]}</p>
            <Field
              placeholder={interestText.courseComment[language]}
              name="courseComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.course[language]}
              required
            />
          </div>
        )}

        {showBreakfastTalkComment && (
          <div className={styles.topline}>
            <p>{interestText.breakfastTalkDescription[language]}</p>
            <Field
              placeholder={interestText.breakfastTalkComment[language]}
              name="breakfastTalkComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.breakfast_talk[language]}
              required
            />
          </div>
        )}
        {showBedexComment && (
          <div className={styles.topline}>
            <p>{interestText.bedexDescription[language]}</p>
            <Field
              placeholder={interestText.bedexComment[language]}
              name="bedexComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.bedex[language]}
              required
            />
          </div>
        )}

        {showOtherEventComment && (
          <div className={styles.topline}>
            <p>{interestText.otherEventDescription[language]}</p>
            <Field
              placeholder={interestText.otherEventComment[language]}
              name="otherEventComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.other[language]}
              required
            />
          </div>
        )}

        {showStartupComment && (
          <div className={styles.topline}>
            <p>{interestText.startUpDescription[language]}</p>
            <Field
              placeholder={interestText.startUpComment[language]}
              name="startupComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.start_up[language]}
              required
            />
          </div>
        )}

        {showCompanyToCompanyComment && (
          <div className={styles.topline}>
            <p>{interestText.companyToCompanyDescription[language]}</p>
            <Field
              placeholder={interestText.companyToCompanyComment[language]}
              name="companyToCompanyComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={EVENT_TYPES.company_to_company[language]}
              required
            />
          </div>
        )}

        <div className={styles.topline}>
          <b>{interestText.priorityReasoningTitle[language]}</b>
          <br />
          {interestText.priorityReasoning[language]}
        </div>

        <Flex column className={styles.content}>
          <Button success={props.edit} type="submit" submit>
            {props.edit
              ? 'Oppdater bedriftsinteresse'
              : labels.create[language]}
          </Button>
        </Flex>
      </Form>
    </Content>
  );
};

const validate = createValidator({
  company: [required()],
  contactPerson: [required()],
  mail: [required(), isEmail()],
  phone: [required()],
  comment: [required()],
});
export default reduxForm({
  form: 'CompanyInterestForm',
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(CompanyInterestPage);
