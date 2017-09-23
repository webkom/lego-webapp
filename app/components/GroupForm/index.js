// @flow
import React from 'react';
import styles from './index.css';
import { reduxForm, Field } from 'redux-form';
import type { FieldProps } from 'redux-form';
import {
  Form,
  TextInput,
  EditorField,
  Button,
  ImageUploadField
} from 'app/components/Form';

type OwnProps = {
  handleSubmitCallback: Object => Promise<*>,
  groupId?: string,
  groupMembers: Array<Object>
};

type Props = OwnProps & FieldProps;

function GroupForm({
  handleSubmit,
  handleSubmitCallback,
  group,
  groupMembers = [],
  submitting,
  pristine,
  uploadFile
}: Props) {
  const isNew = !!group;

  return (
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
        img={group && group.logo}
        className={styles.logo}
      />
      <Button disabled={pristine || submitting} submit>
        {isNew ? 'Lag gruppe' : 'Lagre gruppe'}
      </Button>
    </Form>
  );
}

export default reduxForm({
  form: 'groupForm'
})(GroupForm);
