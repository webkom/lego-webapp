// @flow

import { reduxForm, Field } from 'redux-form';
import { Form, Button, TextInput } from 'app/components/Form';
import styles from './UpdateAllergies.css';
import formStyles from 'app/components/Form/Field.css';

export type Props = {
  handleSubmit: (Function) => void,
  username: string,
  updateUser: (
    { username: string, allergies: string },
    { noRedirect: boolean }
  ) => Promise<*>,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
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
        { noRedirect: true }
      )
    )}
    style={{ marginBottom: '20px' }}
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

export default reduxForm({ form: 'UpdateAllergies' })(UpdateAllergies);
