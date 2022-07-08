// @flow

import type { FormProps } from 'react-redux';
import { Field } from 'redux-form';

import { waitinglistPoolId } from 'app/actions/EventActions';
import Button from 'app/components/Button';
import { legoForm, SelectInput, TextEditor } from 'app/components/Form';
import { RenderErrorMessage } from 'app/components/Form/Field';
import type { EventPool, ID, User } from 'app/models';

type Props = {
  eventId: ID,
  adminRegister: (ID, ID, ID, string, string) => Promise<*>,
  pools: Array<EventPool>,
} & FormProps;

const AdminRegister = ({
  eventId,
  handleSubmit,
  adminRegister,
  pools,
  invalid,
  pristine,
  submitting,

  error,
}: Props) => {
  return (
    <div style={{ width: '400px' }}>
      <form onSubmit={handleSubmit}>
        <Field
          placeholder="Begrunnelse"
          label="Begrunnelse"
          name="adminRegistrationReason"
          component={TextEditor.Field}
        />
        <Field
          placeholder="Tilbakemelding"
          label="Tilbakemelding"
          name="feedback"
          component={TextEditor.Field}
        />
        <Field
          name="pool"
          component={SelectInput.Field}
          placeholder="Pool"
          label="Pool"
          options={pools
            .map((pool) => ({ value: pool.id, label: pool.name }))
            .concat([{ value: waitinglistPoolId, label: 'Venteliste' }])}
        />
        <Field
          name="user"
          component={SelectInput.AutocompleteField}
          filter={['users.user']}
          placeholder="Bruker"
          label="Bruker"
        />
        <RenderErrorMessage error={error} />
        <Button type="submit" disabled={invalid || pristine || submitting}>
          Registrer
        </Button>
      </form>
    </div>
  );
};

function validateForm(data) {
  const errors = {};

  if (!data.reason) {
    errors.reason = 'Forklaring er påkrevet';
  }

  if (!data.pool) {
    errors.pool = 'Pool er påkrevet';
  }

  if (!data.user) {
    errors.user = 'Bruker er påkrevet';
  }

  return errors;
}
const onSubmit = (
  {
    user,
    pool,
    feedback,
    adminRegistrationReason,
  }: {
    user: User,
    pool: { value: number, label: string },
    feedback: string,
    adminRegistrationReason: string,
  },
  dispatch,
  { reset, eventId, adminRegister }: Props
) =>
  adminRegister(
    eventId,
    user.id,
    pool?.value,
    feedback,
    adminRegistrationReason
  ).then(() => {
    reset();
  });

export default legoForm({
  form: 'adminRegister',
  validate: validateForm,
  onSubmit,
})(AdminRegister);
