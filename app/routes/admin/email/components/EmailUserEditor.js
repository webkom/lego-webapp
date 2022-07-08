//@flow

import { Field, Form, reduxForm } from 'redux-form';

import Button from 'app/components/Button';
import { CheckBox, SelectInput, TextInput } from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';

export type Props = {
  emailUserId?: number,
  submitting: boolean,
  handleSubmit: (Function) => void,
  push: (string) => void,
  mutateFunction: (Object) => Promise<*>,
};

const EmailUserEditor = ({
  emailUserId,
  mutateFunction,
  submitting,
  push,
  handleSubmit,
}: Props) => {
  const onSubmit = (data) => {
    mutateFunction({
      ...data,
      user: data.user.value,
      internalEmailEnabled: !!data.internalEmailEnabled,
    }).then(({ payload }) => {
      if (!emailUserId) {
        push(`/admin/email/users/${payload.result}`);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field
        label="Bruker"
        name="user"
        required
        disabled={emailUserId}
        placeholder="Velg bruker"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        required
        disabled={emailUserId}
        placeholder="abakus"
        suffix="@abakus.no"
        name="internalEmail"
        label="Gsuite Epost"
        component={TextInput.Field}
      />
      <Field
        label="Aktiv epost"
        name="internalEmailEnabled"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
      <Button submit disabled={submitting}>
        {emailUserId ? 'Oppdater epostbruker' : 'Lag epostbruker'}
      </Button>
    </Form>
  );
};

export default reduxForm({
  form: 'emailUser',
  enableReinitialize: true,
  validate: createValidator({
    email: [required()],
    name: [required()],
  }),
})(EmailUserEditor);
