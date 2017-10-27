// @flow
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import type { FieldProps } from 'redux-form';
import { Button, Form } from 'app/components/Form';
import SelectInput from 'app/components/Form/SelectInput';
import { createValidator, required } from 'app/utils/validation';
import { ROLES } from 'app/utils/constants';

type Props = FieldProps & {
  group: Object
};

const roles = Object.keys(ROLES)
  .sort()
  .map(role => ({
    value: role,
    label: ROLES[role]
  }));

const AddGroupMember = ({
  addMember,
  submitting,
  group,
  handleSubmit
}: Props) => {
  const onSubmit = handleSubmit(({ user, role }) =>
    addMember({
      role,
      userId: user.id,
      groupId: group.id
    })
  );

  return (
    <Form onSubmit={onSubmit}>
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

export default reduxForm({
  form: 'add-user',
  validate
})(AddGroupMember);
