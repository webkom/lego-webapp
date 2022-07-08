// @flow

import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';

import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import { TextInput } from 'app/components/Form';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type {
  CompanyContactEntity,
  CompanyEntity,
} from 'app/reducers/companies';
import { createValidator, isEmail, required } from 'app/utils/validation';
import { DetailNavigation } from '../utils';

import styles from './bdb.css';

type Props = {
  submitFunction: (CompanyContactEntity, ?Object) => Promise<*>,
  handleSubmit: ((CompanyContactEntity) => Promise<*>) => void,
  company: CompanyEntity,
  companyContact?: CompanyContactEntity,
  submitting: boolean,
  autoFocus: any,
  fetching: boolean,
  deleteCompany: (number) => Promise<*>,
};

class CompanyContactEditor extends Component<Props> {
  onSubmit = (formContent) => {
    const { company, companyContact, submitFunction } = this.props;
    return submitFunction(
      {
        ...formContent,
        companyId: company.id,
        companyContactId: companyContact && companyContact.id,
      },
      { detail: true }
    );
  };

  render() {
    const {
      company,
      fetching,
      submitting,
      autoFocus,
      handleSubmit,
      deleteCompany,
    } = this.props;

    if (fetching) {
      return <LoadingIndicator />;
    }

    return (
      <Content>
        <DetailNavigation
          title="Bedriftskontakt"
          companyId={company.id}
          deleteFunction={deleteCompany}
        />
        <h3>
          <Link to={`/bdb/${company.id}`}>{company.name}</Link> sin
          bedriftskontakt.
        </h3>

        <div className={styles.detail}>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              placeholder="Arne Arnsten"
              label="Navn"
              autoFocus={autoFocus}
              name="name"
              component={TextInput.Field}
            />

            <Field
              placeholder="Konsulent"
              label="Rolle"
              autoFocus={autoFocus}
              name="role"
              component={TextInput.Field}
            />

            <Field
              placeholder="arne@bedrift.no"
              label="E-mail"
              autoFocus={autoFocus}
              name="mail"
              component={TextInput.Field}
            />

            <Field
              label="Telefonnummer"
              placeholder="12312312"
              autoFocus={autoFocus}
              name="phone"
              component={TextInput.Field}
            />

            <div className={styles.clear} />
            <Button
              className={styles.submit}
              disabled={submitting}
              submit
              style={{ marginBottom: '0!important' }}
              success
            >
              Lagre
            </Button>
          </form>
        </div>
      </Content>
    );
  }
}

const validate = createValidator({
  name: [required()],
  mail: [isEmail()],
});

export default reduxForm({
  form: 'companyContactEditor',
  validate,
  enableReinitialize: true,
})(CompanyContactEditor);
