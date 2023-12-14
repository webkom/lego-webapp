import { LoadingIndicator } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import { LegoFinalForm, TextInput } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { DetailNavigation } from '../utils';
import styles from './bdb.css';
import type {
  CompanyEntity,
  CompanyContactEntity,
} from 'app/reducers/companies';

type FormValues = {
  name: string;
  role: string;
  mail: string;
  phone: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

type Props = {
  submitFunction: (
    arg0: CompanyContactEntity,
    arg1: Record<string, any> | null | undefined
  ) => Promise<any>;
  handleSubmit: (arg0: (arg0: CompanyContactEntity) => Promise<any>) => void;
  company: CompanyEntity;
  companyContact?: CompanyContactEntity;
  submitting: boolean;
  autoFocus: any;
  fetching: boolean;
  deleteCompany: (arg0: number) => Promise<any>;
};

const validate = createValidator({
  name: [required()],
  mail: [isEmail()],
});

const CompanyContactEditor = (props: Props) => {
  const onSubmit = (formContent) => {
    const { company, companyContact, submitFunction } = props;
    return submitFunction(
      {
        ...formContent,
        companyId: company.id,
        companyContactId: companyContact && companyContact.id,
      },
      {
        detail: true,
      }
    );
  };

  const { company, fetching } = props;

  if (fetching) {
    return <LoadingIndicator loading />;
  }

  return (
    <Content>
      <DetailNavigation title="Bedriftskontakt" companyId={company.id} />
      <h3>
        <Link to={`/bdb/${company.id}`}>{company.name}</Link> sin
        bedriftskontakt.
      </h3>

      <div className={styles.detail}>
        <TypedLegoForm
          onSubmit={onSubmit}
          initialValues={props.initialValues}
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

              <SubmitButton>Lagre</SubmitButton>
            </form>
          )}
        </TypedLegoForm>
      </div>
    </Content>
  );
};

export default CompanyContactEditor;
