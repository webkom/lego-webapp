import { reduxForm, Field } from 'redux-form';
import { Form, Button, TextInput } from 'app/components/Form';
import formStyles from 'app/components/Form/Field.css';
import styles from './UpdateAllergies.css';

export type Props = {
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
  username: string;
  updateUser: (
    arg0: {
      username: string;
      allergies: string;
    },
    arg1: {
      noRedirect: boolean;
    }
  ) => Promise<any>;
  invalid: boolean;
  pristine: boolean;
  submitting: boolean;
};

const UpdateAllergies = ({
  handleSubmit,
  username,
  updateUser,
  invalid,
  pristine,
  submitting,
}: Props) => (
  <Form
    onSubmit={handleSubmit(({ allergies }) =>
      updateUser(
        {
          username,
          allergies,
        },
        {
          noRedirect: true,
        }
      )
    )}
    style={{
      marginBottom: '20px',
    }}
  >
    <label className={formStyles.label} htmlFor="allergies">
      Matallergier/preferanser
    </label>
    <div className={styles.update}>
      <Field
        id="allergies"
        name="allergies"
        placeholder="Ingen"
        fieldClassName={styles.allergies}
        component={TextInput.Field}
      />
      <Button
        className={styles.button}
        submit
        disabled={invalid || pristine || submitting}
      >
        Oppdater
      </Button>
    </div>
  </Form>
);

export default reduxForm({
  form: 'UpdateAllergies',
})(UpdateAllergies);
