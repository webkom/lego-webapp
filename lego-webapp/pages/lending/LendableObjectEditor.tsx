import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import {
  EditorField,
  Form,
  ImageUploadField,
  LegoFinalForm,
  SelectInput,
  SubmitButton,
  TextInput,
} from '~/components/Form';
import { normalizeObjectPermissions } from '~/components/Form/ObjectPermissions';
import {
  createLendableObject,
  editLendableObject,
} from '~/redux/actions/LendableObjectActions';
import { useAppDispatch } from '~/redux/hooks';
import { createValidator, required } from '~/utils/validation';
import style from './LendableObjectEditor.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  CreateLendableObject,
  EditLendableObject,
} from '~/redux/models/LendableObject';

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

export const LendableObjectEditor = ({ initialValues }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <LegoFinalForm<FormValues>
      initialValues={initialValues}
      validate={validate}
      onSubmit={async (values) => {
        const transformedValues: CreateLendableObject | EditLendableObject = {
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
          <div className={style.fields}>
            <div className={style.thumbnail}>
              <Field
                name="image"
                component={ImageUploadField}
                aspectRatio={1}
                img={initialValues?.image}
              />
            </div>
            <div className={style.detailsContainer}>
              <div className={style.nameLocation}>
                <Field
                  label="Navn"
                  name="title"
                  placeholder="Grill"
                  component={TextInput.Field}
                />
                <Field
                  label="Lokasjon"
                  name="location"
                  placeholder="A3-lageret"
                  component={TextInput.Field}
                />
              </div>
              <Field
                label="Beskrivelse"
                name="description"
                placeholder="Grill til utlån"
                component={EditorField.Field}
              />
            </div>
          </div>
          <Field
            name="canViewGroups"
            label="Grupper med lånetilgang"
            component={SelectInput.AutocompleteField}
            isMulti
            filter={['users.abakusgroup']}
            placeholder="Velg brukere"
          />
          <Field
            name="canEditGroups"
            label="Ansvarlige grupper"
            component={SelectInput.AutocompleteField}
            isMulti
            filter={['users.abakusgroup']}
            description="Grupper som har endretilgang"
            placeholder="Velg brukere"
          />
          <Field
            name="canEditUsers"
            label="Ansvarlige brukere"
            component={SelectInput.AutocompleteField}
            description="Brukere som mottar e-postvarsler"
            isMulti
            filter={['users.user']}
            placeholder="Velg brukere"
          />
          <SubmitButton>Lagre</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};
