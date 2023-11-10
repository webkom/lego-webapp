import { Button } from '@webkom/lego-bricks';
import { Field } from 'redux-form';
import { Form, TextInput } from 'app/components/Form';

type Props = {
  create: boolean;
  invalid: boolean;
  pristine: boolean;
  submitting: boolean;
  application: Record<string, any>;
  handleSubmit: (arg0: any) => void;
  updateOAuth2Application: (application: Record<string, any>) => any;
  createOAuth2Application: (application: Record<string, any>) => any;
  push: (location: string) => void;
};

const UserSettingsOAuth2Form = (props: Props) => {
  const { invalid, pristine, submitting } = props;
  const disabledButton = invalid || pristine || submitting;

  const submit = (data) => {
    const handleSubmit = props.create
      ? props.createOAuth2Application
      : props.updateOAuth2Application;
    return handleSubmit(data).then(() =>
      props.push('/users/me/settings/oauth2'),
    );
  };

  return (
    <div>
      <h1>{props.create ? 'Opprett' : 'Endre'} applikasjon</h1>

      <Form onSubmit={props.handleSubmit(submit)}>
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

        {!props.create && (
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

        {!props.create && (
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

        <Button submit disabled={disabledButton}>
          Send
        </Button>
      </Form>
    </div>
  );
};

export default UserSettingsOAuth2Form;
