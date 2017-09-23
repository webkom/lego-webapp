// @flow

import React from 'react';

import { Link } from 'react-router';
import styles from './index.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field } from 'redux-form';
import type { FieldProps } from 'redux-form';
import { Flex } from 'app/components/Layout';
import {
  Form,
  TextInput,
  EditorField,
  Button,
  ImageUploadField
} from 'app/components/Form';

type OwnProps = {
  handleSubmitCallback: Object => Promise<*>,
  interestGroupId?: string,
  groupMembers: Array<Object>
};

type Props = OwnProps & FieldProps;

function InterestGroupEditor({
  handleSubmit,
  handleSubmitCallback,
  interestGroup,
  removeInterestGroup,
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
      <Flex justifyContent="space-between" alignItems="baseline">
        {isEditPage ? (
          <div>
            <h1>Endre gruppe</h1>
            <Button
              onClick={() => removeInterestGroup(interestGroup.id)}
              className={styles.deleteButton}
            >
              Slett gruppen
            </Button>
          </div>
        ) : (
          <h1>Ny gruppe</h1>
        )}
      </Flex>
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
          name="logo"
          component={ImageUploadField.Field}
          label="Gruppelogo"
          uploadFile={uploadFile}
          aspectRatio={1}
          img={interestGroup && interestGroup.logo}
          className={styles.logo}
        />
        <Button disabled={pristine || submitting} submit>
          {isEditPage ? 'Lagre gruppe' : 'Lag interessegruppe'}
        </Button>
      </Form>
    </div>
  );
}

export default reduxForm({
  form: 'interestGroupEditor',
  validate(values) {
    const errors = {};

    if (!values.name) {
      errors.name = 'Du må gi møtet en tittel';
    }
    if (!values.description) {
      errors.description = 'Skriv noe dritt';
    }

    return errors;
  }
})(InterestGroupEditor);
