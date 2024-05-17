import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addCompanyContact,
  editCompanyContact,
  fetchAdmin,
} from 'app/actions/CompanyActions';
import { LegoFinalForm, TextInput } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectCompanyById } from 'app/reducers/companies';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required, isEmail } from 'app/utils/validation';
import SubmissionError from '../../../components/Form/SubmissionError';
import type { AdminDetailCompany } from 'app/store/models/Company';

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

  const navigate = useNavigate();

  if (!company) {
    return (
      <Page>
        <LoadingIndicator loading />
      </Page>
    );
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
    ? `Opprett bedriftskontakt for ${company.name}`
    : `Rediger bedriftskontakt for ${company.name}`;

  return (
    <Page title={title} back={{ href: `/bdb/${company.id}` }}>
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
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
          </form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(CompanyContactEditor);
