import React, { Component } from 'react';
import styles from 'app/routes/companyInterest/components/CompanyInterest.css';
import { TextEditor, TextInput, Button, CheckBox } from 'app/components/Form';
import { Field } from 'redux-form';
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

type InputFieldProps = {
  label: string,
  placeholder: string,
  name: string
};

const InputField = ({ label, placeholder, name }: InputFieldProps) =>
  <div>
    <label htmlFor={name} className={styles.smallHeading}>
      {label}
    </label>

    <div className={styles.inputField}>
      <Field
        className={styles.textInput}
        placeholder={placeholder}
        name={name}
        component={TextInput.Field}
      />
    </div>
  </div>;

const getSemesterBoxes = semesters => {
  return semesters.map((item, index) =>
    <div key={index} className={styles.checkbox}>
      <div className={styles.checkboxField}>
        <Field
          key={`semester${index}`}
          id={`semester${index}`}
          name={`semester${index}`}
          component={CheckBox.Field}
        />
      </div>
      <span className={styles.checkboxSpan}>
        {item.semester + ' ' + item.year}
      </span>
    </div>
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
        />
      </div>
      <span className={styles.checkboxActivitySpan}>
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
      semesters: Object.keys(props.semesters).filter(
        semester => data[`semester${semester.id}`]
      ),
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
      <form onSubmit={props.handleSubmit(onSubmit)}>
        <h1 className={styles.mainHeading}>
          {'Meld interesse'}
        </h1>
        <div className={styles.nameField}>
          <InputField
            label="Navn på bedrift"
            placeholder="Bedriftsnavn"
            name="companyName"
          />
          <InputField
            label="Kontaktperson"
            placeholder="Ola Nordmann"
            name="contactPerson"
          />
        </div>
        <InputField
          label="E-post"
          placeholder="example@domain.com"
          name="mail"
        />

        <FlexRow className={styles.checkboxWrapper}>
          <FlexItem className={styles.semesters}>
            <label htmlFor="semester" className={styles.heading}>
              Semester
            </label>
            {getSemesterBoxes(props.semesters)}
          </FlexItem>

          <FlexItem className={styles.events}>
            <label htmlFor="arrangementer" className={styles.heading}>
              Arrangementer
            </label>
            {getEventBoxes()}
          </FlexItem>

          <FlexItem className={styles.extra}>
            <label htmlFor="extra" className={styles.heading}>
              Annet
            </label>
            {getActivityBoxes()}
          </FlexItem>
        </FlexRow>

        <label htmlFor="comment" className={styles.smallHeading}>
          Kommentar
        </label>

        <div className={styles.textEditor}>
          <Field
            placeholder="Skriv eventuell kommentar"
            name="comment"
            component={TextEditor.Field}
          />
        </div>

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
      </form>
    </div>
  );
};

export default CompanyInterestPage;
