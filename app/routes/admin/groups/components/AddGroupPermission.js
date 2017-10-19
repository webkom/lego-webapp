// @flow
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import type { FieldProps } from 'redux-form';
import { Button, Form } from 'app/components/Form';
import TextInput from 'app/components/Form/TextInput';
import { createValidator, matchesRegex, required } from 'app/utils/validation';
import { omit } from 'lodash';

type Props = FieldProps & {
  group: Object
};

const AddGroupPermission = ({
  editGroup,
  submitting,
  group,
  handleSubmit
}: Props) => {
  const onSubmit = handleSubmit(({ permission }) =>
    editGroup({
      ...omit(group || {}, 'logo'),
      permissions: group.permissions.concat(permission)
    })
  );

  return (
    <Form onSubmit={onSubmit}>
      <h3>Legg til ny rettighet</h3>
      <Field
        label="Rettighet"
        name="permission"
        placeholder="/sudo/admin/events/create/"
        component={TextInput.Field}
      />

      <Button submit disabled={submitting}>
        Legg til rettighet
      </Button>
    </Form>
  );
};

const validate = createValidator({
  permission: [
    required(),
    matchesRegex(
      /^\/([a-zA-Z]+\/)+$/,
      'Rettigheter kan bare inneholde skråstrek og bokstaver, og må begynne og ende med en skråstrek.'
    )
  ]
});

export default reduxForm({
  form: 'add-permission',
  validate
})(AddGroupPermission);
