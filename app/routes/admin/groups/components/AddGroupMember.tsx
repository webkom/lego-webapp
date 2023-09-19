import { Field } from 'react-final-form';
import { addMember } from 'app/actions/GroupActions';
import { Button, Form, LegoFinalForm } from 'app/components/Form';
import SelectInput from 'app/components/Form/SelectInput';
import { useAppDispatch } from 'app/store/hooks';
import { ROLES, type RoleType } from 'app/utils/constants';
import { createValidator, required } from 'app/utils/validation';

const roles = Object.keys(ROLES)
  .sort()
  .map((role: RoleType) => ({
    value: role,
    label: ROLES[role],
  }));

const validate = createValidator({
  user: [required()],
  role: [required()],
});

const AddGroupMember = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values, form) => {
    await dispatch(
      addMember({
        user: values.user,
        role: values.role,
      })
    );
    form.reset();
  };

  return (
    <LegoFinalForm
      onSubmit={handleSubmit}
      validate={validate}
      initialValues={{
        role: roles.find(({ value }) => value === 'member'),
      }}
    >
      {({ handleSubmit, submitting, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <h3>Legg til ny bruker</h3>
          <Field
            label="Bruker"
            name="user"
            placeholder="Inviter en ny bruker"
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
          />

          <Field
            label="Rolle"
            name="role"
            placeholder="Velg rolle"
            options={roles}
            component={SelectInput.Field}
          />

          <Button submit disabled={submitting || pristine}>
            Legg til bruker
          </Button>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default AddGroupMember;
