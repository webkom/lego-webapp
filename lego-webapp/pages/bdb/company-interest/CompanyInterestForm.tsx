import { Card, Flex, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import arrayMutators from 'final-form-arrays';
import { Field, FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import english from '~/assets/flags/great_britain.svg';
import norwegian from '~/assets/flags/norway.svg';
import { ContentMain } from '~/components/Content';
import {
  Form,
  TextEditor,
  TextInput,
  LegoFinalForm,
  CheckBox,
  SelectInput,
  RadioButton,
  MultiSelectGroup,
} from '~/components/Form';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import { readmeIfy } from '~/components/ReadmeLogo';
import {
  fetchSemesters,
  fetchSemestersForInterestform,
} from '~/redux/actions/CompanyActions';
import {
  createCompanyInterest,
  fetchCompanyInterest,
  updateCompanyInterest,
} from '~/redux/actions/CompanyInterestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCompanyInterestById } from '~/redux/slices/companyInterest';
import {
  selectAllCompanySemesters,
  selectCompanySemestersForInterestForm,
} from '~/redux/slices/companySemesters';
import { spyValues } from '~/utils/formSpyUtils';
import { useParams } from '~/utils/useParams';
import {
  createValidator,
  required,
  isEmail,
  requiredIf,
} from '~/utils/validation';
import styles from './CompanyInterestForm.module.css';
import {
  EVENTS,
  OTHER_OFFERS,
  SURVEY_OFFERS,
  TARGET_GRADES,
  FORM_LABELS,
  COLLABORATION_TYPES,
  COMPANY_TYPES,
  TOOLTIP,
} from './Translations';
import {
  interestText,
  semesterToText,
  targetGradeToString,
  eventToString,
  surveyOffersToString,
  otherOffersToString,
  collaborationToString,
  PARTICIPANT_RANGE_MAP,
  sortSemesterChronologically,
  PARTICIPANT_RANGE_TYPES,
} from './utils';
import type { ReactNode } from 'react';
import type { DetailedCompanyInterest } from '~/redux/models/CompanyInterest';
import type CompanySemester from '~/redux/models/CompanySemester';

const SemesterBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <Flex column gap="var(--spacing-md)">
    {fields.map((item, index) => (
      <Field
        key={`semesters[${index}]`}
        name={`semesters[${index}].checked`}
        label={semesterToText({ ...fields.value[index], language })}
        type="checkbox"
        component={CheckBox.Field}
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
  <Flex column gap="var(--spacing-md)">
    {fields.map((item, index) => (
      <Field
        key={`companyCourseThemes[${index}]`}
        name={`companyCourseThemes[${index}].checked`}
        label={SURVEY_OFFERS[surveyOffersToString(item)][language]}
        type="checkbox"
        component={CheckBox.Field}
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
      if (!props.values.officeInTrondheim) {
        fields.forEach((field, index) => {
          if (fields.value[index].name == 'company_to_company') {
            filteredFields.splice(index, 1);
          }
        });
      }
      return (
        <Flex column gap="var(--spacing-md)">
          {filteredFields.map((key, index) => (
            <Field
              key={`events[${index}]`}
              name={`events[${index}].checked`}
              label={EVENTS[eventToString(key)][language]}
              type="checkbox"
              component={CheckBox.Field}
              description={TOOLTIP[eventToString(key)][language]}
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
  <Flex column gap="var(--spacing-md)">
    {fields.map((key, index) => (
      <Field
        key={`targetGrades[${index}]`}
        name={`targetGrades[${index}].checked`}
        label={TARGET_GRADES[targetGradeToString(key)][language]}
        type="checkbox"
        component={CheckBox.Field}
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
  <Flex column gap="var(--spacing-md)">
    {fields.map((key, index) => (
      <Field
        key={`otherOffers[${index}]`}
        name={`otherOffers[${index}].checked`}
        label={readmeIfy(OTHER_OFFERS[otherOffersToString(key)][language])}
        type="checkbox"
        component={CheckBox.Field}
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
  <Flex column gap="var(--spacing-md)">
    {fields.map((key, index) => (
      <Field
        key={`collaborations[${index}]`}
        name={`collaborations[${index}].checked`}
        label={COLLABORATION_TYPES[collaborationToString(key)][language]}
        type="checkbox"
        component={CheckBox.Field}
      />
    ))}
  </Flex>
);

const LanguageFlag = ({ language }: { language: 'english' | 'norwegian' }) => (
  <img
    src={language === 'english' ? norwegian : english}
    className={styles.flag}
    alt={language === 'english' ? 'Flag of Britain' : 'Norges flagg'}
  />
);

type CompanyInterestFormEntity = {
  companyName: string;
  company: number | null | undefined;
  contactPerson: string;
  mail: string;
  phone: string;
  semesters: Array<CompanySemester & { checked: boolean }>;
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
  wantsThursdayEvent: boolean;
};

const requiredIfEventType = (eventType: string) =>
  requiredIf((allValues) => {
    const event = allValues.events.filter(
      (event) => event.name === eventType,
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
  events: [required()],
  semesters: [required()],
  breakfastTalkComment: [requiredIfEventType('breakfast_talk')],
  companyPresentationComment: [requiredIfEventType('company_presentation')],
  lunchPresentationComment: [requiredIfEventType('lunsh_presentation')],
  courseComment: [requiredIfEventType('course')],
  bedexComment: [requiredIfEventType('bedex')],
  otherEventComment: [requiredIfEventType('other')],
  startupComment: [requiredIfEventType('start_up')],
  companyToCompanyComment: [requiredIfEventType('company_to_company')],
});

type Props = {
  language: 'english' | 'norwegian';
};

const CompanyInterestForm = ({ language }: Props) => {
  const { companyInterestId } = useParams();
  const edit = companyInterestId !== undefined;
  const companyInterest = useAppSelector((state) =>
    selectCompanyInterestById<DetailedCompanyInterest>(
      state,
      companyInterestId,
    ),
  );
  const semesters = useAppSelector((state) => {
    if (edit) {
      return selectAllCompanySemesters(state);
    }
    return selectCompanySemestersForInterestForm(state);
  });

  const allowedBdb = useAppSelector((state) => state.allowed.bdb);

  const isEnglish = language === 'english';

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchCompanyInterestPage',
    () =>
      Promise.allSettled([
        edit && dispatch(fetchSemesters()),
        edit &&
          companyInterestId &&
          dispatch(fetchCompanyInterest(companyInterestId)),
        !edit && dispatch(fetchSemestersForInterestform()),
      ]),
    [companyInterestId, edit],
  );

  const allEvents = Object.keys(EVENTS);
  const allOtherOffers = Object.keys(OTHER_OFFERS);
  const allCollaborations = Object.keys(COLLABORATION_TYPES);
  const allTargetGrades = Object.keys(TARGET_GRADES);
  const allParticipantRanges = Object.keys(PARTICIPANT_RANGE_MAP);
  const allSurveyOffers = Object.keys(SURVEY_OFFERS);
  const participantRange =
    allParticipantRanges.filter(
      (p) =>
        PARTICIPANT_RANGE_MAP[p][0] === companyInterest?.participantRangeStart,
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
    officeInTrondheim: companyInterest?.officeInTrondheim || false,
    wantsThursdayEvent: companyInterest?.wantsThursdayEvent || false,
    semesters: edit
      ? semesters
          .map((semester) => ({
            ...semester,
            checked: companyInterest?.semesters?.includes(semester.id),
          }))
          .filter((semester) => semester.activeInterestForm || semester.checked)
          .sort(sortSemesterChronologically)
      : semesters
          .map((semester) => ({
            ...semester,
            checked: false,
          }))
          .sort(sortSemesterChronologically),
  };

  if (edit && !companyInterest) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = async (data: CompanyInterestFormEntity) => {
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
      wantsThursdayEvent: data.wantsThursdayEvent,
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

    dispatch(
      edit
        ? updateCompanyInterest(companyInterestId, newData)
        : createCompanyInterest(newData, isEnglish),
    ).then(() => {
      navigate(
        allowedBdb ? '/bdb/company-interest' : '/pages/bedrifter/for-bedrifter',
      );
    });
  };

  const eventTypeEntities = [
    {
      name: 'company_presentation',
      translated: EVENTS.company_presentation[language],
      description: interestText.companyPresentationDescription[language],
      commentName: 'companyPresentationComment',
      commentPlaceholder: interestText.companyPresentationComment[language],
    },
    {
      name: 'lunch_presentation',
      translated: EVENTS.lunch_presentation[language],
      description: interestText.lunchPresentationDescriptiont[language],
      commentName: 'lunchPresentationComment',
      commentPlaceholder: interestText.lunchPresentationComment[language],
    },
    {
      name: 'course',
      translated: EVENTS.course[language],
      description: interestText.courseDescription[language],
      commentName: 'courseComment',
      commentPlaceholder: interestText.courseComment[language],
    },
    {
      name: 'breakfast_talk',
      translated: EVENTS.breakfast_talk[language],
      description: interestText.breakfastTalkDescription[language],
      commentName: 'breakfastTalkComment',
      commentPlaceholder: interestText.breakfastTalkComment[language],
    },
    {
      name: 'bedex',
      translated: EVENTS.bedex[language],
      description: interestText.bedexDescription[language],
      commentName: 'bedexComment',
      commentPlaceholder: interestText.bedexComment[language],
    },
    {
      name: 'other',
      translated: EVENTS.other[language],
      description: interestText.otherEventDescription[language],
      commentName: 'otherEventComment',
      commentPlaceholder: interestText.otherEventComment[language],
    },
    // {
    //   name: 'start_up',
    //   translated: EVENTS.start_up[language],
    //   description: interestText.startUpDescription[language],
    //   commentName: 'startupComment',
    //   commentPlaceholder: interestText.startUpComment[language],
    // },
    {
      name: 'company_to_company',
      translated: EVENTS.company_to_company[language],
      description: interestText.companyToCompanyDescription[language],
      commentName: 'companyToCompanyComment',
      commentPlaceholder: interestText.companyToCompanyComment[language],
    },
  ];

  const title = edit ? 'Bedriftsinteresse' : FORM_LABELS.mainHeading[language];

  return (
    <Page
      title={title}
      back={allowedBdb ? { href: '/bdb/company-interest' } : undefined}
      actionButtons={
        !edit && (
          <a href={isEnglish ? '/interesse' : '/register-interest'}>
            <LanguageFlag language={language} />
          </a>
        )
      }
    >
      <Helmet title={title} />

      <ContentMain>
        {!edit && (
          <Card severity="info">
            {FORM_LABELS.subHeading[language]}
            <a href="mailto:bedriftskontakt@abakus.no">
              bedriftskontakt@abakus.no
            </a>
          </Card>
        )}
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
            <Form onSubmit={handleSubmit}>
              <Field
                name="company"
                label={FORM_LABELS.company.header[language]}
                placeholder={FORM_LABELS.company.placeholder[language]}
                filter={['companies.company']}
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
                placeholder={FORM_LABELS.mail.placeholder[language]}
                name="mail"
                component={TextInput.Field}
                required
              />
              <Field
                label={FORM_LABELS.phone[language]}
                placeholder={FORM_LABELS.phone.placeholder[language]}
                name="phone"
                component={TextInput.Field}
                required
              />

              <Flex wrap justifyContent="space-between">
                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    required
                    legend={FORM_LABELS.companyTypes[language]}
                    name="companyType"
                  >
                    {Object.keys(COMPANY_TYPES).map((key) => (
                      <Field
                        key={key}
                        name={key}
                        value={key}
                        label={COMPANY_TYPES[key][language]}
                        type="radio"
                        component={RadioButton.Field}
                        showErrors={false}
                      />
                    ))}
                  </MultiSelectGroup>
                </Flex>
                <Flex
                  column
                  className={styles.interestBox}
                  gap="var(--spacing-md)"
                >
                  <Field
                    name="officeInTrondheim"
                    component={ToggleSwitch.Field}
                    label={FORM_LABELS.officeInTrondheim[language]}
                  />
                  <Field
                    name="wantsThursdayEvent"
                    component={ToggleSwitch.Field}
                    label={FORM_LABELS.wantsThursdayEvent[language]}
                    description={FORM_LABELS.wantsThursdayEventInfo[language]}
                  />
                </Flex>
                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    name="companyCourseThemes"
                    legend={FORM_LABELS.companyCourseThemes[language]}
                    description={FORM_LABELS.companyCourseThemesInfo[language]}
                  >
                    <FieldArray
                      name="companyCourseThemes"
                      language={language}
                      component={SurveyOffersBox}
                    />
                  </MultiSelectGroup>
                </Flex>
              </Flex>
              <Field
                placeholder={interestText.comment[language]}
                name="comment"
                component={TextEditor.Field}
                rows={10}
                className={styles.textEditor}
                label={FORM_LABELS.comment[language]}
                required
              />
              <div className={styles.topline} />
              <Flex wrap justifyContent="space-between" gap="var(--spacing-md)">
                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    name="semesters"
                    legend={FORM_LABELS.semesters[language]}
                    required
                  >
                    <FieldArray
                      name="semesters"
                      language={language}
                      component={SemesterBox}
                    />
                  </MultiSelectGroup>
                </Flex>
                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    name="events"
                    legend={FORM_LABELS.events[language]}
                    required
                  >
                    <FieldArray
                      name="events"
                      language={language}
                      component={EventBox}
                    />
                  </MultiSelectGroup>
                </Flex>
                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    name="collaborations"
                    legend={FORM_LABELS.collaborations[language]}
                  >
                    <FieldArray
                      name="collaborations"
                      language={language}
                      component={CollaborationBox}
                    />
                  </MultiSelectGroup>
                </Flex>
              </Flex>

              <Flex wrap justifyContent="space-between">
                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    name="targetGrades"
                    legend={FORM_LABELS.targetGrades[language]}
                  >
                    <FieldArray
                      name="targetGrades"
                      language={language}
                      component={TargetGradeBox}
                    />
                  </MultiSelectGroup>
                </Flex>

                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    name="participantRange"
                    legend={FORM_LABELS.participantRange[language]}
                  >
                    {Object.keys(PARTICIPANT_RANGE_TYPES).map((key) => (
                      <Field
                        key={key}
                        name={key}
                        value={key}
                        label={PARTICIPANT_RANGE_TYPES[key]}
                        type="radio"
                        component={RadioButton.Field}
                      />
                    ))}
                  </MultiSelectGroup>
                </Flex>
                <Flex column className={styles.interestBox}>
                  <MultiSelectGroup
                    name="otherOffers"
                    legend={FORM_LABELS.otherOffers[language]}
                  >
                    <FieldArray
                      name="otherOffers"
                      language={language}
                      component={OtherBox}
                    />
                  </MultiSelectGroup>
                </Flex>
              </Flex>
              <div className={styles.topline} />
              <div>
                <h3>{FORM_LABELS.eventDescriptionHeader[language]}</h3>
                <span>{FORM_LABELS.eventDescriptionIntro[language]}</span>
              </div>

              {eventTypeEntities.map((eventTypeEntity) => {
                return spyValues((values: CompanyInterestFormEntity) => {
                  const showComment = values.events?.some(
                    (e) =>
                      e.name === eventTypeEntity.name && e.checked === true,
                  );

                  return (
                    showComment && (
                      <>
                        <div className={styles.topline} />
                        <Flex alignItems="center" gap={2}>
                          <h3>{eventTypeEntity.translated}</h3>
                          <span className={styles.label}>*</span>
                        </Flex>

                        <p>{eventTypeEntity.description}</p>
                        <Field
                          placeholder={eventTypeEntity.commentPlaceholder}
                          name={eventTypeEntity.commentName}
                          component={TextEditor.Field}
                          rows={10}
                          className={styles.textEditor}
                        />
                      </>
                    )
                  );
                });
              })}

              {!edit && (
                <div>
                  <div className={styles.topline} />
                  <b>{interestText.priorityReasoningTitle[language]}</b>
                  <br />
                  {interestText.priorityReasoning[language]}
                </div>
              )}

              <SubmissionError />

              <SubmitButton>
                {edit
                  ? 'Oppdater bedriftsinteresse'
                  : FORM_LABELS.create[language]}
              </SubmitButton>
            </Form>
          )}
        </LegoFinalForm>
      </ContentMain>
    </Page>
  );
};

export default CompanyInterestForm;
