import { LoadingIndicator } from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import { type ReactNode } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import english from 'app/assets/great_britain.svg';
import norwegian from 'app/assets/norway.svg';
import Card from 'app/components/Card';
import { Content } from 'app/components/Content';
import { FlexRow } from 'app/components/FlexBox';
import {
  TextEditor,
  TextInput,
  CheckBox,
  SelectInput,
  RadioButton,
  MultiSelectGroup,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import Flex from 'app/components/Layout/Flex';
import { readmeIfy } from 'app/components/ReadmeLogo';
import Tooltip from 'app/components/Tooltip';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { spyValues } from 'app/utils/formSpyUtils';
import {
  createValidator,
  required,
  isEmail,
  requiredIf,
} from 'app/utils/validation';
import { interestText, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import {
  COLLABORATION_TYPES,
  EVENTS,
  README,
  SURVEY_OFFERS,
  TARGET_GRADES,
  FORM_LABELS,
  COMPANY_TYPES,
  OFFICE_IN_TRONDHEIM,
} from './Translations';

export const PARTICIPANT_RANGE_TYPES = {
  first: '10-30',
  second: '30-60',
  third: '60-100',
  fourth: '100+',
};

export const PARTICIPANT_RANGE_MAP = {
  first: [10, 40],
  second: [30, 60],
  third: [60, 100],
  fourth: [100, null],
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

const eventToString = (event) =>
  Object.keys(EVENTS)[Number(event.charAt(event.length - 2))];

const surveyOffersToString = (offer) =>
  Object.keys(SURVEY_OFFERS)[Number(offer.charAt(offer.length - 2))];

const otherOffersToString = (offer) =>
  Object.keys(README)[Number(offer.charAt(offer.length - 2))];

const collaborationToString = (collab) =>
  Object.keys(COLLABORATION_TYPES)[Number(collab.charAt(collab.length - 2))];

const targetGradeToString = (targetGrade) =>
  Object.keys(TARGET_GRADES)[
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
        label={SURVEY_OFFERS[surveyOffersToString(item)][language]}
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
  <FormSpy subscription={{ values: true }}>
    {(props) => {
      const filteredFields = fields.map((field) => field); // This is just to get an array instead of what fields is (which is an object that mimics an iterable). See: https://github.com/final-form/react-final-form-arrays#fieldarrayrenderprops
      if (props.values.officeInTrondheim !== 'yes') {
        fields.forEach((field, index) => {
          if (fields.value[index].name == 'company_to_company') {
            filteredFields.splice(index, 1);
          }
        });
      }
      return (
        <Flex column className={styles.checkboxWrapper}>
          {filteredFields.map((key, index) => (
            <Field
              key={`events[${index}]`}
              name={`events[${index}].checked`}
              label={EVENTS[eventToString(key)][language]}
              type="checkbox"
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          ))}
        </Flex>
      );
    }}
  </FormSpy>
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
        label={TARGET_GRADES[targetGradeToString(key)][language]}
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
        label={readmeIfy(README[otherOffersToString(key)][language])}
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

const requiredIfEventType = (eventType: string) =>
  requiredIf((allValues) => {
    const event = allValues.events.filter(
      (event) => event.name === eventType
    )[0];
    return event && event.checked;
  });

const validateCompany = (value) => {
  if (!value) {
    return [false, 'Du må velge en bedrift'] as const;
  } else if (value['__isNew__'] || !value.value) {
    return [!!value.label, 'Ny bedrift må ha et navn'] as const;
  } else {
    return [!isNaN(Number(value?.value)), 'Ugyldig bedrift'] as const;
  }
};

const validate = createValidator({
  company: [validateCompany],
  contactPerson: [required()],
  mail: [required(), isEmail()],
  phone: [required()],
  comment: [required()],
  companyType: [required()],
  officeInTrondheim: [required()],
  events: [required()],
  breakfastTalkComment: [requiredIfEventType('breakfast_talk')],
  companyPresentationComment: [requiredIfEventType('company_presentation')],
  lunchPresentationComment: [requiredIfEventType('lunsh_presentation')],
  courseComment: [requiredIfEventType('course')],
  bedexComment: [requiredIfEventType('bedex')],
  otherEventComment: [requiredIfEventType('other')],
  startupComment: [requiredIfEventType('start_up')],
  companyToCompanyComment: [requiredIfEventType('company_to_company')],
});

const CompanyInterestPage = (props: Props) => {
  if (props.edit && !props.companyInterest) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (data) => {
    const { company } = data;
    const nameOnly = company['__isNew__'] || !company.value;
    const companyId = nameOnly ? null : Number(company['value']);
    const companyName = nameOnly ? company['label'] : '';

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
      );
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
              <h1>{FORM_LABELS.mainHeading[language]}</h1>
              {!props.edit && (
                <Link to={isEnglish ? '/interesse' : '/register-interest'}>
                  <LanguageFlag language={language} />
                </Link>
              )}
            </FlexRow>
            <Card severity="info">
              {FORM_LABELS.subHeading[language]}
              <a href={'mailto:bedriftskontakt@abakus.no'}>
                bedriftskontakt@abakus.no
              </a>
            </Card>

            <Field
              name="company"
              label={FORM_LABELS.company.header[language]}
              placeholder={FORM_LABELS.company.placeholder[language]}
              filter={['companies.company']}
              fieldClassName={styles.metaField}
              component={SelectInput.AutocompleteField}
              creatable
              required
            />
            <Field
              label={FORM_LABELS.contactPerson.header[language]}
              placeholder={FORM_LABELS.contactPerson.placeholder[language]}
              name="contactPerson"
              component={TextInput.Field}
              required
            />
            <Field
              label={FORM_LABELS.mail[language]}
              placeholder="example@gmail.com"
              name="mail"
              component={TextInput.Field}
              required
            />
            <Field
              label={FORM_LABELS.phone[language]}
              placeholder="+47 909 09 090"
              name="phone"
              component={TextInput.Field}
              required
            />

            <Flex wrap justifyContent="space-between">
              <Flex column className={styles.interestBox}>
                <label htmlFor="companyType" className={styles.heading}>
                  {FORM_LABELS.companyTypes[language]}
                </label>
                <MultiSelectGroup name="companyType">
                  {Object.keys(COMPANY_TYPES).map((key) => (
                    <Field
                      key={key}
                      name={key}
                      label={COMPANY_TYPES[key][language]}
                      type="radio"
                      component={RadioButton.Field}
                      value={key}
                      showErrors={false}
                    />
                  ))}
                </MultiSelectGroup>
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="officeInTrondheim" className={styles.heading}>
                  {FORM_LABELS.officeInTrondheim[language]}
                </label>
                <MultiSelectGroup name="officeInTrondheim">
                  {Object.keys(OFFICE_IN_TRONDHEIM).map((key) => (
                    <Field
                      key={key}
                      name={key}
                      label={OFFICE_IN_TRONDHEIM[key][language]}
                      type="radio"
                      component={RadioButton.Field}
                      value={key}
                      showErrors={false}
                    />
                  ))}
                </MultiSelectGroup>
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="companyCourseThemes" className={styles.heading}>
                  <Flex alignItems="center" gap="5px">
                    {FORM_LABELS.companyCourseThemes[language]}
                    <Tooltip
                      className={styles.tooltip}
                      content={
                        <span>
                          {language === 'norwegian'
                            ? 'Dette er temaer som studenter har uttrykt interesse for å lære mer om i vår bedriftsundersøkelse. Kryss av for de temaene dere kan ønske å holde kurs om eller snakke om på deres presentasjoner. (Uforpliktende)'
                            : 'These are topics that students expressed interest in learning more about in our company survey. Check off the topics that you might be interested in arranging a course or workshop about or talk about in your presentations. (Non-binding)'}
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
            <div className={styles.topline} />
            <Field
              placeholder={interestText.comment[language]}
              name="comment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={FORM_LABELS.comment[language]}
              required
            />
            <Flex wrap justifyContent="space-between">
              <Flex column className={styles.interestBox}>
                <label htmlFor="semesters" className={styles.heading}>
                  {FORM_LABELS.semester[language]}
                </label>
                <FieldArray
                  label="semesters"
                  name="semesters"
                  language={language}
                  component={SemesterBox}
                />
              </Flex>
              <MultiSelectGroup name="events">
                <Flex column className={styles.interestBox}>
                  <label htmlFor="events" className={styles.heading}>
                    {FORM_LABELS.events[language]}
                  </label>
                  <FieldArray
                    name="events"
                    language={language}
                    component={EventBox}
                  />
                </Flex>
              </MultiSelectGroup>
              <Flex column className={styles.interestBox}>
                <label htmlFor="collaborations" className={styles.heading}>
                  {FORM_LABELS.collaborations[language]}
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
                  {FORM_LABELS.targetGrades[language]}
                </label>
                <FieldArray
                  name="targetGrades"
                  language={language}
                  component={TargetGradeBox}
                />
              </Flex>

              <Flex column className={styles.interestBox}>
                <label htmlFor="participantRange" className={styles.heading}>
                  {FORM_LABELS.participantRange[language]}
                </label>
                <MultiSelectGroup name="participantRange">
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
                </MultiSelectGroup>
              </Flex>
              <Flex column className={styles.interestBox}>
                <label htmlFor="otherOffers" className={styles.heading}>
                  {FORM_LABELS.otherOffers[language]}
                </label>
                <FieldArray
                  name="otherOffers"
                  language={language}
                  component={OtherBox}
                />
              </Flex>
            </Flex>
            <h3 className={styles.topline}>
              {FORM_LABELS.eventDescriptionHeader[language]}
            </h3>
            <p>{FORM_LABELS.eventDescriptionIntro[language]}</p>

            {spyValues((values: CompanyInterestFormEntity) => {
              const showCompanyPresentation = values.events?.some(
                (e) => e.name === 'company_presentation' && e.checked === true
              );

              return (
                showCompanyPresentation && (
                  <div className={styles.topline}>
                    <Flex alignItems="center" gap={1}>
                      <h4>{EVENTS.company_presentation[language]}</h4>
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
                      <h4>{EVENTS.lunch_presentation[language]}</h4>
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
                      <h4>{EVENTS.course[language]}</h4>
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
                      <h4>{EVENTS.breakfast_talk[language]}</h4>
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
                      <h4>{EVENTS.bedex[language]}</h4>
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
                      <h4>{EVENTS.other[language]}</h4>
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
                      <h4>{EVENTS.start_up[language]}</h4>
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
                      <h4>{EVENTS.company_to_company[language]}</h4>
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

            <SubmissionError />
            <SubmitButton>
              {props.edit
                ? 'Oppdater bedriftsinteresse'
                : FORM_LABELS.create[language]}
            </SubmitButton>
          </form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default CompanyInterestPage;
