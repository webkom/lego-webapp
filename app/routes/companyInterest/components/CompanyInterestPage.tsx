import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError, FieldArray } from 'redux-form';
import english from 'app/assets/great_britain.svg';
import norwegian from 'app/assets/norway.svg';
import { Content } from 'app/components/Content';
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
import { Image } from 'app/components/Image';
import Flex from 'app/components/Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator';
import withAutocomplete from 'app/components/Search/withAutocomplete';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { FlexRow } from '../../../components/FlexBox';
import { interestText, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import type { Node } from 'react';
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
  collaboration_revue: {
    norwegian: 'Samarbeid med Revyen**',
    english: 'Collaboration with the revue**',
  },
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
export const PARTICIPANT_RANGE_MAP = {
  first: [10, 40],
  second: [30, 60],
  third: [60, 100],
  fourth: [100, null],
};

const eventToString = (event) =>
  Object.keys(EVENT_TYPES)[Number(event.charAt(event.length - 2))];

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
} & FieldArrayProps): Node => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`semester${index}`}
              name={`semesters[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {semesterToText({ ...fields.get(index), language })}
          </span>
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
} & FieldArrayProps): Node => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`events[${index}]`}
              name={`events[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {EVENT_TYPES[eventToString(key)][language]}
          </span>
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
} & FieldArrayProps): Node => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`targetGrades[${index}]`}
              name={`targetGrades[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {TARGET_GRADE_TYPES[targetGradeToString(key)][language]}
          </span>
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
} & FieldArrayProps): Node => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`otherOffers[${index}]`}
              name={`otherOffers[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {OTHER_TYPES[otherOffersToString(key)][language]}
          </span>
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
} & FieldArrayProps): Node => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`collaborations[${index}]`}
              name={`collaborations[${index}].checked`}
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {COLLABORATION_TYPES[collaborationToString(key)][language]}
          </span>
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
  otherOffers: Array<{
    name: string;
    checked: boolean;
  }>;
  comment: string;
  courseComment: string;
  breakfastTalkComment: string;
  otherEventComment: string;
};
type Props = FormProps & {
  allowedBdb: boolean;
  onSubmit: (
    arg0: CompanyInterestFormEntity,
    arg1: boolean | null | undefined
  ) => Promise<any>;
  push: (arg0: string) => void;
  events: Array<Record<string, any>>;
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
      contactPerson: data.contactPerson,
      mail: data.mail,
      phone: data.phone,
      semesters: data.semesters
        .filter((semester) => semester.checked)
        .map((semester) => semester.id),
      events: data.events
        .filter((event) => event.checked)
        .map((event) => event.name),
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
    collaborations: {
      norwegian: 'Samarbeid',
      english: 'Collaborations',
    },
    targetGrades: {
      norwegian: 'Klassetrinn',
      english: 'Target Grades',
    },
    participantRange: {
      norwegian: 'Antall deltagere',
      english: 'Number of participants',
    },
    comment: {
      norwegian: 'Kommentar',
      english: 'Comment',
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
                  key={index}
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
          <br />
          <br />
          {interestText.revueCollaboration[language]}
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

        {showCourseComment && (
          <div className={styles.topline}>
            <p>{interestText.courseDescription[language]}</p>
            <Field
              placeholder={interestText.courseComment[language]}
              name="courseComment"
              component={TextEditor.Field}
              rows={10}
              className={styles.textEditor}
              label={labels.secondComment[language]}
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
              label={labels.secondComment[language]}
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
              label={labels.secondComment[language]}
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
