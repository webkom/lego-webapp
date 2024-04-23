import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
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
import { selectUserById } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import { createValidator, required } from 'app/utils/validation';
import type { PublicUser } from 'app/store/models/User';

type AutocompleteUserValue = {
  title: string;
};

const validate = createValidator({
  user: [required()],
  internalEmail: [required()],
});

const EmailUserEditor = () => {
  const { emailUserId } = useParams<{ emailUserId: string }>();
  const isNew = emailUserId === undefined;
  const fetching = useAppSelector((state) => state.emailUsers.fetching);
  const emailUser = useAppSelector((state) =>
    selectEmailUserById(state, emailUserId),
  );
  const user = useAppSelector((state) =>
    selectUserById<PublicUser>(state, emailUser?.user),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEmailUser',
    () => !isNew && emailUserId && dispatch(fetchEmailUser(emailUserId)),
    [emailUserId],
  );

  const initialValues = isNew
    ? {}
    : {
        ...emailUser,
        user: {
          label: user?.fullName || '',
          value: user?.id || '',
        },
        internalEmailEnable: emailUser?.internalEmailEnabled ?? false,
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
        (email = email.replace(new RegExp(char, 'g'), illegalChars[char])),
    );
    // Remove any other non-a-z characters
    email = email.replace(/[^a-z0-9.-]/gi, '');
    form.change('internalEmail', email);
  };

  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      user: values.user.value,
      internalEmailEnabled: !!values.internalEmailEnabled,
    };

    dispatch(isNew ? createEmailUser(payload) : editEmailUser(payload)).then(
      (res) => {
        navigate(`/admin/email/users/${res.payload.result}`);
      },
    );
  };

  if (fetching) return <LoadingIndicator loading={true} />;

  return (
    <LegoFinalForm
      onSubmit={handleSubmit}
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
            filter={[AutocompleteContentType.User]}
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
            {isNew ? 'Lag e-postbruker' : 'Oppdater e-postbruker'}
          </SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default EmailUserEditor;
