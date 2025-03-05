import { Field, FormSpy } from 'react-final-form';
import { useNavigate } from 'react-router';
import { CreateLendingRequest } from 'app/actions/LendingRequestActions';
import {
  DatePicker,
  EditorField,
  Fields,
  Form,
  ImageUploadField,
  LegoFinalForm,
  ObjectPermissions,
  SubmitButton,
  TextInput,
} from 'app/components/Form';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';
import type { CreateLendingRequest } from 'app/store/models/LendableObject';
import moment from 'moment';
import { Dateish } from 'app/models';

type FormValues = {
  id?: EntityId;
  start_date: Date;
  end_date: Date;
  comment: string;
};

type Props = {
  initialValues?: Partial<FormValues>;
};

const validate = createValidator({
  start_date: [required()],
  end_date: [required()],
});

const onSubmit = (values) => {
  const formValues = {
    ...values,
    startTime: values.date[0],
    endTime: values.date[1],
  };
};

// HEre
export const LendingRequestEditor = ({ initialValues }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <LegoFinalForm
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            label="Navn"
            name="title"
            placeholder="Grill"
            component={TextInput.Field}
          />
          <Field
            label="Kommentar"
            name="description"
            placeholder="Grill til utlån"
            component={EditorField.Field}
          />
          <FormSpy subscription={{ values: true }}>
            {({ values }) => (
              <Field
                name="date"
                label="Dato"
                range
                component={DatePicker.Field}
                onBlur={(value: [Dateish, Dateish]) => {
                  const startTime = moment(value[0]);
                  const endTime = moment(values.date[1]);
                  if (endTime.isBefore(startTime)) {
                    form.change('date', [
                      startTime,
                      endTime.clone().add(2, 'hours').set('minute', 0),
                    ]);
                  }
                }}
              />
            )}
          </FormSpy>
          <SubmitButton>Lån objekt</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};
