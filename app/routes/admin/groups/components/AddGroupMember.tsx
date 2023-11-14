import { Field, SubmissionError } from 'redux-form';
import { legoForm, Button, Form } from 'app/components/Form';
import SelectInput from 'app/components/Form/SelectInput';
import { ROLES, type RoleType } from 'app/utils/constants';
import { createValidator, required } from 'app/utils/validation';
import type { AddMemberArgs } from 'app/actions/GroupActions';
import type { ID } from 'app/store/models';
import type { FormProps } from 'redux-form';

type Props = FormProps & {
  addMember: (arg0: AddMemberArgs) => Promise<any>;
};
const roles = (Object.keys(ROLES) as (keyof typeof ROLES)[])
  .sort()
  .map((role: RoleType) => ({
    value: role,
    label: ROLES[role],
  }));

const AddGroupMember = ({ submitting, handleSubmit }: Props) => {
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
        label="Rolle"
        name="role"
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
  initialValues: {
    role: roles.find(({ value }) => value === 'member'),
  },
  onSubmitSuccess: (result, dispatch, { reset }: Props) => reset(),
  onSubmit: (
    {
      user,
      role,
    }: {
      user: {
        id: ID;
      };
      role: {
        value: RoleType;
      };
    },
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
