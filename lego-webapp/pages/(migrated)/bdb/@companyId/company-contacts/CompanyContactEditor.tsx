import { LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import {
  Form,
  LegoFinalForm,
  TextInput,
  SubmitButton,
} from '~/components/Form';
import SubmissionError from '~/components/Form/SubmissionError';
import {
  addCompanyContact,
  editCompanyContact,
  fetchAdmin,
} from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCompanyById } from '~/redux/slices/companies';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import { createValidator, required, isEmail } from '~/utils/validation';
import type { AdminDetailCompany } from '~/redux/models/Company';

export type FormValues = {
  name: string;
  role: string;
  mail: string;
  phone: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  name: [required()],
  mail: [isEmail()],
});

const CompanyContactEditor = () => {
  const { companyId, companyContactId } = useParams<{
    companyId: string;
    companyContactId: string;
  }>();
  const isNew = companyContactId === undefined;
  const fetching = useAppSelector((state) => state.companies.fetching);
  const company = useAppSelector((state) =>
    selectCompanyById<AdminDetailCompany>(state, companyId),
  );
  const companyContact = company?.companyContacts.find(
    (contact) => contact.id === Number(companyContactId),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEditCompanyContact',
    () => companyId && dispatch(fetchAdmin(companyId)),
    [companyId],
  );

  if (!company) {
    return <LoadingPage loading={fetching} />;
  }

  const onSubmit = async (formContent: FormValues) => {
    const body = {
      ...formContent,
      companyId: company.id,
      companyContactId,
    };

    await dispatch(isNew ? addCompanyContact(body) : editCompanyContact(body));
    navigate(`/bdb/${companyId}`);
  };

  const initialValues = isNew
    ? {}
    : companyContact && {
        name: companyContact.name,
        role: companyContact.role,
        mail: companyContact.mail,
        phone: companyContact.phone,
      };

  const title = isNew
    ? `Ny bedriftskontakt for ${company.name}`
    : `Redigerer: Bedriftskontakt for ${company.name}`;

  return (
    <Page
      title={title}
      skeleton={fetching}
      back={{ href: `/bdb/${company.id}` }}
    >
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder="Arne Arnsten"
              label="Navn"
              name="name"
              component={TextInput.Field}
            />

            <Field
              placeholder="Konsulent"
              label="Rolle"
              name="role"
              component={TextInput.Field}
            />

            <Field
              placeholder="arne@bedrift.no"
              label="E-post"
              name="mail"
              component={TextInput.Field}
            />

            <Field
              label="Telefonnummer"
              placeholder="12312312"
              name="phone"
              component={TextInput.Field}
            />

            <SubmissionError />
            <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
          </Form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(CompanyContactEditor);
