import { get } from 'lodash';
import { useEffect } from 'react';
import { Field } from 'react-final-form';
import { useParams } from 'react-router-dom-v5-compat';
import { push } from 'redux-first-history';
import {
  createEmailUser,
  editEmailUser,
  fetchEmailUser,
} from 'app/actions/EmailUserActions';
import {
  TextInput,
  Form,
  SelectInput,
  CheckBox,
  LegoFinalForm,
} from 'app/components/Form';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectEmailUserById } from 'app/reducers/emailUsers';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';

type AutocompleteUserValue = {
  title: string;
};

const validate = createValidator({
  user: [required()],
  internalEmail: [required()],
});

const EmailUserEditor = () => {
  const { emailUserId } = useParams();
  const emailUser = useAppSelector((state) =>
    selectEmailUserById(state, { emailUserId })
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (emailUserId) {
      dispatch(fetchEmailUser(emailUserId));
    }
  }, [dispatch, emailUserId]);

  const initialValues = {
    ...emailUser,
    user: {
      label: get(emailUser, 'user.fullName', ''),
      value: get(emailUser, 'user.id', ''),
    },
    internalEmailEnable: get(emailUser, 'internalEmailEnabled', false),
  };

  const onUserChange = (data: AutocompleteUserValue, form) => {
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
    form.change('internalEmail', email);
  };

  const handleSubmitX = async (values) => {
    const payload = {
      ...values,
      user: values.user.value,
      internalEmailEnabled: !!values.internalEmailEnabled,
    };
    if (emailUserId) {
      dispatch(editEmailUser(payload));
    } else {
      const response = await dispatch(createEmailUser(payload));
      dispatch(push(`/admin/email/users/${response.payload.result}`));
    }
  };

  return (
    <LegoFinalForm
      onSubmit={handleSubmitX}
      validate={validate}
      initialValues={initialValues}
    >
      {({ handleSubmit, form }) => (
        <Form onSubmit={(values) => handleSubmit(values)}>
          <Field
            label="Bruker"
            name="user"
            required
            disabled={emailUserId}
            placeholder="Velg bruker"
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
            onChange={(data: AutocompleteUserValue) => onUserChange(data, form)}
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
            type="checkbox"
            parse={(value) => !!value}
          />

          <SubmissionError />
          <SubmitButton>
            {emailUserId ? 'Oppdater e-postbruker' : 'Lag e-postbruker'}
          </SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default EmailUserEditor;
