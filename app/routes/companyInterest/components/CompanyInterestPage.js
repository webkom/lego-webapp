import React from 'react';
import styles from 'app/routes/companyInterest/components/CompanyInterest.css';
import {
  TextEditor,
  TextInput,
  Button,
  CheckBox,
  Form
} from 'app/components/Form';
import { Field, FieldArray } from 'redux-form';
import { ImageUpload } from 'app/components/Upload';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';

export const EVENT_TYPES = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  course: 'Kurs',
  bedex: 'Bedex',
  anniversary: 'Anniversary',
  other: 'Annet'
};

const ACTIVITY_TYPES = [
  { label: 'Annonsere i readme', name: 'read_me' },
  { label: 'Samarbeid med andre linjeforeninger', name: 'collaboration' },
  { label: 'Ønsker stand på itDAGENE', name: 'itdagene' }
];

const SEMESTER_TRANSLATION = {
  spring: 'Vår',
  autumn: 'Høst'
};

const semesterToText = semesterObject =>
  `${SEMESTER_TRANSLATION[semesterObject.semester]} ${semesterObject.year}`;

const getSemesterBoxes = ({ fields }) => {
  return (
    <FlexRow>
      {fields.map((item, index) =>
        <div key={index} className={styles.checkbox}>
          <div className={styles.checkboxField}>
            <Field
              key={`semester${index}`}
              id={`semester${index}`}
              name={`semesters[${index}].checked`}
              component={CheckBox.Field}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {semesterToText(fields.get(index))}
          </span>
        </div>
      )}
    </FlexRow>
  );
};

const getEventBoxes = () =>
  Object.keys(EVENT_TYPES).map((key, index) =>
    <div key={index} className={styles.checkbox}>
      <div className={styles.checkboxField}>
        <Field
          id={`event${index}`}
          key={`event${index}`}
          value={key}
          name={key}
          component={CheckBox.Field}
        />
      </div>
      <span className={styles.checkboxSpan}>
        {EVENT_TYPES[key]}
      </span>
    </div>
  );

const getActivityBoxes = () =>
  ACTIVITY_TYPES.map((item, index) =>
    <div key={index} className={styles.checkbox}>
      <div className={styles.checkboxField}>
        <Field
          id={`activity${index}`}
          key={`activity${index}`}
          name={item.name}
          component={CheckBox.Field}
          value={item}
        />
      </div>
      <span className={styles.checkboxSpan}>
        {item.label}
      </span>
    </div>
  );

type Props = {
  createCompanyInterest: () => void,
  handleSubmit: () => void,
  events: Array,
  semesters: Array
};

const CompanyInterestPage = (props: Props) => {
  const onSubmit = data => {
    const newData = {
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      mail: data.mail,
      semesters: data.semesters
        .filter(semester => semester.checked)
        .map(semester => semester.id),
      events: Object.keys(EVENT_TYPES).filter(eventType => data[eventType]),
      read_me: data.read_me,
      collaboration: data.collaboration,
      bedex: data.bedex,
      itdagene: data.itdagene,
      comment: data.comment
    };
    props.createCompanyInterest(newData).then(() => {
      props.push('/companyInterest');
    });
  };

  return (
    <div className={styles.root}>
      <Form onSubmit={props.handleSubmit(onSubmit)}>
        <h1 className={styles.mainHeading}>
          {'Meld interesse'}
        </h1>
        <Field
          label="Navn på bedrift"
          placeholder="Bedriftsnavn"
          name="companyName"
          component={TextInput.Field}
        />
        <Field
          label="Kontaktperson"
          placeholder="Ola Nordmann"
          name="contactPerson"
          component={TextInput.Field}
        />
        <Field
          label="Mail"
          placeholder="example@gmail.com"
          name="mail"
          component={TextInput.Field}
        />

        <FlexColumn className={styles.checkboxWrapper}>
          <label htmlFor="semester" className={styles.heading}>
            Semester
          </label>

          <FieldArray
            name="semesters"
            component={getSemesterBoxes}
            className={styles.checkboxWrapper}
          />

          <label htmlFor="arrangementer" className={styles.heading}>
            Arrangementer
          </label>
          <FlexRow>
            {getEventBoxes()}
          </FlexRow>

          <label htmlFor="extra" className={styles.heading}>
            Annet
          </label>
          <FlexRow>
            {getActivityBoxes()}
          </FlexRow>
        </FlexColumn>

        <Field
          placeholder="Skriv eventuell kommentar"
          name="comment"
          component={TextEditor.Field}
          className={styles.textEditor}
          label="Kommentar"
        />

        <FlexColumn className={styles.content}>
          <FlexItem className={styles.upload}>
            <ImageUpload>Last opp bilde</ImageUpload>
          </FlexItem>
          <FlexItem>
            <Button type="submit" submit className={styles.createButton}>
              {'Opprett bedriftsinteresse'}
            </Button>
          </FlexItem>
        </FlexColumn>
      </Form>
    </div>
  );
};

export default CompanyInterestPage;
