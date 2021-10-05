// @flow
import type { Node } from 'react';
import { interestText, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
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
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, SubmissionError, FieldArray } from 'redux-form';
import type { FormProps, FieldArrayProps } from 'redux-form';
import Flex from 'app/components/Layout/Flex';
import { Content } from 'app/components/Content';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

import { createValidator, required, isEmail } from 'app/utils/validation';
import { FlexRow } from '../../../components/FlexBox';
import { Link } from 'react-router-dom';
import norwegian from 'app/assets/norway.svg';
import english from 'app/assets/great_britain.svg';
import withAutocomplete from 'app/components/Search/withAutocomplete';

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
  digital_presentation: {
    norwegian: 'Digital presentasjon',
    english: 'Digital presentation',
  },
  /*
  bedex: {
    norwegian: 'BedEx (1.-3. September 2021)',
    english: 'BedEx (1.-3. September 2021)',
  },
  */
  other: {
    norwegian: 'Alternativt arrangement',
    english: 'Other event',
  },
  start_up: {
    norwegian: 'Start-up kveld',
    english: 'Start-up night',
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
  omega: {
    english: 'Event in collaboration with Omega',
    norwegian: 'Samarbeid med Omega linjeforening',
  },
  online: {
    english: 'Event in collaboration with Online',
    norwegian: 'Samarbeid med Online linjeforening',
  },
  anniversary: {
    english: "Collaboration with Abakus' anniversary committee*",
    norwegian: 'Samarbeid med Abakus sitt Jubileum*',
  },
  revueAnniversary: {
    english: "Collaboration with the revue's anniversary committee*",
    norwegian: 'Samarbeid med Revyen sitt Jubileum*',
  },
  revue: {
    english: 'Collaboration with the revue**',
    norwegian: 'Samarbeid med Revyen**',
  },
};

export const TARGET_GRADE_TYPES = {
  first: {
    norwegian: '1. klasse',
    english: '1st Years',
  },
  second: {
    norwegian: '2. klasse',
    english: '2nd Years',
  },
  third: {
    norwegian: '3. klasse',
    english: '3rd Years',
  },
  fourth: {
    norwegian: '4. klasse',
    english: '4th Years',
  },
  fifth: {
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

export const eventToString = (event) =>
  Object.keys(EVENT_TYPES)[Number(event.charAt(event.length - 2))];

const otherOffersToString = (offer) =>
  Object.keys(OTHER_TYPES)[Number(offer.charAt(offer.length - 2))];

const collaborationToString = (collab) =>
  Object.keys(COLLABORATION_TYPES)[Number(collab.charAt(collab.length - 2))];

const targetGradeToString = (targetGrade) =>
  Object.keys(TARGET_GRADE_TYPES)[
    Number(targetGrade.charAt(targetGrade.length - 2))
  ];

const participantRangeToString = (pRange) =>
  Object.keys(PARTICIPANT_RANGE_TYPES)[
    Number(pRange.charAt(pRange.length - 2))
  ];

//TODO: Participant Range to String?
const SemesterBox = ({
  fields,
  language,
}: { language: string } & FieldArrayProps): Node => (
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
}: { language: string } & FieldArrayProps): Node => (
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
}: { language: string } & FieldArrayProps): Node => (
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

const ParticipantRangeBox = ({
  fields,
}: { language: string } & FieldArrayProps): Node => (
  <RadioButtonGroup>
    {fields.map((key, index) => (
      <Field
        key={index}
        name={`participantRange[${index}].checked`}
        field={`participantRange[${index}].checked`}
        label={PARTICIPANT_RANGE_TYPES[participantRangeToString(key)]}
        component={RadioButton.Field}
        inputValue={PARTICIPANT_RANGE_TYPES[participantRangeToString(key)]}
      />
    ))}
  </RadioButtonGroup>
);

const OtherBox = ({
  fields,
  language,
}: { language: string } & FieldArrayProps): Node => (
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
}: { language: string } & FieldArrayProps): Node => (
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
  companyName: string,
  company: ?number,
  contactPerson: string,
  mail: string,
  phone: string,
  semesters: Array<CompanySemesterEntity>,
  events: Array<{ name: String, checked: boolean }>,
  otherOffers: Array<{ name: String, checked: boolean }>,
  comment: String,
};

type Props = FormProps & {
  allowedBdb: boolean,
  onSubmit: (CompanyInterestFormEntity, ?boolean) => Promise<*>,
  push: (string) => void,
  events: Array<Object>,
  semesters: Array<CompanySemesterEntity>,
  otherOffers: Array<Object>,
  collaborations: Array<Object>,
  targetGrades: Array<Object>,
  participantRange: string,
  edit: boolean,
  companyInterest?: CompanyInterestEntity,
  language: string,
  comment: String,
};

const CompanyInterestPage = (props: Props) => {
  if (props.edit && !props.companyInterest) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (data) => {
    const { company } = data;
    const companyId = company['value'] ? Number(company['value']) : null;
    const companyName = companyId === null ? company['label'] : '';

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
        .map((targetGrade) => targetGrade.name),
      participantRange: data.participantRange
        .filter((pRange) => pRange.checked)
        .map((pRange) => pRange.name),
      comment: data.comment,
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
    create: {
      norwegian: 'Opprett bedriftsinteresse',
      english: 'Submit',
    },
  };

  const { language } = props;
  const isEnglish = language === 'english';

  return (
    <Content>
      <Form onSubmit={props.handleSubmit(onSubmit)}>
        <FlexRow alignItems="center" justifyContent="space-between">
          <h1 className={styles.mainHeading}>{labels.mainHeading[language]}</h1>
          <Link
            to={isEnglish ? '/interesse' : '/register-interest'}
            style={{ display: props.edit ? 'none' : 'block' }}
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
            <FieldArray
              name="participantRange"
              label="participantRange"
              language={language}
              component={ParticipantRangeBox}
            />
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

        <div className={styles.underline}>
          {interestText.text.first[language]}
          <br />
          <br />
          {interestText.text.second[language]}
          <br />
          <br />
          {/*} {interestText.bedex[language]} 
          <br />
          <br />{*/}
          {interestText.anniversaryCollaboration[language]}
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

        <div className={styles.underline}>
          <b>{interestText.priorityReasoningTitle[language]}</b>
          <br />
          {interestText.priorityReasoning[language]}
        </div>

        <Flex column className={styles.content}>
          <Button type="submit" submit>
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
