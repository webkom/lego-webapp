import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import { GroupType } from 'app/models';
import {
  Form,
  TextInput,
  EditorField,
  ImageUploadField,
} from '~/components/Form';
import LegoFinalForm from '~/components/Form/LegoFinalForm';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import { createGroup, editGroup } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectGroupById } from '~/redux/slices/groups';
import { EDITOR_EMPTY } from '~/utils/constants';
import { useParams } from '~/utils/useParams';
import { createValidator, required } from '~/utils/validation';
import type { GroupPageParams } from '~/pages/admin/groups/+Layout';
import type { DetailedGroup } from '~/redux/models/Group';

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
          <Field
            label="Vis badge på brukerprofiler"
            name="showBadge"
            type="checkbox"
            component={ToggleSwitch.Field}
          />
          <Field
            label="Aktiv gruppe"
            name="active"
            type="checkbox"
            component={ToggleSwitch.Field}
          />
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
