import { Field } from 'redux-form';
import { legoForm, Button, Form } from 'app/components/Form';
import TextInput from 'app/components/Form/TextInput';
import { createValidator, matchesRegex, required } from 'app/utils/validation';
import type { FormProps } from 'redux-form';

type Props = FormProps & {
  group: Record<string, any>;
};

const AddGroupPermission = ({ submitting, handleSubmit }: Props) => (
  <Form onSubmit={handleSubmit}>
    <h3>Legg til ny rettighet</h3>
    <Field
      label="Rettighet"
      name="permission"
      placeholder="/sudo/admin/events/create/"
      component={TextInput.Field}
    />

    <Button submit disabled={submitting}>
      Legg til rettighet
    </Button>
  </Form>
);

const validate = createValidator({
  permission: [
    required(),
    matchesRegex(
      /^\/([a-zA-Z]+\/)+$/,
      'Rettigheter kan bare inneholde skråstrek og bokstaver, og må begynne og ende med en skråstrek.',
    ),
  ],
});
export default legoForm({
  form: 'add-permission',
  onSubmit: ({ permission }, dispatch, { group, editGroup }) =>
    editGroup({ ...group, permissions: group.permissions.concat(permission) }),
  onSubmitSuccess: (result, dispatch, { reset }) => reset(),
  validate,
})(AddGroupPermission);
