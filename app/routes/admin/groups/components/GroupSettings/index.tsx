import { Field } from 'react-final-form';
import { useParams } from 'react-router-dom-v5-compat';
import { editGroup } from 'app/actions/GroupActions';
import {
  Form,
  TextInput,
  EditorField,
  Button,
  ImageUploadField,
  CheckBox,
  LegoFinalForm,
} from 'app/components/Form';
import Tooltip from 'app/components/Tooltip';
import { selectGroup } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';
import styles from './index.css';
import type { FormProps } from 'redux-form';

type Props = FormProps;

const validate = createValidator({
  name: [required()],
  description: [required()],
});
const logoValidator = (value) => (value ? undefined : 'Bilde er påkrevd');

const GroupSettings = ({ submitting, invalid, initialized }: Props) => {
  const { groupId } = useParams();
  const group = useAppSelector((state) => selectGroup(state, { groupId }));

  const dispatch = useAppDispatch();

  const handleSubmit = (values) => {
    dispatch(editGroup(values));
  };

  const isNew = !group;

  return (
    <LegoFinalForm
      onSubmit={handleSubmit}
      validate={validate}
      initialValues={group}
    >
      {({ handleSubmit }) => (
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
            label="Kontakt-e-post"
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
          <Button disabled={invalid || submitting} submit>
            {isNew ? 'Opprett gruppe' : 'Lagre endringer'}
          </Button>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default GroupSettings;
