import { Field, FormSpy } from 'react-final-form';
import { useNavigate } from 'react-router';
import {
  createLendableObject,
  editLendableObject,
} from 'app/actions/LendableObjectActions';
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
import { normalizeObjectPermissions } from 'app/components/Form/ObjectPermissions';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';
import type { CreateLendingRequest } from 'app/store/models/LendableObject';
import moment from 'moment';
import { Dateish } from 'app/models';

type FormValues = {
  id?: EntityId;
  title: string;
  description: string;
  image: string;
  location: string;
  canViewGroups?: { label: string; value: EntityId }[];
  canEditGroups?: { label: string; value: EntityId }[];
  canEditUsers?: { label: string; value: EntityId }[];
};

type Props = {
  initialValues?: Partial<FormValues>;
};

const validate = createValidator({
  title: [required()],
  description: [required()],
  location: [required()],
});

// HEre
export const LendingRequestEditor = ({ initialValues }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <LegoFinalForm<FormValues>
      initialValues={initialValues}
      validate={validate}
      onSubmit={async (values) => {
        const transformedValues: CreateLendingRequest = {
          ...values,
          ...normalizeObjectPermissions(values),
        };
        const res = await dispatch(
          initialValues?.id
            ? editLendableObject({ ...transformedValues, id: initialValues.id })
            : createLendableObject({
                ...values,
                ...normalizeObjectPermissions(values),
              }),
        );
        navigate(`/lending/${res.payload.result}`);
      }}
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
