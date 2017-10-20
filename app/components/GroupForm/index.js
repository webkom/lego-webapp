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
  group: Object
};

type Props = OwnProps & FieldProps;

function GroupForm({
  handleSubmit,
  handleSubmitCallback,
  group,
  submitting,
  pristine
}: Props) {
  const isNew = !group;

  return (
    <Form onSubmit={handleSubmit(handleSubmitCallback)}>
      <Field
        label="Gruppenavn"
        placeholder="Strikk&Drikk"
        name="name"
        component={TextInput.Field}
        required
      />
      <Field
        label="Kort beskrivelse"
        placeholder="Vi drikker og strikker"
        name="description"
        component={TextInput.Field}
        required
      />
      <Field
        label="Beskrivelse"
        placeholder="Vil du strikke din egen lue? Eller har du allerede […]"
        name="text"
        component={EditorField.Field}
      />
      <Field
        name="logo"
        component={ImageUploadField}
        label="Gruppelogo"
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
  form: 'groupForm',
  enableReinitialize: true
})(GroupForm);
