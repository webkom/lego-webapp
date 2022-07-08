// @flow
import type { FormProps } from 'redux-form';
import { Field } from 'redux-form';

import {
  Button,
  CheckBox,
  EditorField,
  Form,
  ImageUploadField,
  legoForm,
  TextInput,
} from 'app/components/Form';
import Tooltip from 'app/components/Tooltip';
import { createValidator, required } from 'app/utils/validation';

import styles from './index.css';

type OwnProps = {
  handleSubmitCallback: (Object) => Promise<*>,
  group: Object,
};

type Props = OwnProps & FormProps;

const logoValidator = (value) => (value ? undefined : 'Bilde er påkrevd');

function GroupForm({
  handleSubmit,
  handleSubmitCallback,
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
      <Tooltip content="Skal gruppen vises på brukerprofilen til folk?">
        <Field
          label="Vis badge på brukerprofiler"
          name="showBadge"
          component={CheckBox.Field}
          normalize={(v) => !!v}
        />
      </Tooltip>
      <Tooltip content="Er dette en aktiv gruppe?">
        <Field
          label="Aktiv gruppe"
          name="active"
          component={CheckBox.Field}
          normalize={(v) => !!v}
        />
      </Tooltip>
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
        {isNew ? 'Lag gruppe' : 'Lagre gruppe'}
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
