import { Card, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import { useEffect, type ReactNode } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom-v5-compat';
import { push } from 'redux-first-history';
import { SubmissionError } from 'redux-form';
import {
  fetchSemesters,
  fetchSemestersForInterestform,
} from 'app/actions/CompanyActions';
import {
  createCompanyInterest,
  fetchCompanyInterest,
  updateCompanyInterest,
} from 'app/actions/CompanyInterestActions';
import english from 'app/assets/great_britain.svg';
import norwegian from 'app/assets/norway.svg';
import { Content } from 'app/components/Content';
import { FlexRow } from 'app/components/FlexBox';
import {
  TextEditor,
  TextInput,
  Button,
  LegoFinalForm,
  CheckBox,
  SelectInput,
  RadioButton,
  RadioButtonGroup,
} from 'app/components/Form';
import { Image } from 'app/components/Image';
import { readmeIfy } from 'app/components/ReadmeLogo';
import Tooltip from 'app/components/Tooltip';
import { selectCompanyInterestById } from 'app/reducers/companyInterest';
import {
  selectCompanySemesters,
  type CompanySemesterEntity,
  selectCompanySemestersForInterestForm,
} from 'app/reducers/companySemesters';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { spySubmittable, spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required, isEmail } from 'app/utils/validation';
import {
  interestText,
  semesterToText,
  labels,
  TARGET_GRADE_TYPES,
  EVENT_TYPES,
  targetGradeToString,
  eventToString,
  SURVEY_OFFER_TYPES,
  surveyOffersToString,
  OTHER_TYPES,
  otherOffersToString,
  COLLABORATION_TYPES,
  collaborationToString,
  PARTICIPANT_RANGE_MAP,
  sortSemesterChronologically,
  PARTICIPANT_RANGE_TYPES,
  COMPANY_TYPES,
  OFFICE_IN_TRONDHEIM,
} from '../utils';
import styles from './CompanyInterest.css';

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
  officeInTrondheim: 'yes' | 'no';
};

const validate = createValidator({
  company: [required()],
  contactPerson: [required()],
  mail: [required(), isEmail()],
  phone: [required()],
  comment: [required()],
});

const CompanyInterestPage = () => {
  const { companyInterestId } = useParams();
  const edit = companyInterestId !== undefined;
  const companyInterest = useAppSelector((state) =>
    selectCompanyInterestById(state, { companyInterestId })
  );
  const semesters = useAppSelector((state) => {
    if (edit) {
      return selectCompanySemesters(state);
    }
    return selectCompanySemestersForInterestForm(state);
  });

  const allowedBdb = useAppSelector((state) => state.allowed.bdb);

  const { pathname } = useLocation();
  const language = pathname === '/register-interest' ? 'english' : 'norwegian';
  const isEnglish = language === 'english';

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (edit) {
      dispatch(fetchSemesters());
      dispatch(fetchCompanyInterest(companyInterestId));
    } else {
      dispatch(fetchSemestersForInterestform());
    }
  }, [companyInterestId, dispatch, edit]);

  const allEvents = Object.keys(EVENT_TYPES);
  const allOtherOffers = Object.keys(OTHER_TYPES);
  const allCollaborations = Object.keys(COLLABORATION_TYPES);
  const allTargetGrades = Object.keys(TARGET_GRADE_TYPES);
  const allParticipantRanges = Object.keys(PARTICIPANT_RANGE_MAP);
  const allSurveyOffers = Object.keys(SURVEY_OFFER_TYPES);
  const participantRange =
    allParticipantRanges.filter(
      (p) =>
        PARTICIPANT_RANGE_MAP[p][0] === companyInterest?.participantRangeStart
    ) || null;

  const initialValues: CompanyInterestFormEntity = {
    ...companyInterest,
    company: companyInterest?.company
      ? {
          label: companyInterest.company.name,
          title: companyInterest.company.name,
          value: '' + companyInterest.company.id,
        }
      : {
          label: companyInterest?.companyName,
          title: companyInterest?.companyName,
        },
    events: allEvents.map((event) => ({
      name: event,
      checked: companyInterest?.events.includes(event) || false,
    })),
    companyCourseThemes: allSurveyOffers.map((offer) => ({
      name: offer,
      checked: companyInterest?.companyCourseThemes?.includes(offer) || false,
    })),
    otherOffers: allOtherOffers.map((offer) => ({
      name: offer,
      checked: companyInterest?.otherOffers?.includes(offer) || false,
    })),
    collaborations: allCollaborations.map((collab) => ({
      name: collab,
      checked: companyInterest?.collaborations?.includes(collab) || false,
    })),
    targetGrades: allTargetGrades.map((targetGrade) => ({
      name: targetGrade,
      checked:
        companyInterest?.targetGrades?.includes(Number(targetGrade)) || false,
    })),
    participantRange: (participantRange && participantRange[0]) || null,
    officeInTrondheim: companyInterest?.officeInTrondheim ? 'yes' : 'no',
    semesters: edit
      ? semesters
          .map((semester) => ({
            ...semester,
            checked: companyInterest?.semesters?.includes(semester.id),
          }))
          .filter((semester) => semester.activeInterestForm || semester.checked)
          .sort(sortSemesterChronologically)
      : semesters.sort(sortSemesterChronologically),
  };

  if (edit && !companyInterest) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = async (data: CompanyInterestFormEntity) => {
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

    try {
      if (edit) {
        await dispatch(updateCompanyInterest(companyInterestId, newData));
      } else {
        await dispatch(createCompanyInterest(newData, isEnglish));
      }

      dispatch(
        push(
          allowedBdb ? '/companyInterest/' : '/pages/bedrifter/for-bedrifter'
        )
      );
    } catch (err) {
      if (err.payload && err.payload.response) {
        throw new SubmissionError(err.payload.response.jsonData);
      }
    }
  };

  return (
    <Content>
      <Helmet title={isEnglish ? 'Company interest' : 'Bedriftsinteresse'} />

      <LegoFinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
        subscription={{}}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <FlexRow alignItems="center" justifyContent="space-between">
              <h1>{labels.mainHeading[language]}</h1>
              {!edit && (
                <Link to={isEnglish ? '/interesse' : '/register-interest'}>
                  <LanguageFlag language={language} />
                </Link>
              )}
            </FlexRow>
            <Card severity="info">
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
              <Button secondary disabled={!submittable} submit>
                {edit ? 'Oppdater bedriftsinteresse' : labels.create[language]}
              </Button>
            ))}
          </form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default CompanyInterestPage;
