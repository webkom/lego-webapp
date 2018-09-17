// @flow
import React from 'react';
import { semesterToText } from '../utils';
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
import Flex from 'app/components/Layout/Flex';
import { Content } from 'app/components/Content';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

import { createValidator, required, isEmail } from 'app/utils/validation';

export const EVENT_TYPES = {
  company_presentation: 'Bedriftspresentasjon',
  lunch_presentation: 'Lunsjpresentasjon',
  course: 'Faglig arrangement',
  bedex: 'Bedex',
  other: 'Alternativt arrangement'
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

const SemesterBox = ({ fields }: FieldProps) => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
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
        </label>
      </Flex>
    ))}
  </Flex>
);

const EventBox = ({ fields }: FieldProps) => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
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
        </label>
      </Flex>
    ))}
  </Flex>
);

const OtherBox = ({ fields }: FieldProps) => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
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
        </label>
      </Flex>
    ))}
  </Flex>
);

type Props = FieldProps & {
  actionGrant: Array<String>,
  onSubmit: CompanyInterestEntity => Promise<*>,
  push: string => void,
  events: Array<Object>,
  semesters: Array<CompanySemesterEntity>,
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
      .then(() =>
        props.push(
          props.actionGrant && props.actionGrant.includes('edit')
            ? '/companyInterest/'
            : '/pages/info/for-bedrifter'
        )
      )
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
          required
        />
        <Field
          label="Kontaktperson"
          placeholder="Ola Nordmann"
          name="contactPerson"
          component={TextInput.Field}
          required
        />
        <Field
          label="Mail"
          placeholder="example@gmail.com"
          name="mail"
          component={TextInput.Field}
          required
        />

        <Flex wrap justifyContent="space-between">
          <Flex column>
            <label htmlFor="semesters" className={styles.heading}>
              Semester
            </label>
            <FieldArray
              label="semesters"
              name="semesters"
              component={SemesterBox}
            />
          </Flex>

          <Flex column>
            <label htmlFor="events" className={styles.heading}>
              Arrangementer
            </label>
            <FieldArray name="events" component={EventBox} />
          </Flex>

          <Flex column>
            <label htmlFor="otherOffers" className={styles.heading}>
              Annet
            </label>
            <FieldArray name="otherOffers" component={OtherBox} />
          </Flex>
        </Flex>

        <div className={styles.underline}>
          Vi i Abakus ønsker å kunne tilby et bredt spekter av arrangementer som
          er gunstig for våre studenter. Dersom dere ønsker noe utenfor de
          vanlige rammene, huk gjerne av på {'"Alternativt arrangement"'} og
          skriv en kommentar om hva dere kunne tenkt dere å gjøre i
          kommentarfeltet. Kommentarfeltet kan også brukes til å spesifisere
          annen informasjon.
        </div>

        <Field
          placeholder="Skriv eventuell kommentar"
          name="comment"
          component={TextEditor.Field}
          rows={10}
          className={styles.textEditor}
          label="Kommentar"
        />

        <Flex column className={styles.content}>
          <Button type="submit" submit>
            {props.edit
              ? 'Oppdater bedriftsinteresse'
              : 'Opprett bedriftsinteresse'}
          </Button>
        </Flex>
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
