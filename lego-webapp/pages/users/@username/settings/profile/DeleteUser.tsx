import { Button } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import { TextInput, Form, LegoFinalForm } from '~/components/Form';
import { SubmitButton } from '~/components/Form/SubmitButton';
import { deleteUser } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { createValidator, required } from '~/utils/validation';

type FormValues = {
  password: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  password: [required()],
});

const DeleteUser = () => {
  const [show, setShow] = useState(false);

  const dispatch = useAppDispatch();

  const onSubmit = (data: { password: string }) =>
    dispatch(deleteUser(data.password)).then(() => {
      navigate('/');
    });

  return (
    <TypedLegoForm onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Button danger onPress={() => setShow((prev) => !prev)}>
            {show ? 'Avbryt' : 'Gå videre til sletting av bruker'}
          </Button>
          {show && (
            <>
              <Field
                label="Skriv inn ditt nåværende passord"
                name="password"
                placeholder="passord123"
                type="password"
                autocomplete="current-password"
                component={TextInput.Field}
              />
              <SubmitButton danger>Slett bruker</SubmitButton>
            </>
          )}
        </Form>
      )}
    </TypedLegoForm>
  );
};

export default DeleteUser;
