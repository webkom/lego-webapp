import { Field } from 'redux-form';
import {
  Form,
  TextInput,
  EditorField,
  Button,
  ImageUploadField,
  CheckBox,
  legoForm,
} from 'app/components/Form';
import type { DetailedGroup } from 'app/store/models/Group';
import { createValidator, required } from 'app/utils/validation';
import styles from './index.css';
import type { FormProps } from 'redux-form';

type OwnProps = {
  handleSubmitCallback: (arg0: Record<string, any>) => Promise<any>;
  group: DetailedGroup;
};

type Props = OwnProps & FormProps;

const logoValidator = (value) => (value ? undefined : 'Bilde er påkrevd');

function GroupForm({
  handleSubmit,
  group,
  submitting,
  invalid,
  initialized,
}: Props) {
  const isNew = !group;
  return (
    <Form onSubmit={handleSubmit}>
      <Field
        label="Gruppenavn"
        placeholder="Strikk&Drikk"
        name="name"
        component={TextInput.Field}
        required
      />
      <Field
        label="Kort beskrivelse"
        placeholder="Vi drikker og strikker"
        name="description"
        component={TextInput.Field}
        required
      />
      <Field
        label="Kontakt e-post"
        placeholder="Primær e-post for kommunikasjon med gruppen"
        name="contactEmail"
        component={TextInput.Field}
      />
      <Field
        label="Vis badge på brukerprofiler"
        description="Skal gruppen vises på brukerprofilen til folk?"
        name="showBadge"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
      <Field
        label="Aktiv gruppe"
        description="Er dette en aktiv gruppe?"
        name="active"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
      <Field
        label="Beskrivelse"
        placeholder="Vil du strikke din egen lue? Eller har du allerede […]"
        name="text"
        component={EditorField.Field}
        initialized={initialized}
      />
      <Field
        name="logo"
        component={ImageUploadField}
        label="Gruppelogo"
        aspectRatio={1}
        img={group && group.logo}
        className={styles.logo}
        validate={(value) => isNew && logoValidator(value)}
        required
      />
      <Button success={!isNew} disabled={invalid || submitting} submit>
        {isNew ? 'Lag gruppe' : 'Lagre endringer'}
      </Button>
    </Form>
  );
}

export default legoForm({
  form: 'groupForm',
  enableReinitialize: true,
  validate: createValidator({
    name: [required()],
    description: [required()],
  }),
  onSubmit: (data, dispatch, { handleSubmitCallback }: Props) =>
    handleSubmitCallback(data),
})(GroupForm);
