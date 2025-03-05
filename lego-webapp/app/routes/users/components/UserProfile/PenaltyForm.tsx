import { Button, Flex, Icon } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Field } from 'react-final-form';
import {
  Form,
  TextArea,
  TextInput,
  SelectInput,
  LegoFinalForm,
} from '~/components/Form';
import { SubmitButton } from '~/components/Form/SubmitButton';
import { addPenalty } from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { createValidator, isInteger, required } from '~/utils/validation';
import styles from './Penalties.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { FormApi } from 'final-form';
import type { searchMapping } from '~/redux/slices/search';

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
  userId: EntityId;
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
        sourceEvent: values.sourceEvent?.value,
      }),
    ).then(() => {
      setHidden(true);
      setSent(true);
      setTimeout(() => {
        setSent(false);
      }, 3000);
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
    <>
      <div className={styles.divider} />

      <div>
        {!sent ? (
          <Button onPress={handleHide}>
            {!showForm ? 'Gi ny prikk' : 'Avbryt'}
          </Button>
        ) : (
          <Flex
            alignItems="center"
            gap="var(--spacing-sm)"
            className={styles.successMessage}
          >
            <Icon name="checkmark-outline" className={styles.success} />
            <span>Prikken er registrert!</span>
          </Flex>
        )}
      </div>

      {showForm && (
        <TypedLegoForm onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                name="reason"
                component={TextArea.Field}
                placeholder="Skriv begrunnelse for prikken"
              />
              <Field
                name="weight"
                component={TextInput.Field}
                placeholder="Hvor tungt vektlegges prikken?"
              />
              <Field
                name="sourceEvent"
                placeholder="For hvilket arrangement?"
                filter={['events.event']}
                component={SelectInput.AutocompleteField}
              />
              <SubmitButton>Gi prikk</SubmitButton>
            </Form>
          )}
        </TypedLegoForm>
      )}
    </>
  );
};

export default PenaltyForm;
