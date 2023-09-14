import { Button } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Field } from 'redux-form';
import { TextInput, Form, legoForm } from 'app/components/Form';
import type { UserEntity } from 'app/reducers/users';
import { createValidator, required } from 'app/utils/validation';
import type { History } from 'history';
import type { FormProps } from 'redux-form';

type Props = FormProps & {
  push: History['push'];
  deleteUser: (arg0: string) => Promise<void>;
  user: UserEntity;
};

const DeleteUser = ({
  handleSubmit,
  invalid,
  pristine,
  submitting,
  user,
  ...props
}: Props) => {
  const disabledButton = invalid || pristine || submitting;
  const [show, setShow] = useState(false);
  return (
    <>
      {!show && (
        <Button danger onClick={() => setShow(true)}>
          Gå videre til sletting av bruker
        </Button>
      )}
      {show && (
        <>
          <Button onClick={() => setShow(false)}>Avbryt</Button>
          <h3> Skriv inn passordet ditt: </h3>
          <Form onSubmit={handleSubmit}>
            <Field
              label="Nåværende passord"
              name="password"
              type="password"
              autocomplete="current-password"
              component={TextInput.Field}
            />
            <Button danger disabled={disabledButton} submit>
              Slett bruker
            </Button>
          </Form>
        </>
      )}
    </>
  );
};

const validate = createValidator({
  password: [required()],
});
export default legoForm({
  form: 'deleteUser',
  validate,
  onSubmit: (data, dispatch, { deleteUser, push }: Props) =>
    deleteUser(data.password).then(() => push('/')),
})(DeleteUser);
