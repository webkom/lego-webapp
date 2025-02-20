import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useParams, useNavigate } from 'react-router';
import { Form, LegoFinalForm, TextInput } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { createValidator, required } from 'app/utils/validation';
import {
  createOAuth2Application,
  fetchOAuth2Application,
  updateOAuth2Application,
} from '~/redux/actions/OAuth2Actions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectOAuth2ApplicationById } from '~/redux/slices/oauth2Applications';

type FormValues = {
  name?: string;
  description?: string;
  redirectUris?: string;
  clientId?: string;
  clientSecret?: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  name: [required()],
  description: [required()],
  redirectUris: [required()],
});

const UserSettingsOAuth2Form = () => {
  const { applicationId } = useParams<{ applicationId?: string }>();
  const isNew = applicationId === undefined;
  const application = useAppSelector((state) =>
    selectOAuth2ApplicationById(state, applicationId),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchUserSettingsOAuth2Edit',
    () =>
      applicationId && dispatch(fetchOAuth2Application(Number(applicationId))),
    [],
  );

  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(
      isNew ? createOAuth2Application(data) : updateOAuth2Application(data),
    ).then(() => {
      navigate('/users/me/settings/oauth2');
    });
  };

  const initialValues = isNew ? {} : application;

  return (
    <>
      <h2>{isNew ? 'Opprett' : 'Endre'} applikasjon</h2>

      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder="Navn"
              label="Navn"
              name="name"
              component={TextInput.Field}
            />

            <Field
              placeholder="Beskrivelse"
              label="Beskrivelse"
              name="description"
              component={TextInput.Field}
            />

            <Field
              placeholder="Vidresend til URL"
              label="Redirect URL"
              name="redirectUris"
              component={TextInput.Field}
            />

            {!isNew && (
              <Field
                placeholder="Client ID"
                label="Client ID"
                name="clientId"
                component={TextInput.Field}
                readOnly
                props={{
                  disabled: true,
                }}
              />
            )}

            {!isNew && (
              <Field
                placeholder="Client secret"
                label="Client secret"
                name="clientSecret"
                component={TextInput.Field}
                readOnly
                props={{
                  disabled: true,
                }}
              />
            )}

            <SubmitButton>Send</SubmitButton>
          </Form>
        )}
      </TypedLegoForm>
    </>
  );
};

export default UserSettingsOAuth2Form;
