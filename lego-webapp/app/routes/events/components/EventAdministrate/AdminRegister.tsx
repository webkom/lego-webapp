import { LoadingIndicator } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { useParams } from 'react-router';
import {
  TextEditor,
  SelectInput,
  Form,
  SubmitButton,
  SubmissionError,
} from '~/components/Form';
import LegoFinalForm from '~/components/Form/LegoFinalForm';
import { adminRegister, waitinglistPoolId } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectPoolsForEvent } from '~/redux/slices/events';
import { createValidator, required } from '~/utils/validation';
import type { FormApi } from 'final-form';
import type { AutocompleteUser } from '~/redux/models/User';

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
  const { eventId } = useParams<{ eventId: string }>() as { eventId: string };
  const fetching = useAppSelector((state) => state.events.fetching);
  const pools = useAppSelector((state) => selectPoolsForEvent(state, eventId));

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
            values.adminRegistrationReason,
          ),
        ),
      ),
    );
    form.reset();
  };

  return (
    <LoadingIndicator loading={fetching}>
      <TypedLegoForm
        onSubmit={onSubmit}
        validate={validate}
        validateOnSubmitOnly
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
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
              label="Kommentar"
              name="feedback"
              component={TextEditor.Field}
            />
            <SubmissionError />
            <SubmitButton>Adminregistrer</SubmitButton>
          </Form>
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
