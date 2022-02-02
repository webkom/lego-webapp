// @flow

import { useState } from 'react';
import Button from 'app/components/Button';
import styles from './DeleteUser.css';
import { TextInput, Form, legoForm } from 'app/components/Form';
import type { FormProps } from 'redux-form';
import { Field } from 'redux-form';
import { type UserEntity } from 'app/reducers/users';
import { createValidator, required } from 'app/utils/validation';

type Props = FormProps & {
  push: (string) => void,
  deleteUser: (string) => Promise<void>,
  user: UserEntity,
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
    <div>
      {show === false && (
        <Button className={styles.saveButton} onClick={() => setShow(true)}>
          Gå videre til slett bruker
        </Button>
      )}
      {show && (
        <>
          <Button className={styles.saveButton} onClick={() => setShow(false)}>
            Angre
          </Button>
          <h3> Skriv inn passordet ditt: </h3>
          <Form onSubmit={handleSubmit}>
            <Field
              label="Nåværende passord"
              name="password"
              type="password"
              autocomplete="current-password"
              component={TextInput.Field}
            />
            <Button disabled={disabledButton} dark submit>
              Slett Bruker
            </Button>
          </Form>
        </>
      )}
    </div>
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
