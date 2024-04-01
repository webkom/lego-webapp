import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createGroup, editGroup } from 'app/actions/GroupActions';
import {
  Form,
  TextInput,
  EditorField,
  ImageUploadField,
  CheckBox,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import Tooltip from 'app/components/Tooltip';
import { GroupType } from 'app/models';
import { selectGroupById } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EDITOR_EMPTY } from 'app/utils/constants';
import { createValidator, required } from 'app/utils/validation';
import styles from './index.css';
import type { GroupPageParams } from 'app/routes/admin/groups/components/GroupPage';
import type { DetailedGroup } from 'app/store/models/Group';

type FormValues = {
  name: string;
  description: string;
  contactEmail?: string;
  showBadge: boolean;
  active: boolean;
  text?: string;
  logo?: string | null;
  type?: GroupType;
};

const initialValues: Partial<FormValues> = {
  showBadge: true,
  active: true,
  text: EDITOR_EMPTY,
};

const TypedLegoForm = LegoFinalForm<FormValues>;

type Props = {
  isInterestGroup?: boolean;
};

const GroupForm = ({ isInterestGroup }: Props) => {
  const { groupId } = useParams<GroupPageParams>() as GroupPageParams;
  const group = useAppSelector((state) =>
    selectGroupById<DetailedGroup>(state, groupId),
  );
  const isNew = !groupId;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values: FormValues) => {
    if (isInterestGroup) {
      values.type = GroupType.Interest;
    }
    dispatch(isNew ? createGroup(values) : editGroup(values)).then(() => {
      if (group?.type === 'interesse') {
        navigate(`/interest-groups/${group.id}`);
      }
    });
  };

  // isNew also implies it is an interest group

  const validate = createValidator({
    name: [required()],
    description: [required()],
    logo: isInterestGroup ? [required('Bilde er påkrevd')] : [],
  });

  return (
    <TypedLegoForm
      onSubmit={handleSubmit}
      validate={validate}
      initialValues={
        isNew
          ? initialValues
          : { ...group, text: group?.text ? group.text : EDITOR_EMPTY } // editor does not render if text is empty string
      }
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
              type="checkbox"
              component={CheckBox.Field}
              parse={(v) => !!v}
            />
          </Tooltip>
          <Tooltip content="Er dette en aktiv gruppe?">
            <Field
              label="Aktiv gruppe"
              name="active"
              type="checkbox"
              component={CheckBox.Field}
              parse={(v) => !!v}
            />
          </Tooltip>
          <Field
            label="Beskrivelse"
            placeholder="Vil du strikke din egen lue? Eller har du allerede […]"
            name="text"
            component={EditorField.Field}
          />
          <Field
            name="logo"
            component={ImageUploadField}
            label="Gruppelogo"
            aspectRatio={1}
            img={group && group.logo}
            className={styles.logo}
            required={isInterestGroup}
          />

          <SubmissionError />
          <SubmitButton>
            {isNew ? 'Opprett interessegruppe' : 'Lagre endringer'}
          </SubmitButton>
        </Form>
      )}
    </TypedLegoForm>
  );
};

export default GroupForm;
