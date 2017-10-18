import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form, Button, TextInput } from 'app/components/Form';

export type Props = {
  handleSubmit: () => void,
  username: string,
  updateUser: () => Promise<*>,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean
};

const UpdateAllergies = ({
  handleSubmit,
  username,
  updateUser,
  invalid,
  pristine,
  submitting
}: Props) => (
  <Form
    onSubmit={handleSubmit(({ allergies }) =>
      updateUser(
        {
          username,
          allergies
        },
        { noRedirect: true }
      )
    )}
    style={{ marginBottom: '20px' }}
  >
    <div>
      <Field
        label="Allergier eller preferanser"
        placeholder="Ingen"
        name="allergies"
        component={TextInput.Field}
      />
      <Button submit disabled={invalid | pristine | submitting}>
        Oppdater
      </Button>
    </div>
  </Form>
);

export default reduxForm({ form: 'UpdateAllergies' })(UpdateAllergies);
