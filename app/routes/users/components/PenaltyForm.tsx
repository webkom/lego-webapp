import { Button, Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { addPenalty } from 'app/actions/UserActions';
import {
  Form,
  TextArea,
  TextInput,
  SelectInput,
  LegoFinalForm,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createValidator, isInteger, required } from 'app/utils/validation';
import type { searchMapping } from 'app/reducers/search';
import type { ID } from 'app/store/models';
import type { FormApi } from 'final-form';

type FormValues = {
  reason: string;
  weight: string | number;
  sourceEvent: (typeof searchMapping)['events.event'];
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  reason: [required('Du må skrive en begrunnelse')],
  weight: [
    required('Du må sette en vekt'),
    isInteger('Vekten må være et heltall'),
  ],
});

type Props = {
  userId: ID;
};

const PenaltyForm = ({ userId }: Props) => {
  const [hidden, setHidden] = useState(true);
  const [sent, setSent] = useState(false);

  const dispatch = useAppDispatch();

  const onSubmit = (values: FormValues, form: FormApi<FormValues>) => {
    dispatch(
      addPenalty({
        ...values,
        user: userId,
        sourceEvent: values.sourceEvent && values.sourceEvent.value,
      })
    ).then(() => {
      setSent(true);
      form.reset();
    });
  };

  const handleHide = () => {
    setHidden(!hidden);
  };

  const actionGrant = useAppSelector((state) => state.allowed.penalties);

  if (!actionGrant) {
    return;
  }

  const showForm = !hidden && !sent;

  return (
    <Flex column gap="1rem">
      <div>
        {!sent ? (
          <Button onClick={handleHide}>
            {!showForm ? 'Lag ny prikk' : 'Avbryt'}
          </Button>
        ) : (
          <i>Prikken er registrert</i>
        )}
      </div>

      {showForm && (
        <TypedLegoForm onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                name="reason"
                component={TextArea.Field}
                placeholder="Skriv begrunnelse for prikk"
              />
              <Field
                name="weight"
                component={TextInput.Field}
                placeholder="Hvor tungt vektlegges prikken?"
              />
              <Field
                name="sourceEvent"
                placeholder="Arrangement"
                filter={['events.event']}
                component={SelectInput.AutocompleteField}
              />
              <SubmitButton>Lag prikk</SubmitButton>
            </Form>
          )}
        </TypedLegoForm>
      )}
    </Flex>
  );
};

export default PenaltyForm;
