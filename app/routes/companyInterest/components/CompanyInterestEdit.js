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
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';

export const EVENT_TYPES = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  course: 'Kurs',
  bedex: 'Bedex',
  other: 'Annet'
};

const chooseEventType = event => {
  const number = event.slice(-2);
  return Object.keys(EVENT_TYPES)[number]
}

const ACTIVITY_TYPES = [
  { label: 'Annonsere i readme', name: 'readme' },
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
      {fields.map((item, index) => (
        <div key={index} className={styles.checkbox}>
          <div className={styles.checkboxField}>
            <Field
              key={`semester${index}`}
              name={`semesters[${index}].checked`}
              component={CheckBox.Field}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {semesterToText(fields.get(index))}
          </span>
        </div>
      ))}
    </FlexRow>
  );
};

const getEventBoxes = ({ fields }) => (
  <FlexRow>
    {fields.map((key, index) => (
      <div key={index} className={styles.checkbox}>
      {console.log('key',key)}
        <div className={styles.checkboxField}>
          <Field
            key={`events[${index}]`}
            name={`events[${index}].checked`}
            component={CheckBox.Field}
          />
        </div>
        <span className={styles.checkboxSpan}>
          {EVENT_TYPES[chooseEventType(key)]}
        </span>
      </div>
    ))}
  </FlexRow>
);

const getActivityBoxes = () =>
  ACTIVITY_TYPES.map((item, index) => (
    <div key={index} className={styles.checkbox}>
      <div className={styles.checkboxField}>
        <Field
          key={`activity${index}`}
          name={item.name}
          component={CheckBox.Field}
        />
      </div>
      <span className={styles.checkboxSpan}>{item.label}</span>
    </div>
  ));

type Props = {
  updateCompanyInterest: () => void,
  handleSubmit: () => void,
  company: Array,
  semesters: Array
};

export const CompanyInterestEdit = (props: Props) => {
  console.log('props',props);
  console.log('events',props.initialValues.events);
  const onSubmit = data => {
    const newData = {
      id: data.id,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      mail: data.mail,
      semesters: data.semesters
        .filter(semester => semester.checked)
        .map(semester => semester.id),
      events: Object.keys(EVENT_TYPES).filter(eventType => data[eventType]),
      readme: data.readme,
      collaboration: data.collaboration,
      bedex: data.bedex,
      itdagene: data.itdagene,
      comment: data.comment
    };
    props
      .updateCompanyInterest(newData)
      .then(() => props.push('/companyInterest'));
  };
  return (
    <div className={styles.root}>
      <Form onSubmit={props.handleSubmit(onSubmit)}>
        <h1 className={styles.mainHeading}>{'Meld interesse'}</h1>
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
          <label htmlFor="semesters" className={styles.heading}>
            Semester
          </label>

          <FieldArray
            name="semesters"
            component={getSemesterBoxes}
            className={styles.checkboxWrapper}
          />

          <label htmlFor="events" className={styles.heading}>
            Arrangementer
          </label>

          <FieldArray
            name="events"
            component={getEventBoxes}
            className={styles.checkboxWrapper}
          />

          <label htmlFor="extra" className={styles.heading}>
            Annet
          </label>
          <FlexRow>{getActivityBoxes()}</FlexRow>
        </FlexColumn>

        <Field
          placeholder="Skriv eventuell kommentar"
          name="comment"
          component={TextEditor.Field}
          className={styles.textEditor}
          label="Kommentar"
        />

        <FlexColumn className={styles.content}>
          <FlexItem />
          <FlexItem>
            <Button type="submit" submit className={styles.createButton}>
              {'Oppdater bedriftsinteresse'}
            </Button>
          </FlexItem>
        </FlexColumn>
      </Form>
    </div>
  );
};

export default CompanyInterestEdit;
