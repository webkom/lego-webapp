import styles from './bdb.css';
import React, { Component } from 'react';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  addCompanyContact: () => void,
  handleSubmit: () => void,
  company: Object,
  submitting: boolean,
  autoFocus: any
};

export default class AddCompanyContact extends Component {
  onSubmit = formContent => {
    const { company, addCompanyContact } = this.props;
    addCompanyContact(
      {
        ...formContent,
        companyId: company.id
      },
      true
    );
  };

  props: Props;

  render() {
    const { company, submitting, autoFocus, handleSubmit } = this.props;

    if (!company) {
      return <LoadingIndicator />;
    }

    return (
      <div className={styles.root}>
        <h1>Legg til bedriftskontakt</h1>

        <h3>
          For bedriften <Link to={`/bdb/${company.id}`}>{company.name}</Link>
        </h3>

        <div className={styles.detail}>
          <div className={styles.leftSection}>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                placeholder={'Navn'}
                autoFocus={autoFocus}
                name="name"
                component={TextInput.Field}
              />

              <Field
                placeholder={'Rolle'}
                autoFocus={autoFocus}
                name="role"
                component={TextInput.Field}
              />

              <Field
                placeholder={'E-mail'}
                autoFocus={autoFocus}
                name="mail"
                component={TextInput.Field}
              />

              <Field
                placeholder={'Telefonnummer'}
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
              >
                Lagre
              </Button>
            </form>
          </div>

          <BdbRightNav {...this.props} companyId={company.id} />
        </div>
      </div>
    );
  }
}
