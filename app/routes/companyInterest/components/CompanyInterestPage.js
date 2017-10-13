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
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, SubmissionError, FieldArray } from 'redux-form';
import type { FieldProps } from 'redux-form';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import { Content } from 'app/components/Layout';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';

import { createValidator, required, isEmail } from 'app/utils/validation';

export const EVENT_TYPES = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  course: 'Faglig arrangement',
  bedex: 'Bedex',
  other: 'Annet'
};

export const OTHER_TYPES = {
  readme: 'Annonsere i readme',
  collaboration: 'Samarbeid med andre linjeforeninger',
  itdagene: 'Stand på itDAGENE',
  labamba_sponsor: 'Sponsing av LaBamba (Studentkjeller)'
};

const eventToString = event =>
  Object.keys(EVENT_TYPES)[Number(event.charAt(event.length - 2))];

const otherOffersToString = offer =>
  Object.keys(OTHER_TYPES)[Number(offer.charAt(offer.length - 2))];

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

const OtherBox = ({ fields }: FieldProps) => (
  <FlexRow className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <div key={index} className={styles.checkbox}>
        <div className={styles.checkboxField}>
          <Field
            key={`otherOffers[${index}]`}
            name={`otherOffers[${index}].checked`}
            component={CheckBox.Field}
            normalize={v => !!v}
          />
        </div>
        <span className={styles.checkboxSpan}>
          {OTHER_TYPES[otherOffersToString(key)]}
        </span>
      </div>
    ))}
  </FlexRow>
);

type Props = FieldProps & {
  onSubmit: CompanyInterestEntity => Promise<*>,
  push: string => void,
  events: Array<Object>,
  semesters: Array<Object>,
  otherOffers: Array<Object>,
  edit: boolean,
  companyInterest?: CompanyInterestEntity
};

const CompanyInterestPage = (props: Props) => {
  if (props.edit && !props.companyInterest) {
    return <LoadingIndicator loading />;
  }
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
      otherOffers: data.otherOffers
        .filter(offer => offer.checked)
        .map(offer => offer.name),
      comment: data.comment
    };

    return props
      .onSubmit(newData)
      .then(() => props.push('/'))
      .catch(err => {
        if (err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
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
          <label htmlFor="semesters" className={styles.heading}>
            Semester
          </label>

          <FieldArray name="semesters" component={SemesterBox} />

          <label htmlFor="events" className={styles.heading}>
            Arrangementer
          </label>

          <FieldArray name="events" component={EventBox} />

          <label htmlFor="otherOffers" className={styles.heading}>
            Annet
          </label>

          <FieldArray name="otherOffers" component={OtherBox} />
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

const validate = createValidator({
  companyName: [required()],
  contactPerson: [required()],
  mail: [required(), isEmail()]
});

export default reduxForm({
  form: 'CompanyInterestForm',
  validate,
  enableReinitialize: true
})(CompanyInterestPage);
