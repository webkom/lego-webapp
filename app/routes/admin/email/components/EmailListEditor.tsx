import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router';
import {
  createEmailList,
  editEmailList,
  fetchEmailList,
} from 'app/actions/EmailListActions';
import { ContentMain } from 'app/components/Content';
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
import { selectGroupsByIds } from 'app/reducers/groups';
import { selectUsersByIds } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import { isNotNullish } from 'app/utils';
import { ROLES, type RoleType, roleOptions } from 'app/utils/constants';
import {
  createValidator,
  required,
  EMAIL_REGEX,
  atLeastOneFieldRequired,
} from 'app/utils/validation';
import type { DetailedEmailList } from 'app/store/models/EmailList';

const recipientRequired = atLeastOneFieldRequired(
  ['users', 'groups', 'additionalEmails'],
  'E-postlisten må ha minst en mottaker',
);

const validate = createValidator({
  email: [
    required(
      'Skriv inn en gyldig e-postadresse. Legg merke til at @abakus.no ikke skal med.',
    ),
  ],
  name: [required()],
  additionalEmails: [
    recipientRequired,
    // Check if all emails entered are valid
    (value) => [
      !value || value.every((email) => EMAIL_REGEX.test(email.value)),
      'Ugyldig e-post',
    ],
  ],
  users: [recipientRequired],
  groups: [recipientRequired],
});

const EmailListEditor = () => {
  const { emailListId } = useParams<{ emailListId: string }>();
  const isNew = emailListId === undefined;
  const emailList = useAppSelector((state) =>
    selectEmailListById<DetailedEmailList>(state, emailListId),
  );
  const users = useAppSelector((state) =>
    selectUsersByIds(state, emailList?.users),
  );
  const groups = useAppSelector((state) =>
    selectGroupsByIds(state, emailList?.groups),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEmailList',
    () => !isNew && emailListId && dispatch(fetchEmailList(emailListId)),
    [emailListId],
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
        (email) => email.value,
      ),
    };

    dispatch(isNew ? createEmailList(payload) : editEmailList(payload)).then(
      (res) => {
        navigate(`/admin/email/lists/${res.payload.result}`);
      },
    );
  };

  const initialValues = isNew
    ? {}
    : {
        ...emailList,
        groups: groups.filter(isNotNullish).map((groups) => ({
          label: groups.name,
          value: groups.id,
        })),
        groupRoles: (emailList?.groupRoles || []).map(
          (groupRoles: RoleType) => ({
            label: ROLES[groupRoles],
            value: groupRoles,
          }),
        ),
        users: users.filter(isNotNullish).map((user) => ({
          label: user.fullName,
          value: user.id,
        })),
        additionalEmails: (emailList?.additionalEmails || []).map(
          (additionalEmail) => ({
            label: additionalEmail,
            value: additionalEmail,
          }),
        ),
        requireInternalAddress: emailList?.requireInternalAddress || false,
      };

  return (
    <ContentMain>
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
              filter={[AutocompleteContentType.User]}
              component={SelectInput.AutocompleteField}
            />
            <Field
              label="Grupper"
              name="groups"
              isMulti
              placeholder="Inviter en ny bruker"
              filter={[AutocompleteContentType.Group]}
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
    </ContentMain>
  );
};

export default EmailListEditor;
