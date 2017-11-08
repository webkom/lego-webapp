// @flow

import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { SelectInput } from 'app/components/Form';
import Button from 'app/components/Button';
import type { ID, EventPool, EventRegistrationPresence } from 'app/models';
import type { ReduxFormProps } from 'app/types';

type Props = {
  eventId: ID,
  updatePresence: (number, number, string) => Promise<*>,
  pools: Array<EventPool>
} & ReduxFormProps;

const Abacard = ({
  eventId,
  handleSubmit,
  updatePresence,
  pools,
  invalid,
  pristine,
  submitting
}: Props) => {
  const onSubmit = (
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => {
    updatePresence(eventId, registrationId, presence);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="user"
          component={SelectInput.AutocompleteField}
          filter={['users.user']}
          placeholder="Bruker"
          label="Bruker"
        />
        <Button type="submit" disabled={invalid || pristine || submitting}>
          Registrer
        </Button>
      </form>
    </div>
  );
};

function validateForm(data) {
  const errors = {};

  if (!data.user) {
    errors.user = 'Bruker er påkrevet';
  }

  return errors;
}

export default reduxForm({
  form: 'abacard',
  validate: validateForm
})(Abacard);
