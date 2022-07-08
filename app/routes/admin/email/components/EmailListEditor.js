//@flow

import { Field, Form } from 'redux-form';

import Button from 'app/components/Button';
import {
  CheckBox,
  handleSubmissionError,
  legoForm,
  SelectInput,
  TextInput,
} from 'app/components/Form';
import Tooltip from 'app/components/Tooltip';
import { roleOptions } from 'app/utils/constants';
import { createValidator, EMAIL_REGEX, required } from 'app/utils/validation';

export type Props = {
  emailListId?: number,
  submitting: boolean,
  handleSubmit: (Function) => void,
  push: (string) => void,
  mutateFunction: (Object) => Promise<*>,
};

const EmailListEditor = ({ submitting, handleSubmit, emailListId }: Props) => (
  <Form onSubmit={handleSubmit}>
    <Field
      required
      placeholder="Abakus"
      name="name"
      label="Navnet på Epostliste"
      component={TextInput.Field}
    />
    <Field
      required
      disabled={emailListId}
      placeholder="abakus"
      suffix="@abakus.no"
      name="email"
      label="Epost"
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
      label="Roller (hvis du lar denne stå tom betyr det at alle medlemmene i gruppene får mail!)"
      name="groupRoles"
      isMulti
      placeholder="Velg rolle"
      options={roleOptions}
      component={SelectInput.Field}
    />

    <Tooltip content="Når denne er aktivert vil kun brukere med aktiv @abakus.no-adresse få mail fra denne listen">
      <Field
        label="Kun for for brukere med internmail (@abakus.no)"
        name="requireInternalAddress"
        component={CheckBox.Field}
        normalize={(v) => !!v}
      />
    </Tooltip>

    <Tooltip content="Her kan du legge til e-postene til de som skal ha mailer fra gruppemailen, men ikke er medlem av abakus">
      <Field
        label="E-poster for medlemmer utenfor abakus"
        name="additionalEmails"
        placeholder="Skriv inn e-post her"
        component={SelectInput.Field}
        isMulti
        tags
      />
    </Tooltip>
    <Button submit disabled={submitting}>
      {emailListId ? 'Oppdater epostliste' : 'Lag epostliste'}
    </Button>
  </Form>
);

export default legoForm({
  form: 'emailList',
  enableReinitialize: true,
  onSubmit: (data, dispatch, { mutateFunction, emailListId, push }: Props) =>
    mutateFunction({
      id: data.id,
      email: data.email,
      name: data.name,
      requireInternalAddress: data.requireInternalAddress,
      groupRoles: (data.groupRoles || []).map((groupRole) => groupRole.value),
      groups: (data.groups || []).map((group) => group.value),
      users: (data.users || []).map((user) => user.value),
      additionalEmails: (data.additionalEmails || []).map(
        (email) => email.value
      ),
    }).then(({ payload }) => {
      if (!emailListId) {
        push(`/admin/email/lists/${payload.result}`);
      }
    }, handleSubmissionError),

  validate: createValidator({
    email: [required()],
    name: [required()],
    additionalEmails: [
      //check if all emails entered are valid
      (value) => [
        !value || value.every((email) => EMAIL_REGEX.test(email.value)),
        'Ugyldig e-post',
      ],
    ],
  }),
})(EmailListEditor);
