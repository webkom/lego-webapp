// @flow
import React from 'react';
import styles from './CompanyInterest.css';
import {
  TextEditor,
  TextInput,
  Button,
  CheckBox,
  Form
} from 'app/components/Form';
import { Field, FieldArray } from 'redux-form';
import type { FieldProps } from 'redux-form';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import { Content } from 'app/components/Layout';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';

export const EVENT_TYPES = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  course: 'Kurs',
  bedex: 'Bedex',
  other: 'Annet'
};

const eventToString = event =>
  Object.keys(EVENT_TYPES)[event.charAt(event.length - 2)];

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

const SemesterBox = ({ fields }: FieldProps) => (
  <FlexRow className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <div key={index} className={styles.checkbox}>
        <div className={styles.checkboxField}>
          <Field
            key={`semester${index}`}
            name={`semesters[${index}].checked`}
            component={CheckBox.Field}
            normalize={v => !!v}
          />
        </div>
        <span className={styles.checkboxSpan}>
          {semesterToText(fields.get(index))}
        </span>
      </div>
    ))}
  </FlexRow>
);

const EventBox = ({ fields }: FieldProps) => (
  <FlexRow className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <div key={index} className={styles.checkbox}>
        <div className={styles.checkboxField}>
          <Field
            key={`events[${index}]`}
            name={`events[${index}].checked`}
            component={CheckBox.Field}
            normalize={v => !!v}
          />
        </div>
        <span className={styles.checkboxSpan}>
          {EVENT_TYPES[eventToString(key)]}
        </span>
      </div>
    ))}
  </FlexRow>
);

const ActivityBox = () => (
  <FlexRow className={styles.checkboxWrapper}>
    {ACTIVITY_TYPES.map((item, index) => (
      <div key={index} className={styles.checkbox}>
        <div className={styles.checkboxField}>
          <Field
            key={`activity${index}`}
            name={item.name}
            component={CheckBox.Field}
            normalize={v => !!v}
          />
        </div>
        <span className={styles.checkboxSpan}>{item.label}</span>
      </div>
    ))}
  </FlexRow>
);

type Props = FieldProps & {
  onSubmit: CompanyInterestEntity => Promise<*>,
  push: string => void,
  events: Array<Object>,
  semesters: Array<Object>,
  edit: boolean
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
      events: data.events
        .filter(event => event.checked)
        .map(event => event.name),
      readme: data.readme,
      collaboration: data.collaboration,
      bedex: data.bedex,
      itdagene: data.itdagene,
      comment: data.comment
    };

    props.onSubmit(newData).then(() => props.push('/companyInterest'));
  };

  return (
    <Content>
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

        <FlexColumn>
          <label htmlFor="semester" className={styles.heading}>
            Semester
          </label>

          <FieldArray name="semesters" component={SemesterBox} />

          <label htmlFor="events" className={styles.heading}>
            Arrangementer
          </label>

          <FieldArray name="events" component={EventBox} />

          <label htmlFor="extra" className={styles.heading}>
            Annet
          </label>

          <ActivityBox />
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
              {props.edit
                ? 'Oppdater bedriftsinteresse'
                : 'Opprett bedriftsinteresse'}
            </Button>
          </FlexItem>
        </FlexColumn>
      </Form>
    </Content>
  );
};

export default CompanyInterestPage;
