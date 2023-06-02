import { reduxForm, Form, Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, SelectInput, CheckBox } from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';

export type Props = {
  emailUserId?: number;
  submitting: boolean;
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
  push: (arg0: string) => void;
  mutateFunction: (arg0: Record<string, any>) => Promise<any>;
  change: (arg0: string, arg1: Record<string, any>) => void;
};
type AutocompleteUserValue = {
  title: string;
};

const EmailUserEditor = ({
  emailUserId,
  mutateFunction,
  submitting,
  push,
  handleSubmit,
  change,
}: Props) => {
  const onUserChange = (data: AutocompleteUserValue) => {
    const nameSplit = data.title.toLowerCase().split(' ');
    if (nameSplit.length < 2) return;
    let email = nameSplit[0] + '.' + nameSplit[nameSplit.length - 1];
    // Replace predefined characters
    const illegalChars = {
      å: 'aa',
      æ: 'ae',
      ø: 'oe',
    };
    Object.keys(illegalChars).forEach(
      (char) =>
        (email = email.replace(new RegExp(char, 'g'), illegalChars[char]))
    );
    // Remove any other non-a-z characters
    email = email.replace(/[^a-z0-9.-]/gi, '');
    change('internalEmail', email);
  };

  const onSubmit = (data) => {
    mutateFunction({
      ...data,
      user: data.user.value,
      internalEmailEnabled: !!data.internalEmailEnabled,
    }).then(({ payload }) => {
      if (!emailUserId) {
        push(`/admin/email/users/${payload.result}`);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field
        label="Bruker"
        name="user"
        required
        disabled={emailUserId}
        placeholder="Velg bruker"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
        onChange={(data) => onUserChange(data as any as AutocompleteUserValue)}
      />
      <Field
        required
        disabled={emailUserId}
        placeholder="abakus"
        suffix="@abakus.no"
        name="internalEmail"
        label="G Suite e-post"
        component={TextInput.Field}
      />
      <Field
        label="Aktiv e-post"
        name="internalEmailEnabled"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
      <Button submit disabled={submitting}>
        {emailUserId ? 'Oppdater e-postbruker' : 'Lag e-postbruker'}
      </Button>
    </Form>
  );
};

export default reduxForm({
  form: 'emailUser',
  enableReinitialize: true,
  validate: createValidator({
    email: [required()],
    name: [required()],
  }),
})(EmailUserEditor);
