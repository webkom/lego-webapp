import { Card, Page } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import {
  Form,
  LegoFinalForm,
  TextInput,
  SubmitButton,
} from '~/components/Form';
import { resetPassword } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import useQuery from '~/utils/useQuery';
import { createValidator, required, sameAs } from '~/utils/validation';
import PasswordField from '../_components/PasswordField';
import { validPassword } from '../utils';

type FormValues = {
  password: string;
  retypeNewPassword: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const UserResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const {
    query: { token },
  } = useQuery({ token: '' });

  const onSubmit = (props: FormValues) =>
    dispatch(
      resetPassword({
        token,
        ...props,
      }),
    ).then(() => {
      navigate('/');
    });

  const currentUser = useCurrentUser();
  const user = currentUser && {
    username: currentUser.username,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  };

  return (
    <Page title="Tilbakestill passord">
      {token ? (
        <TypedLegoForm onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <PasswordField label="Nytt passord" user={user} />
              <Field
                label="Gjenta nytt passord"
                autocomplete="new-password"
                name="retypeNewPassword"
                type="password"
                component={TextInput.Field}
              />

              <SubmitButton danger>Tilbakestill passord</SubmitButton>
            </Form>
          )}
        </TypedLegoForm>
      ) : (
        <Card severity="danger">
          <Card.Header>Ingen token ...</Card.Header>
        </Card>
      )}
    </Page>
  );
};

const validate = createValidator(
  {
    password: [required(), validPassword()],
    retypeNewPassword: [
      required(),
      sameAs('password', 'Passordene er ikke like'),
    ],
  },
  undefined,
  true,
);

export default UserResetPasswordForm;
