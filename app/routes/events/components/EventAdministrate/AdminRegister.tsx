import { LoadingIndicator } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { useParams } from 'react-router-dom';
import { adminRegister, waitinglistPoolId } from 'app/actions/EventActions';
import { TextEditor, SelectInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectPoolsForEvent } from 'app/reducers/events';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';
import type { AutocompleteUser } from 'app/store/models/User';
import type { FormApi } from 'final-form';

type FormValues = {
  users: AutocompleteUser[];
  pool: {
    value: number;
    label: string;
  };
  feedback: string;
  adminRegistrationReason: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const AdminRegister = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const fetching = useAppSelector((state) => state.events.fetching);
  const pools = useAppSelector((state) =>
    selectPoolsForEvent(state, {
      eventId: eventId,
    })
  );

  const dispatch = useAppDispatch();
  const onSubmit = async (values: FormValues, form: FormApi<FormValues>) => {
    await Promise.all(
      values.users.map((user) =>
        dispatch(
          adminRegister(
            eventId,
            user.id,
            values.pool?.value,
            values.feedback,
            values.adminRegistrationReason
          )
        )
      )
    );
    form.restart();
  };

  return (
    <LoadingIndicator loading={fetching}>
      <TypedLegoForm onSubmit={onSubmit} validate={validate} subscription={{}}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              required
              name="users"
              component={SelectInput.AutocompleteField}
              filter={['users.user']}
              label="Brukere"
              isMulti={true}
            />
            <Field
              required
              name="pool"
              component={SelectInput.Field}
              label="Pool"
              options={pools
                .map((pool) => ({
                  value: pool.id,
                  label: pool.name,
                }))
                .concat([
                  {
                    value: waitinglistPoolId,
                    label: 'Venteliste',
                  },
                ])}
            />
            <Field
              required
              placeholder="Begrunnelse"
              label="Begrunnelse"
              name="adminRegistrationReason"
              component={TextEditor.Field}
            />
            <Field
              placeholder="Tilbakemelding"
              label="Melding til arrangør"
              name="feedback"
              component={TextEditor.Field}
            />
            <SubmissionError />
            <SubmitButton>Adminregistrer</SubmitButton>
          </form>
        )}
      </TypedLegoForm>
    </LoadingIndicator>
  );
};

const validate = createValidator({
  adminRegistrationReason: [required()],
  pool: [required()],
  users: [
    (value: FormValues['users']) => [
      value && value.length > 0,
      'Du må velge brukere',
    ],
  ],
});

export default AdminRegister;
