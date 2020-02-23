// @flow
import React from 'react';
import { Field, SubmissionError } from 'redux-form';
import type { FormProps } from 'redux-form';
import { legoForm, Button, Form } from 'app/components/Form';
import SelectInput from 'app/components/Form/SelectInput';
import { createValidator, required } from 'app/utils/validation';
import { ROLES } from 'app/utils/constants';

type Props = FormProps & {
  group: Object
};

const roles = Object.keys(ROLES)
  .sort()
  .map(role => ({
    value: role,
    label: ROLES[role]
  }));

const AddGroupMember = ({ submitting, group, handleSubmit }: Props) => {
  return (
    <Form onSubmit={handleSubmit}>
      <h3>Legg til ny bruker</h3>
      <Field
        label="Bruker"
        name="user"
        placeholder="Inviter en ny bruker"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
      />

      <Field
        simpleValue
        label="Rolle"
        name="role"
        placeholder="Velg rolle"
        options={roles}
        component={SelectInput.Field}
      />

      <Button submit disabled={submitting}>
        Legg til bruker
      </Button>
    </Form>
  );
};

const validate = createValidator({
  user: [required()],
  role: [required()]
});

export default legoForm({
  form: 'add-user',
  validate,
  initialValues: { role: 'member' },
  onSubmitSuccess: (result, dispatch, { reset }: Props) => reset(),
  onSubmit: ({ user, role }, dispatch, props: Props) =>
    props
      .addMember({
        role,
        userId: user.id,
        groupId: props.group.id
      })
      .catch(err => {
        if (err.payload.response.status === 409) {
          throw new SubmissionError({
            user: 'Denne brukeren er allerede med i gruppen.'
          });
        }

        throw err;
      })
})(AddGroupMember);
