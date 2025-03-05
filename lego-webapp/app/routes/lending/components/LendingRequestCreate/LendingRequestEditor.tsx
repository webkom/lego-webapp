import moment from 'moment';
import { Field, FormSpy } from 'react-final-form';
import { useNavigate } from 'react-router';
import { Dateish } from 'app/models';
import {
  DatePicker,
  EditorField,
  Form,
  LegoFinalForm,
  SubmitButton,
} from 'lego-webapp/components/Form';
import { createLendingRequest } from 'lego-webapp/redux/actions/LendingRequestActions.ts';
import { useAppDispatch } from 'lego-webapp/redux/hooks';
import { createValidator, required } from 'lego-webapp/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';

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
            label="Kommentar"
            name="description"
            placeholder="Legg til praktisk info..."
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
