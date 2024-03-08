import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addCompanyContact,
  editCompanyContact,
  fetchAdmin,
} from 'app/actions/CompanyActions';
import { Content } from 'app/components/Content';
import { LegoFinalForm, TextInput } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import {
  selectCompanyById,
  selectCompanyContactById,
} from 'app/reducers/companies';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { DetailNavigation } from '../utils';
import styles from './bdb.css';

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
    selectCompanyById(state, { companyId }),
  );
  const companyContact = useAppSelector((state) =>
    selectCompanyContactById(state, {
      companyId,
      companyContactId: Number(companyContactId),
    }),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEditCompanyContact',
    () => companyId && dispatch(fetchAdmin(companyId)),
    [companyId, companyContactId],
  );

  const navigate = useNavigate();

  const onSubmit = (formContent: FormValues) => {
    const body = {
      ...formContent,
      companyId: company.id,
      companyContactId: companyContact && companyContact.id,
    };

    dispatch(isNew ? addCompanyContact(body) : editCompanyContact(body)).then(
      () => {
        navigate(`/bdb/${companyId}`);
      },
    );
  };

  const initialValues = isNew
    ? {}
    : companyContact && {
        name: companyContact.name,
        role: companyContact.role,
        mail: companyContact.mail,
        phone: companyContact.phone,
      };

  return (
    <Content>
      <DetailNavigation title="Bedriftskontakt" companyId={company.id} />
      <h3>
        <Link to={`/bdb/${company.id}`}>{company.name}</Link> sin
        bedriftskontakt
      </h3>

      <div className={styles.detail}>
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

              <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
            </form>
          )}
        </TypedLegoForm>
      </div>
    </Content>
  );
};

export default guardLogin(CompanyContactEditor);
