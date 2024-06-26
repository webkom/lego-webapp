import { Field } from 'react-final-form';
import { addMember } from 'app/actions/GroupActions';
import { Form, LegoFinalForm, SelectInput } from 'app/components/Form';
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
  onMemberAdded?: () => void;
};

const AddGroupMember = ({ groupId, onMemberAdded }: Props) => {
  const dispatch = useAppDispatch();

  const handleSubmit = (values, form) => {
    dispatch(
      addMember({
        groupId,
        userId: values.user.id,
        role: values.role.value,
      }),
    ).then(() => {
      form.reset();
      onMemberAdded?.();
    });
  };

  return (
    <LegoFinalForm
      onSubmit={handleSubmit}
      validate={validate}
      initialValues={{
        role: roleOptions.find(({ value }) => value === 'member'),
      }}
      subscription={{}}
      validateOnSubmitOnly
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h3>Legg til ny bruker</h3>
          <Field
            label="Bruker"
            name="user"
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
          />

          <Field
            label="Rolle"
            name="role"
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
