import styles from './bdb.css';
import React, { Component } from 'react';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';

type Props = {
  addCompanyContact: () => void,
  handleSubmit: () => void,
  companyId: string,
  submitting: boolean,
  autoFocus: any
};

export default class AddCompanyContact extends Component {

  onSubmit({ name, role, mail, phone }) {
    const companyId = this.props.companyId;
    this.props.addCompanyContact({
      companyId,
      name,
      role,
      mail,
      phone
    }, true);
  }

  props: Props;

  render() {
    const {
      companyId,
      submitting,
      autoFocus
    } = this.props;

    return (
      <div className={styles.root}>

        <h1>Legg til bedriftskontakt</h1>

        <div className={styles.detail}>
          <div className={styles.leftSection}>

            <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

              <Field
                placeholder={'Navn'}
                autoFocus={autoFocus}
                name='name'
                component={TextInput.Field}
              />

              <Field
                placeholder={'Rolle'}
                autoFocus={autoFocus}
                name='role'
                component={TextInput.Field}
              />

              <Field
                placeholder={'E-mail'}
                autoFocus={autoFocus}
                name='mail'
                component={TextInput.Field}
              />

              <Field
                placeholder={'Telefonnummer'}
                autoFocus={autoFocus}
                name='phone'
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

          <BdbRightNav
            {...this.props}
            companyId={companyId}
          />

        </div>
      </div>
    );
  }
}
