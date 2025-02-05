import { Button } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'app/actions/UserActions';
import { TextInput, Form, LegoFinalForm } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';

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
  const navigate = useNavigate();

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
