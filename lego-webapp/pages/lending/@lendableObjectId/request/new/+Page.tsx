import { Page } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import { Dateish } from 'app/models';
import {
  DatePicker,
  Form,
  LegoFinalForm,
  SubmitButton,
  TextInput,
} from '~/components/Form';
import HTTPError from '~/components/errors/HTTPError';
import { createLendingRequest } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { CreateLendingRequest } from '~/redux/models/LendingRequest';
import { selectLendableObjectById } from '~/redux/slices/lendableObjects';
import { useFeatureFlag } from '~/utils/useFeatureFlag';
import { useParams } from '~/utils/useParams';
import type { EntityId } from '@reduxjs/toolkit';

type FormValues = {
  date: Dateish[];
  endDate: Dateish;
  text: string;
  lendableObject: EntityId;
};

type Props = {
  initialValues?: Partial<FormValues>;
};

export const LendingRequestEditor = ({ initialValues }: Props) => {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();

  const dispatch = useAppDispatch();

  const onSubmit = (values: FormValues) => {
    const finalValues = {
      ...values,
      lendableObject: lendableObjectId,
      startDate: values.date[0],
      endDate: values.date[1],
    } as CreateLendingRequest;
    dispatch(createLendingRequest(finalValues)).then(() =>
      navigate('/lending/'),
    );
  };
  const lendingRequestActive = useFeatureFlag('lending-request');

  if (!lendingRequestActive) {
    return <HTTPError />;
  }

  return (
    <LegoFinalForm onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            label="Kommentar"
            name="text"
            placeholder="Legg til praktisk info..."
            component={TextInput.Field}
          />
          <Field name="date" label="Dato" range component={DatePicker.Field} />

          <SubmitButton>Send forespørsel</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default function LendingRequestCreate() {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();
  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendableObjectId),
  );
  const title = `Ny utlånsforespørsel - ${lendableObject?.title}`;

  return (
    <Page title={title} back={{ href: `/lending/` }}>
      <Helmet title={title} />
      <LendingRequestEditor />
    </Page>
  );
}
