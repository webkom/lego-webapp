import { EntityId } from '@reduxjs/toolkit';
import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import { Dateish } from 'app/models';
import {
  DatePicker,
  Form,
  LegoFinalForm,
  SubmitButton,
  TextInput,
} from '~/components/Form';
import { createLendingRequest } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch } from '~/redux/hooks';
import { CreateLendingRequest } from '~/redux/models/LendingRequest';
import { useParams } from '~/utils/useParams';

type FormValues = {
  date: Dateish[];
  endDate: Dateish;
  comment: string;
  lendableObject: EntityId;
};

type LendingRequestEditorProps = {
  initialValues?: Partial<FormValues>;
  onRangeChange?: (range: [Dateish, Dateish]) => void;
};

const LendingRequestEditor = ({
  initialValues,
  onRangeChange,
}: LendingRequestEditorProps) => {
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

  return (
    <LegoFinalForm onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            name="date"
            label="Dato"
            range
            component={DatePicker.Field}
            onChange={(value: [Dateish, Dateish]) => {
              if (onRangeChange && value && value.length === 2) {
                onRangeChange(value);
              }
            }}
          />
          <Field
            label="Kommentar"
            name="comment"
            placeholder="Legg til praktisk info..."
            component={TextInput.Field}
          />

          <SubmitButton>Send forespørsel</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default LendingRequestEditor;
