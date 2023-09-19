import { Field } from 'react-final-form';
import { addMember } from 'app/actions/GroupActions';
import { Form, LegoFinalForm } from 'app/components/Form';
import SelectInput from 'app/components/Form/SelectInput';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { useAppDispatch } from 'app/store/hooks';
import { roleOptions } from 'app/utils/constants';
import { createValidator, required } from 'app/utils/validation';

const validate = createValidator({
  user: [required()],
  role: [required()],
});

type Props = {
  groupId: string;
};

const AddGroupMember = ({ groupId }: Props) => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values, form) => {
    await dispatch(
      addMember({
        groupId,
        userId: values.user,
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
        role: roleOptions.find(({ value }) => value === 'member'),
      }}
      subscription={{}}
    >
      {({ handleSubmit }) => (
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
            options={roleOptions}
            component={SelectInput.Field}
          />

          <SubmissionError />
          <SubmitButton>Legg til bruker</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default AddGroupMember;
