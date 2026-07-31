import {
  Card,
  Flex,
  Icon,
  Image,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import arrayMutators from 'final-form-arrays';
import { gsap } from 'gsap';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Field, FormSpy, useField, useForm } from 'react-final-form';
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
  Slider,
  TextEditor,
  TextInput,
} from '~/components/Form';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import PillSwitch from '~/components/PillSwitch';
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
import useQuery from '~/utils/useQuery';
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
  README_PROMO,
  OTHER_OFFERS,
  SURVEY_OFFERS,
  TARGET_GRADES,
  EVENT_DESCRIPTIONS,
} from './Translations';
import {
  interestText,
  PARTICIPANT_RANGE_MAP,
  PARTICIPANT_RANGE_TYPES,
  semesterToText,
  sortSemesterChronologically,
} from './utils';
import type { MouseEvent, ReactNode } from 'react';
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

const ChipOptions = ({
  fields,
  getLabel,
}: {
  fields: any;
  getLabel: (value: any) => ReactNode;
}): ReactNode => (
  <div className={styles.optionRow}>
    {fields.map((item, index) => (
      <Field
        key={item}
        name={`${item}.checked`}
        label={getLabel(fields.value[index])}
        type="checkbox"
        component={Chip.Field}
      />
    ))}
  </div>
);

const COMPANY_TO_COMPANY = 'company_to_company';

/* Bedrift-til-bedrift is only on offer to companies with an office in
   Trondheim. Taking the office away has to clear the choice too: an event that
   is checked but not on screen still submits, and still holds the form back on
   its pitch, which is required and nowhere to be seen. */
const ClearHiddenCompanyToCompany = (): null => {
  const form = useForm();
  const {
    input: { value: officeInTrondheim },
  } = useField('officeInTrondheim', { subscription: { value: true } });

  useEffect(() => {
    if (officeInTrondheim) {
      return;
    }

    const events = form.getState().values.events ?? [];
    const index = events.findIndex(
      (event) => event.name === COMPANY_TO_COMPANY,
    );

    if (events[index]?.checked) {
      form.change(`events[${index}].checked`, false);
      form.change('companyToCompanyComment', undefined);
    }
  }, [officeInTrondheim, form]);

  return null;
};

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
      <Flex column gap="var(--spacing-sm)">
        <p className={styles.mutedText}>
          {FORM_LABELS.eventDescriptionIntro[language]}
        </p>
        {fields
          .map((item, index) => ({ name: fields.value[index].name, index }))
          .filter(
            ({ name }) =>
              values.officeInTrondheim || name !== COMPANY_TO_COMPANY,
          )
          .map(({ name, index }) => {
            const entity = eventTypeEntities.find(
              (eventTypeEntity) => eventTypeEntity.name === name,
            );
            return (
              <div
                key={name}
                className={cx(styles.eventCard, styles.optionCard)}
              >
                <Field
                  name={`events[${index}].checked`}
                  label={EVENTS[name][language]}
                  type="checkbox"
                  component={CheckBox.Field}
                  description={EVENT_DESCRIPTIONS[name][language]}
                  descriptionPosition="inline"
                  fieldClassName={styles.optionField}
                  labelClassName={styles.optionLabel}
                  inlineContent={
                    values.events?.[index]?.checked &&
                    entity?.commentName && (
                      <div className={styles.eventPitch}>
                        {entity.description && (
                          <p className={styles.mutedText}>
                            {entity.description}
                          </p>
                        )}
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
                    )
                  }
                />
              </div>
            );
          })}
      </Flex>
    )}
  </FormSpy>
);

const CardOptions = ({
  fields,
  getLabel,
  getDescription,
}: {
  fields: any;
  getLabel: (name: string) => ReactNode;
  getDescription?: (name: string) => string | undefined;
}): ReactNode => (
  <Flex column gap="var(--spacing-sm)" className={styles.cardList}>
    {fields.map((item, index) => {
      const name = fields.value[index].name;
      return (
        <div key={name} className={cx(styles.eventCard, styles.optionCard)}>
          <Field
            name={`${item}.checked`}
            label={getLabel(name)}
            type="checkbox"
            component={CheckBox.Field}
            description={getDescription?.(name)}
            descriptionPosition="inline"
            fieldClassName={styles.optionField}
            labelClassName={styles.optionLabel}
          />
        </div>
      );
    })}
  </Flex>
);

/* The whole row toggles. A react-aria switch ignores the click a <label>
   forwards to it, so the row carries its own text and writes the value, and
   steps aside for a press that landed on the switch. */
const ToggleRow = ({
  name,
  label,
  description,
}: {
  name: string;
  label: string;
  description?: string;
}): ReactNode => {
  const form = useForm();
  const {
    input: { value },
  } = useField(name, { subscription: { value: true } });

  const labelId = `${name}-label`;
  const descriptionId = `${name}-description`;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    form.change(name, !value);
  };

  return (
    <div className={styles.toggleRow} onClick={handleClick}>
      <div className={styles.toggleText}>
        <span id={labelId} className={styles.toggleLabel}>
          {label}
        </span>
        {description && (
          <p id={descriptionId} className={styles.toggleDescription}>
            {description}
          </p>
        )}
      </div>
      <Field
        name={name}
        component={ToggleSwitch.Field}
        fieldClassName={styles.toggleControl}
        aria-labelledby={description ? `${labelId} ${descriptionId}` : labelId}
      />
    </div>
  );
};

const ReadmePromo = ({ language }: { language: Language }): ReactNode => {
  const readmes = useAppSelector((state) => state.readme);

  return spyValues((values: CompanyInterestFormEntity) => {
    const selected = values.otherOffers?.some(
      (offer) => offer.name === 'readme' && offer.checked,
    );
    return (
      <div className={cx(styles.readmePromo, selected && styles.readmePromoOn)}>
        <div className={styles.readmeCovers}>
          {readmes.slice(0, 2).map(({ image, pdf, title }) => (
            <a key={title} href={pdf} className={styles.readmeCover}>
              <Image src={image} alt={`Forsidebildet til ${title}`} />
            </a>
          ))}
        </div>
        <div>
          <div className={styles.readmeWordmark}>
            <a
              href={'https://readme.abakus.no/'}
              rel="noopener noreferrer"
              target="_blank"
            >
              {readmeIfy('readme')}
              <span className={styles.readmeDot}>.</span>
            </a>
          </div>
          <p className={styles.readmeTagline}>
            {README_PROMO.tagline[language]}
          </p>
          <ul className={styles.readmeStats}>
            {README_PROMO.stats.map((stat) => (
              <li key={stat.english}>{stat[language]}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  });
};

const LANGUAGE_OPTIONS: PillSwitchOption<Language>[] = [
  { label: 'Norsk', value: 'norwegian' },
  { label: 'English', value: 'english' },
];

/* Language lives in ?lang, so switching rewrites the URL in place and the
   mounted form keeps every value. The default stays out of the URL. */
const LANGUAGE_QUERY_DEFAULTS = { lang: 'no' };

const useFormLanguage = (): Language => {
  const { query } = useQuery(LANGUAGE_QUERY_DEFAULTS);
  return query.lang === 'en' ? 'english' : 'norwegian';
};

const LanguageSwitch = ({ language }: { language: Language }) => {
  const { setQueryValue } = useQuery(LANGUAGE_QUERY_DEFAULTS);

  return (
    <PillSwitch
      options={LANGUAGE_OPTIONS}
      value={language}
      onChange={(value) =>
        setQueryValue('lang')(value === 'english' ? 'en' : 'no')
      }
      ariaLabel={language === 'english' ? 'Language' : 'Språk'}
    />
  );
};
type CompanyObjectProps = {
  label: string | undefined;
  title: string | undefined;
  value?: string;
};

/* No company means no value: the select only shows its placeholder while
   it holds nothing, and an empty option counts as something. */
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
  description?: string;
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
  lunchPresentationComment: [requiredIfEventType('lunch_presentation')],
  courseComment: [requiredIfEventType('course')],
  bedexComment: [requiredIfEventType('bedex')],
  otherEventComment: [requiredIfEventType('other')],
  startupComment: [requiredIfEventType('start_up')],
  companyToCompanyComment: [requiredIfEventType('company_to_company')],
});

const CompanyInterestForm = () => {
  const language = useFormLanguage();
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
      description: interestText.companyPresentationDescription[language],
      commentName: 'companyPresentationComment',
      commentPlaceholder: interestText.companyPresentationComment[language],
    },
    {
      name: 'lunch_presentation',
      description: interestText.lunchPresentationDescription[language],
      commentName: 'lunchPresentationComment',
      commentPlaceholder: interestText.lunchPresentationComment[language],
    },
    {
      name: 'course',
      description: interestText.courseDescription[language],
      commentName: 'courseComment',
      commentPlaceholder: interestText.courseComment[language],
    },
    {
      name: 'breakfast_talk',
      description: interestText.breakfastTalkDescription[language],
      commentName: 'breakfastTalkComment',
      commentPlaceholder: interestText.breakfastTalkComment[language],
    },
    {
      name: 'bedex',
      description: interestText.bedexDescription[language],
      commentName: 'bedexComment',
      commentPlaceholder: interestText.bedexComment[language],
    },
    {
      name: 'other',
      description: interestText.otherEventDescription[language],
      commentName: 'otherEventComment',
      commentPlaceholder: interestText.otherEventComment[language],
    },
    // {
    //   name: 'start_up',
    //   description: interestText.startUpDescription[language],
    //   commentName: 'startupComment',
    //   commentPlaceholder: interestText.startUpComment[language],
    // },
    {
      name: 'company_to_company',
      description: interestText.companyToCompanyDescription[language],
      commentName: 'companyToCompanyComment',
      commentPlaceholder: interestText.companyToCompanyComment[language],
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
        keepDirtyOnReinitialize
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
                <ClearHiddenCompanyToCompany />

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
                    <ToggleRow
                      name="officeInTrondheim"
                      label={FORM_LABELS.officeInTrondheim[language]}
                    />
                    <ToggleRow
                      name="wantsThursdayEvent"
                      label={FORM_LABELS.wantsThursdayEvent[language]}
                      description={FORM_LABELS.wantsThursdayEventInfo[language]}
                    />
                  </div>

                  <MultiSelectGroup
                    name="companyCourseThemes"
                    legend={FORM_LABELS.companyCourseThemes[language]}
                    description={FORM_LABELS.companyCourseThemesInfo[language]}
                    descriptionPosition="inline"
                  >
                    <FieldArray name="companyCourseThemes">
                      {(props) => (
                        <ChipOptions
                          {...props}
                          getLabel={({ name }) => SURVEY_OFFERS[name][language]}
                        />
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
                            <ChipOptions
                              {...props}
                              getLabel={({ name }) =>
                                TARGET_GRADES[name][language]
                              }
                            />
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
                            <ChipOptions
                              {...props}
                              getLabel={(value) =>
                                semesterToText({ ...value, language })
                              }
                            />
                          )}
                        </FieldArray>
                      </MultiSelectGroup>
                    </div>
                  </RowSection>

                  <Field
                    name="participantRange"
                    label={FORM_LABELS.participantRange[language]}
                    placeholder={
                      isEnglish ? 'Pick a range' : 'Velg antall deltagere'
                    }
                    options={Object.entries(PARTICIPANT_RANGE_TYPES).map(
                      ([value, rangeLabel]) => ({ value, label: rangeLabel }),
                    )}
                    component={Slider.Field}
                    className={styles.participantSlider}
                  />

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
                  <p className={styles.eventsFootnote}>
                    * Bedrift-til-bedrift blir tilgjengelig om dere har kontorer
                    i Trondheim.
                  </p>

                  <MultiSelectGroup
                    name="collaborations"
                    legend={FORM_LABELS.collaborations[language]}
                  >
                    <FieldArray name="collaborations">
                      {(props) => (
                        <CardOptions
                          {...props}
                          getLabel={(name) =>
                            COLLABORATION_TYPES[name][language]
                          }
                          getDescription={(name) =>
                            COLLABORATION_DESCRIPTIONS[name]?.[language]
                          }
                        />
                      )}
                    </FieldArray>
                  </MultiSelectGroup>

                  <div className={styles.otherOffers}>
                    <MultiSelectGroup
                      name="otherOffers"
                      legend={FORM_LABELS.otherOffers[language]}
                    >
                      <FieldArray name="otherOffers">
                        {(props) => (
                          <CardOptions
                            {...props}
                            getLabel={(name) =>
                              readmeIfy(OTHER_OFFERS[name][language])
                            }
                          />
                        )}
                      </FieldArray>
                    </MultiSelectGroup>
                    <ReadmePromo language={language} />
                  </div>
                </FormSection>

                <FormSection
                  id={SECTIONS[3].id}
                  number={4}
                  title={SECTIONS[3][language]}
                >
                  {!edit && (
                    <div>
                      <p className={styles.priorityReasoning}>
                        {interestText.priorityReasoningTitle[language]}
                      </p>
                      <p className={styles.mutedText}>
                        {interestText.priorityReasoning[language]}
                      </p>
                    </div>
                  )}

                  <SubmissionError />

                  <SubmitButton
                    dark
                    size="large"
                    className={styles.submitButton}
                  >
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
