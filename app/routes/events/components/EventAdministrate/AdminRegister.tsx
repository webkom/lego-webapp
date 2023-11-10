import { LoadingIndicator } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { adminRegister, waitinglistPoolId } from 'app/actions/EventActions';
import { TextEditor, SelectInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectPoolsForEvent } from 'app/reducers/events';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';
import type { DetailedEvent } from 'app/store/models/Event';
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

type Props = {
  event: DetailedEvent;
};

const AdminRegister = (props: Props) => {
  const { event } = props;
  const fetching = useAppSelector((state) => state.events.fetching);
  const pools = useAppSelector((state) =>
    selectPoolsForEvent(state, {
      eventId: event.id,
    }),
  );

  const dispatch = useAppDispatch();
  const onSubmit = async (values: FormValues, form: FormApi<FormValues>) => {
    await Promise.all(
      values.users.map((user) =>
        dispatch(
          adminRegister(
            event.id,
            user.id,
            values.pool?.value,
            values.feedback,
            values.adminRegistrationReason,
          ),
        ),
      ),
    );
    form.restart();
  };

  return (
    <LoadingIndicator loading={fetching}>
      <LegoFinalForm onSubmit={onSubmit} validate={validate} subscription={{}}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              required
              name="users"
              component={SelectInput.AutocompleteField}
              filter={['users.user']}
              placeholder="Brukere"
              label="Brukere"
              isMulti={true}
            />
            <Field
              required
              name="pool"
              component={SelectInput.Field}
              placeholder="Pool"
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
      </LegoFinalForm>
    </LoadingIndicator>
  );
};

const validate = createValidator({
  adminRegistrationReason: [required()],
  pool: [required()],
  users: [
    (value: FormValues['users']) => [
      value && value.length > 0,
      'Må velge brukere',
    ],
  ],
});

export default AdminRegister;
