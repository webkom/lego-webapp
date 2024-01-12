import { Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { editGroup } from 'app/actions/GroupActions';
import { Button, Form, LegoFinalForm } from 'app/components/Form';
import TextInput from 'app/components/Form/TextInput';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, matchesRegex, required } from 'app/utils/validation';
import type { DetailedGroup } from 'app/store/models/Group';

type Props = {
  group: DetailedGroup;
};

const validate = createValidator({
  permission: [
    required(),
    matchesRegex(
      /^\/([a-zA-Z]+\/)+$/,
      'Rettigheter kan bare inneholde skråstrek og bokstaver, og må begynne og ende med en skråstrek.'
    ),
  ],
});

const AddGroupPermission = ({ group }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values, form) => {
    const updatedGroup = {
      ...group,
      permissions: group.permissions.concat(values.permission),
    };
    dispatch(editGroup(updatedGroup)).then(() => {
      form.reset();
      if (group.type === 'interesse') {
        navigate(`/interest-groups/${group.id}`);
      }
    });
  };

  return (
    <LegoFinalForm onSubmit={handleSubmit} validate={validate}>
      {({ handleSubmit, submitting, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <h3>Legg til ny rettighet</h3>
          <Field
            label="Rettighet"
            name="permission"
            placeholder="/sudo/admin/events/create/"
            component={TextInput.Field}
          />

          <Button submit disabled={submitting || pristine}>
            Legg til rettighet
          </Button>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default AddGroupPermission;
