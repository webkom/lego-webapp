import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createEmailList,
  editEmailList,
  fetchEmailList,
} from 'app/actions/EmailListActions';
import {
  TextInput,
  Form,
  SelectInput,
  CheckBox,
  LegoFinalForm,
} from 'app/components/Form';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectEmailListById } from 'app/reducers/emailLists';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { ROLES, type RoleType, roleOptions } from 'app/utils/constants';
import { createValidator, required, EMAIL_REGEX } from 'app/utils/validation';

const validate = createValidator({
  email: [
    required(
      'Skriv inn en gyldig e-postadresse. Legg merke til at @abakus.no ikke skal med.'
    ),
  ],
  name: [required()],
  additionalEmails: [
    // Check if all emails entered are valid
    (value) => [
      !value || value.every((email) => EMAIL_REGEX.test(email.value)),
      'Ugyldig e-post',
    ],
  ],
});

const EmailListEditor = () => {
  const { emailListId } = useParams<{ emailListId: string }>();
  const isNew = emailListId === 'new';
  const emailList = useAppSelector((state) =>
    selectEmailListById(state, emailListId!)
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEmailList',
    () => !isNew && emailListId && dispatch(fetchEmailList(emailListId)),
    [emailListId]
  );

  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const payload = {
      id: values.id,
      email: values.email,
      name: values.name,
      requireInternalAddress: values.requireInternalAddress,
      groupRoles: (values.groupRoles || []).map((groupRole) => groupRole.value),
      groups: (values.groups || []).map((group) => group.value),
      users: (values.users || []).map((user) => user.value),
      additionalEmails: (values.additionalEmails || []).map(
        (email) => email.value
      ),
    };

    dispatch(isNew ? createEmailList(payload) : editEmailList(payload)).then(
      (res) => {
        navigate(`/admin/email/lists/${res.payload.result}`);
      }
    );
  };

  const initialValues = isNew
    ? {}
    : {
        ...emailList,
        groups: (emailList?.groups || []).filter(Boolean).map((groups) => ({
          label: groups.name,
          value: groups.id,
        })),
        groupRoles: (emailList?.groupRoles || []).map(
          (groupRoles: RoleType) => ({
            label: ROLES[groupRoles],
            value: groupRoles,
          })
        ),
        users: (emailList?.users || []).filter(Boolean).map((user) => ({
          label: user.fullName,
          value: user.id,
        })),
        additionalEmails: (emailList?.additionalEmails || []).map(
          (additionalEmail) => ({
            label: additionalEmail,
            value: additionalEmail,
          })
        ),
        requireInternalAddress: emailList?.requireInternalAddress || false,
      };

  return (
    <LegoFinalForm
      onSubmit={handleSubmit}
      validate={validate}
      initialValues={initialValues}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            required
            placeholder="Abakus"
            name="name"
            label="Navnet på e-postliste"
            component={TextInput.Field}
          />
          <Field
            required
            disabled={!isNew && emailListId}
            placeholder="abakus"
            suffix="@abakus.no"
            name="email"
            label="E-post"
            component={TextInput.Field}
          />
          <Field
            label="Brukere"
            name="users"
            isMulti
            placeholder="Inviter en ny bruker"
            filter={['users.user']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            label="Grupper"
            name="groups"
            isMulti
            placeholder="Inviter en ny bruker"
            filter={['users.abakusgroup']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            label="Roller (hvis du lar denne stå tom betyr det at alle medlemmene i gruppene får e-post!)"
            name="groupRoles"
            isMulti
            placeholder="Velg rolle"
            options={roleOptions}
            component={SelectInput.Field}
          />

          <Field
            label="Kun for for brukere med internmail (@abakus.no)"
            description="Når denne er aktivert vil kun brukere med aktiv @abakus.no-adresse få e-post fra denne listen"
            name="requireInternalAddress"
            type="checkbox"
            component={CheckBox.Field}
            normalize={(v) => !!v}
          />

          <Field
            label="E-poster for medlemmer utenfor abakus"
            description="Her kan du legge til e-postene til de som skal ha mailer fra gruppemailen, men ikke er medlem av abakus"
            name="additionalEmails"
            placeholder="Skriv inn e-post her"
            component={SelectInput.Field}
            isMulti
            tags
          />

          <SubmissionError />
          <SubmitButton>
            {isNew ? 'Opprett e-postliste' : 'Oppdater e-postliste'}
          </SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default EmailListEditor;
