// @flow

import React from 'react';

import { Link } from 'react-router';
import styles from './InterestGroupEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import { map, countBy } from 'lodash';

import {
  Form,
  TextInput,
  EditorField,
  SelectInput,
  Button,
  ImageUploadField
} from 'app/components/Form';

type Props = {
  handleSubmit: func,
  handleSubmitCallback: func,
  interestGroupId?: string,
  interestGroup?: Object,
  change: func,
  groupMembers: array,
  pristine: boolean,
  submitting: boolean
};

function InterestGroupEditor({
  handleSubmit,
  handleSubmitCallback,
  interestGroup,
  change,
  groupMembers = [],
  submitting,
  pristine,
  uploadFile
}: Props) {
  const isEditPage = interestGroup !== undefined;
  if (isEditPage && !interestGroup) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <h2>
        <Link
          to={
            isEditPage
              ? `/interestGroups/${interestGroup.id}`
              : `/interestGroups/`
          }
        >
          <i className="fa fa-angle-left" />
          {isEditPage ? ` ${interestGroup.name}` : 'Tilbake'}
        </Link>
      </h2>
      <h1>{isEditPage ? 'Endre gruppe' : 'Ny gruppe'} </h1>
      <Form onSubmit={handleSubmit(handleSubmitCallback)}>
        <Field
          label="Gruppenavn"
          placeholder="Gruppenavn"
          name="name"
          component={TextInput.Field}
          required
        />
        <Field
          label="Kort beskrivelse"
          placeholder="Hva er gruppen om?"
          name="description"
          component={TextInput.Field}
          required
        />
        <Field
          label="Beskrivelse"
          placeholder="Her kan du skrive litt mer om hva gruppen handler om. Hva gjør dere? Møtes dere ofte?"
          name="descriptionLong"
          component={EditorField.Field}
        />
        <Field
          name="members"
          filter={['users.user']}
          label="Medlemmer"
          placeholder="Skriv inn brukere du vil ha med"
          component={SelectInput.AutocompleteField}
          multi
        />
        <Field
          name="leader"
          label="Leder"
          placeholder="Hvem er leder?"
          options={groupMembers}
          component={SelectInput.Field}
          required
        />
        <Field
          name="logo"
          component={ImageUploadField.Field}
          label="Gruppelogo"
          uploadFile={uploadFile}
          aspectRatio={1}
          img={interestGroup && interestGroup.logo}
          className={styles.logo}
        />
        <Button disabled={pristine || submitting} submit>
          {isEditPage ? 'Lagre gruppe' : 'Lag interessegruppe'}{' '}
        </Button>
      </Form>
    </div>
  );
}

export default reduxForm({
  form: 'interestGroupEditor',
  validate(values) {
    const errors = {};
    const labels = values.members.map(o => o.label);
    const counts = countBy(labels);
    map(counts, (c, l) => {
      if (c > 1) errors.members = `'${l}' er valgt flere ganger`;
    });

    if (!values.name) {
      errors.name = 'Du må gi møtet en tittel';
    }
    if (!values.description) {
      errors.description = 'Skriv noe dritt';
    }
    if (!values.leader) {
      errors.leader = 'Du må velge en leder';
    } else if (
      !values.members.map(m => m.value).includes(values.leader.value)
    ) {
      errors.leader = 'Lederen må være medlem';
    }

    return errors;
  }
})(InterestGroupEditor);
