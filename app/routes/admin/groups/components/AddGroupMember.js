// @flow
import { Field, SubmissionError } from 'redux-form';
import type { FormProps } from 'redux-form';
import { legoForm, Button, Form } from 'app/components/Form';
import SelectInput from 'app/components/Form/SelectInput';
import { createValidator, required } from 'app/utils/validation';
import { ROLES } from 'app/utils/constants';

type Props = FormProps & {
  groupId: Number,
  addMember: ({
    role: $Keys<typeof ROLES>,
    userId: Number,
    groupId: Number,
  }) => Promise<*>,
};

const roles = Object.keys(ROLES)
  .sort()
  .map((role) => ({
    value: role,
    label: ROLES[role],
  }));

const AddGroupMember = ({ submitting, groupId, handleSubmit }: Props) => {
  return (
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
        simpleValue
        label="Rolle"
        name="role"
        placeholder="Velg rolle"
        options={roles}
        component={SelectInput.Field}
      />

      <Button submit disabled={submitting}>
        Legg til bruker
      </Button>
    </Form>
  );
};

const validate = createValidator({
  user: [required()],
  role: [required()],
});

export default legoForm({
  form: 'add-user',
  validate,
  initialValues: { role: 'member' },
  onSubmitSuccess: (result, dispatch, { reset }: Props) => reset(),
  onSubmit: (
    {
      user,
      role,
    }: { user: { id: Number }, role: { value: $Keys<typeof ROLES> } },
    dispatch,
    props: Props
  ) =>
    props
      .addMember({
        role: role.value,
        userId: user.id,
        groupId: props.groupId,
      })
      .catch((err) => {
        if (err.payload.response.status === 409) {
          throw new SubmissionError({
            user: 'Denne brukeren er allerede med i gruppen.',
          });
        }

        throw err;
      }),
})(AddGroupMember);
