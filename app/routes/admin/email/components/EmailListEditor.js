//@flow

import React from 'react';
import Button from 'app/components/Button';
import { createValidator, required } from 'app/utils/validation';
import { reduxForm } from 'redux-form';
import { roleOptions } from 'app/utils/constants';
import { TextInput, SelectInput } from 'app/components/Form';
import { Form, Field } from 'redux-form';

export type Props = {
  emailListId?: number,
  submitting: boolean,
  handleSubmit: Function => void,
  push: string => void,
  mutateFunction: Object => Promise<*>
};

const EmailListEditor = ({
  emailListId,
  mutateFunction,
  submitting,
  handleSubmit,
  push
}: Props) => {
  const onSubmit = data => {
    mutateFunction({
      id: data.id,
      email: data.email,
      name: data.name,
      groupRoles: (data.groupRoles || []).map(groupRole => groupRole.value),
      groups: (data.groups || []).map(group => group.value),
      users: (data.users || []).map(user => user.value)
    }).then(({ payload }) => {
      if (!emailListId) {
        push(`/admin/email/lists/${payload.result}`);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field
        required
        placeholder="Abakus"
        name="name"
        label="Navnet på Epostliste"
        component={TextInput.Field}
      />
      <Field
        required
        disabled={emailListId}
        placeholder="abakus"
        suffix="@abakus.no"
        name="email"
        label="Epost"
        component={TextInput.Field}
      />
      <Field
        label="Brukere"
        name="users"
        multi
        placeholder="Inviter en ny bruker"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        label="Grupper"
        name="groups"
        multi
        placeholder="Inviter en ny bruker"
        filter={['users.abakusgroup']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        label="Roller"
        name="groupRoles"
        multi
        placeholder="Velg rolle"
        options={roleOptions}
        component={SelectInput.Field}
      />
      <Button submit disabled={submitting}>
        {emailListId ? 'Oppdater epostliste' : 'Lag epostliste'}
      </Button>
    </Form>
  );
};

export default reduxForm({
  form: 'emailList',
  enableReinitialize: true,
  validate: createValidator({
    email: [required()],
    name: [required()]
  })
})(EmailListEditor);
