import { Card, Flex, Icon, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import arrayMutators from 'final-form-arrays';
import { gsap } from 'gsap';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import {
  CheckBox,
  Chip,
  Form,
  LegoFinalForm,
  MultiSelectGroup,
  RowSection,
  SelectInput,
  TextEditor,
  TextInput,
} from '~/components/Form';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import PillSwitch from '~/components/PillSwitch';
import { readmeIfy } from '~/components/ReadmeLogo';
import LatestReadme from '~/pages/index/_components/authenticated/LatestReadme';
import {
  fetchSemesters,
  fetchSemestersForInterestform,
} from '~/redux/actions/CompanyActions';
import {
  createCompanyInterest,
  fetchCompanyInterest,
  updateCompanyInterest,
} from '~/redux/actions/CompanyInterestActions';
import { fetchReadmes } from '~/redux/actions/FrontpageActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { CompanyInterestEventType } from '~/redux/models/CompanyInterest';
import { selectCompanyInterestById } from '~/redux/slices/companyInterest';
import {
  selectAllCompanySemesters,
  selectCompanySemestersForInterestForm,
} from '~/redux/slices/companySemesters';
import { spyValues } from '~/utils/formSpyUtils';
import { useParams } from '~/utils/useParams';
import {
  createValidator,
  isEmail,
  required,
  requiredIf,
} from '~/utils/validation';
import styles from './CompanyInterestForm.module.css';
import {
  COLLABORATION_DESCRIPTIONS,
  COLLABORATION_TYPES,
  COMPANY_TYPES,
  EVENTS,
  FORM_LABELS,
  OTHER_DESCRIPTIONS,
  OTHER_OFFERS,
  SURVEY_OFFERS,
  TARGET_GRADES,
  TOOLTIP,
} from './Translations';
import {
  collaborationDescriptionToString,
  collaborationToString,
  interestText,
  otherOffersToString,
  PARTICIPANT_RANGE_MAP,
  PARTICIPANT_RANGE_TYPES,
  semesterToText,
  sortSemesterChronologically,
  surveyOffersToString,
  targetGradeToString,
  othersDescriptionToString,
} from './utils';
import type { ReactNode } from 'react';
import type { PillSwitchOption } from '~/components/PillSwitch';

import type { DetailedCompanyInterest } from '~/redux/models/CompanyInterest';
import type CompanySemester from '~/redux/models/CompanySemester';

type Language = 'english' | 'norwegian';

const SECTIONS = [
  { id: 'contact', norwegian: 'Kontakt', english: 'Contact' },
  { id: 'about', norwegian: 'Om bedriften', english: 'About the company' },
  { id: 'wishes', norwegian: 'Ønsker', english: 'Your wishes' },
  { id: 'submit', norwegian: 'Send inn', english: 'Submit' },
] as const;

const FormSection = ({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}): ReactNode => (
  <section id={id} className={styles.sectionAnchor}>
    <Card shadow={false} className={styles.section}>
      <Flex
        alignItems="baseline"
        gap="var(--spacing-sm)"
        className={styles.sectionHeader}
      >
        <span className={styles.sectionNumber}>
          {String(number).padStart(2, '0')}
        </span>
        <h2>{title}</h2>
      </Flex>
      {children}
    </Card>
  </section>
);

const sectionsCompleted = (values: CompanyInterestFormEntity) => {
  const contact = !!(
    values.company?.label &&
    values.contactPerson &&
    values.mail &&
    values.phone
  );
  const about = !!(values.companyType && values.comment);
  const wishes = !!(
    values.semesters?.some((semester) => semester.checked) &&
    values.events?.some((event) => event.checked)
  );
  return [contact, about, wishes, contact && about && wishes];
};

const StepRail = ({ language }: { language: Language }): ReactNode => {
  const [activeIndex, setActiveIndex] = useState(0);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) {
      return;
    }

    gsap.set(fill, { '--rail-progress': 0 });
    const tweenProgress = gsap.quickTo(fill, '--rail-progress', {
      duration: 0.25,
      ease: 'power3.out',
    });

    const update = () => {
      const tops = SECTIONS.map(({ id }) => {
        const element = document.getElementById(id);
        return element
          ? element.getBoundingClientRect().top + window.scrollY
          : 0;
      });
      const probe = window.scrollY + window.innerHeight / 3;

      let index = 0;
      tops.forEach((top, i) => {
        if (probe >= top) {
          index = i;
        }
      });

      const next = tops[index + 1];
      const withinSection = next
        ? (probe - tops[index]) / Math.max(1, next - tops[index])
        : 0;

      setActiveIndex(index);
      tweenProgress(
        probe < tops[0]
          ? 0
          : Math.min(1, (index + withinSection) / (SECTIONS.length - 1)),
      );
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      gsap.killTweensOf(fill);
    };
  }, []);

  return spyValues((values: CompanyInterestFormEntity) => {
    const completed = sectionsCompleted(values);
    return (
      <nav className={styles.rail}>
        <span className={styles.railTrack} />
        <span ref={fillRef} className={styles.railTrackFill} />
        {SECTIONS.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cx(
              styles.railStep,
              index === activeIndex && styles.railStepActive,
            )}
          >
            <span
              className={cx(
                styles.railNode,
                completed[index] && styles.railNodeDone,
              )}
            >
              {index + 1}
              {completed[index] && (
                <span className={styles.railNodeFill}>
                  <Icon iconNode={<Check />} size={14} />
                </span>
              )}
            </span>
            {section[language]}
          </a>
        ))}
      </nav>
    );
  });
};

const SemesterBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <div className={styles.optionRow}>
    {fields.map((item, index) => (
      <Field
        key={`semesters[${index}]`}
        name={`semesters[${index}].checked`}
        label={semesterToText({ ...fields.value[index], language })}
        type="checkbox"
        component={Chip.Field}
      />
    ))}
  </div>
);

const SurveyOffersBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <div className={styles.optionRow}>
    {fields.map((item, index) => (
      <Field
        key={`companyCourseThemes[${index}]`}
        name={`companyCourseThemes[${index}].checked`}
        label={SURVEY_OFFERS[surveyOffersToString(item)][language]}
        type="checkbox"
        component={Chip.Field}
      />
    ))}
  </div>
);

const EventBox = ({
  fields,
  language,
  eventTypeEntities,
}: {
  fields: any;
  language: string;
  eventTypeEntities: EventTypeEntity[];
}): ReactNode => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => (
      <Flex column gap="var(--spacing-md)">
        <p className={styles.mutedText}>
          {FORM_LABELS.eventDescriptionIntro[language]}
        </p>
        {fields
          .map((item, index) => ({ name: fields.value[index].name, index }))
          .filter(
            ({ name }) =>
              values.officeInTrondheim || name !== 'company_to_company',
          )
          .map(({ name, index }) => {
            const entity = eventTypeEntities.find(
              (eventTypeEntity) => eventTypeEntity.name === name,
            );
            return (
              <div key={name} className={styles.eventOption}>
                <Field
                  name={`events[${index}].checked`}
                  label={EVENTS[name][language]}
                  type="checkbox"
                  component={CheckBox.Field}
                  description={TOOLTIP[name][language]}
                />
                {values.events?.[index]?.checked && entity?.commentName && (
                  <div className={styles.eventPitch}>
                    <p className={styles.mutedText}>{entity.description}</p>
                    <Field
                      placeholder={entity.commentPlaceholder}
                      name={entity.commentName}
                      label={FORM_LABELS.eventDescriptionHeader[language]}
                      component={TextEditor.Field}
                      rows={6}
                      className={styles.textEditor}
                      required
                    />
                  </div>
                )}
              </div>
            );
          })}
      </Flex>
    )}
  </FormSpy>
);

const TargetGradeBox = ({
  fields,
  language,
}: {
  fields: any;
  language: string;
}): ReactNode => (
  <div className={styles.optionRow}>
    {fields.map((key, index) => (
      <Field
        key={`targetGrades[${index}]`}
        name={`targetGrades[${index}].checked`}
        label={TARGET_GRADES[targetGradeToString(key)][language]}
        type="checkbox"
        component={Chip.Field}
      />
    ))}
  </div>
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
        description={
          OTHER_DESCRIPTIONS[othersDescriptionToString(key)][language]
        }
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
        description={
          COLLABORATION_DESCRIPTIONS[collaborationDescriptionToString(key)][
            language
          ]
        }
      />
    ))}
  </Flex>
);

const LANGUAGE_OPTIONS: PillSwitchOption<Language>[] = [
  { label: 'Norsk', value: 'norwegian' },
  { label: 'English', value: 'english' },
];

const LANGUAGE_ROUTES: Record<Language, string> = {
  norwegian: '/interesse',
  english: '/register-interest',
};

const LanguageSwitch = ({ language }: { language: Language }) => (
  <PillSwitch
    options={LANGUAGE_OPTIONS}
    value={language}
    onChange={(value) => navigate(LANGUAGE_ROUTES[value])}
    ariaLabel={language === 'english' ? 'Language' : 'Språk'}
  />
);
type CompanyObjectProps = {
  label: string | undefined;
  title: string | undefined;
  value?: string;
};

/**
 * The company the form starts on, or nothing at all when none is known.
 *
 * Returning an option with empty fields instead of nothing leaves the select
 * holding a value, and it only offers its placeholder while it holds none.
 */
const companySelection = (
  companyInterest?: DetailedCompanyInterest,
): CompanyObjectProps | undefined => {
  if (companyInterest?.company) {
    return {
      label: companyInterest.company.name,
      title: companyInterest.company.name,
      value: '' + companyInterest.company.id,
    };
  }

  if (companyInterest?.companyName) {
    return {
      label: companyInterest.companyName,
      title: companyInterest.companyName,
    };
  }

  return undefined;
};

type CompanyCheckBoxProps = {
  name: string;
  checked: boolean;
};
type CompanyInterestFormEntity = {
  companyName?: string;
  company?: CompanyObjectProps;
  contactPerson?: string;
  mail?: string;
  phone?: string;
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
  comment?: string;
  courseComment?: string;
  breakfastTalkComment?: string;
  otherEventComment?: string;
  startupComment?: string;
  lunchPresentationComment?: string;
  bedexComment?: string;
  companyToCompanyComment?: string;
  companyPresentationComment?: string;
  companyType?: string;
  officeInTrondheim: boolean;
  wantsThursdayEvent: boolean;
  participantRange: string | null;
  collaborations: CompanyCheckBoxProps[];
  targetGrades: CompanyCheckBoxProps[];
};
type EventTypeEntity = {
  name: string;
  translated: string;
  description: string;
  commentName?: string;
  commentPlaceholder?: string;
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
  language: Language;
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

  usePreparedEffect('fetchReadmes', () => dispatch(fetchReadmes(2)), [
    dispatch,
  ]);

  const allEvents = Object.keys(EVENTS) as CompanyInterestEventType[];
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
    company: companySelection(companyInterest),
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
            checked: !!companyInterest?.semesters?.includes(semester.id),
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
    const nameOnly = !company?.value || company['__isNew__'];
    const companyId = nameOnly ? null : Number(company.value);
    const companyName = nameOnly ? (company?.label ?? '') : '';

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

    if (edit && companyInterestId) {
      await dispatch(updateCompanyInterest(companyInterestId, newData));
    } else {
      await dispatch(createCompanyInterest(newData, isEnglish));
    }
    navigate(
      allowedBdb ? '/bdb/company-interest' : '/pages/bedrifter/for-bedrifter',
    );
  };

  const eventTypeEntities: EventTypeEntity[] = [
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
    {
      name: 'collaboration_revue',
      translated: COLLABORATION_TYPES.collaboration_revue[language],
      description: interestText.revueCollaboration[language],
    },
  ];

  const title = edit ? 'Bedriftsinteresse' : FORM_LABELS.mainHeading[language];

  return (
    <Page
      card={false}
      classNames={{
        content: styles.pageContent,
        tabContainer: styles.hiddenTabs,
      }}
    >
      <Helmet title={title} />

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
          <div className={styles.layout}>
            <StepRail language={language} />

            {allowedBdb && (
              <a href="/bdb/company-interest" className={styles.back}>
                <Icon
                  iconNode={<ArrowLeft />}
                  size={18}
                  className={styles.backIcon}
                />
                Tilbake
              </a>
            )}

            <div className={styles.header}>
              <h1>{title}</h1>
              {!edit && <LanguageSwitch language={language} />}
            </div>

            <div className={styles.content}>
              {!edit && (
                <Card severity="info" className={styles.infoCard}>
                  <span>
                    {FORM_LABELS.subHeading[language]}
                    <a href="mailto:bedriftskontakt@abakus.no">
                      bedriftskontakt@abakus.no
                    </a>
                  </span>
                </Card>
              )}

              <Form onSubmit={handleSubmit}>
                <FormSection
                  id={SECTIONS[0].id}
                  number={1}
                  title={SECTIONS[0][language]}
                >
                  <RowSection>
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
                      placeholder={
                        FORM_LABELS.contactPerson.placeholder[language]
                      }
                      name="contactPerson"
                      component={TextInput.Field}
                      required
                    />
                  </RowSection>
                  <RowSection>
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
                  </RowSection>
                </FormSection>

                <FormSection
                  id={SECTIONS[1].id}
                  number={2}
                  title={SECTIONS[1][language]}
                >
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
                        component={Chip.Field}
                        showErrors={false}
                      />
                    ))}
                  </MultiSelectGroup>

                  <div className={styles.toggleGroup}>
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
                  </div>

                  <MultiSelectGroup
                    name="companyCourseThemes"
                    legend={FORM_LABELS.companyCourseThemes[language]}
                    description={FORM_LABELS.companyCourseThemesInfo[language]}
                  >
                    <FieldArray name="companyCourseThemes">
                      {(props) => (
                        <SurveyOffersBox {...props} language={language} />
                      )}
                    </FieldArray>
                  </MultiSelectGroup>

                  <Field
                    placeholder={interestText.comment[language]}
                    name="comment"
                    component={TextEditor.Field}
                    rows={10}
                    className={styles.textEditor}
                    label={FORM_LABELS.comment[language]}
                    required
                  />
                </FormSection>

                <FormSection
                  id={SECTIONS[2].id}
                  number={3}
                  title={SECTIONS[2][language]}
                >
                  <RowSection>
                    <div>
                      <MultiSelectGroup
                        name="targetGrades"
                        legend={FORM_LABELS.targetGrades[language]}
                      >
                        <FieldArray name="targetGrades">
                          {(props) => (
                            <TargetGradeBox {...props} language={language} />
                          )}
                        </FieldArray>
                      </MultiSelectGroup>
                    </div>
                    <div>
                      <MultiSelectGroup
                        name="semesters"
                        legend={FORM_LABELS.semesters[language]}
                        required
                      >
                        <FieldArray name="semesters">
                          {(props) => (
                            <SemesterBox {...props} language={language} />
                          )}
                        </FieldArray>
                      </MultiSelectGroup>
                    </div>
                  </RowSection>

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
                        component={Chip.Field}
                      />
                    ))}
                  </MultiSelectGroup>

                  <MultiSelectGroup
                    name="events"
                    legend={FORM_LABELS.events[language]}
                    required
                  >
                    <FieldArray name="events">
                      {(props) => (
                        <EventBox
                          {...props}
                          language={language}
                          eventTypeEntities={eventTypeEntities}
                        />
                      )}
                    </FieldArray>
                  </MultiSelectGroup>

                  <MultiSelectGroup
                    name="collaborations"
                    legend={FORM_LABELS.collaborations[language]}
                  >
                    <FieldArray name="collaborations">
                      {(props) => (
                        <CollaborationBox {...props} language={language} />
                      )}
                    </FieldArray>
                  </MultiSelectGroup>

                  <div className={styles.otherOffers}>
                    <MultiSelectGroup
                      name="otherOffers"
                      legend={FORM_LABELS.otherOffers[language]}
                    >
                      <FieldArray name="otherOffers">
                        {(props) => <OtherBox {...props} language={language} />}
                      </FieldArray>
                    </MultiSelectGroup>
                    <div className={styles.readMe}>
                      <LatestReadme collapsible={false} displayCount={2} />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  id={SECTIONS[3].id}
                  number={4}
                  title={SECTIONS[3][language]}
                >
                  {!edit && (
                    <div>
                      <b>{interestText.priorityReasoningTitle[language]}</b>
                      <p className={styles.mutedText}>
                        {interestText.priorityReasoning[language]}
                      </p>
                    </div>
                  )}

                  <SubmissionError />

                  <SubmitButton className={styles.submitButton}>
                    {edit
                      ? 'Oppdater bedriftsinteresse'
                      : FORM_LABELS.create[language]}
                  </SubmitButton>
                </FormSection>
              </Form>
            </div>
          </div>
        )}
      </LegoFinalForm>
    </Page>
  );
};

export default CompanyInterestForm;
