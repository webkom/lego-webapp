import styles from './bdb.css';
import React, { Component } from 'react';
import { trueIcon, falseIcon } from '../utils.js';
import LoadingIndicator from 'app/components/LoadingIndicator';
import InfoBubble from 'app/components/InfoBubble';
import CompanyRightNav from './CompanyRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextEditor } from 'app/components/Form';

type Props = {
  editCompany: () => void,
  fields: any,
  company: Object,
  companyId: string,
  submitting: boolean,
  handleSubmit: () => void
};

export default class editCompany extends Component {

  props: Props;

  onSubmit({ name = this.props.company.name, studentContact = this.props.company.studentContact,
    adminComment, jobOfferOnly, phone }) {
    this.props.editCompany({
      companyId: this.props.companyId,
      name,
      studentContact,
      adminComment,
      jobOfferOnly: jobOfferOnly || false,
      phone
    });
  }

  render() {
    const {
      company,
      submitting,
      pristine,
      autoFocus
    } = this.props;

    if (!company) {
      return (
        <LoadingIndicator />
      );
    }
    return (
      <div className={styles.root}>
        <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

          <Field
            placeholder={company.name}
            autoFocus={autoFocus}
            name='name'
            component={TextEditor.Field}
          />

          <div className={styles.detail}>
            <div className={styles.leftSection}>

              <div className={styles.description}>
                <Field
                  placeholder={company.description}
                  autoFocus={autoFocus}
                  name='description'
                  component={TextEditor.Field}
                />
              </div>

              <div className={styles.infoBubbles}>
                <InfoBubble
                  icon={'phone'}
                  data={
                    <Field
                      placeholder={company.phone}
                      autoFocus={autoFocus}
                      name='phone'
                      component={TextEditor.Field}
                    />
                  }
                  meta={'Telefon'}
                  style={{ order: 0 }}
                />
                <InfoBubble
                  icon={'user'}
                  data={
                    <Field
                      placeholder={company.studentContact}
                      autoFocus={autoFocus}
                      name='studentContact'
                      component={TextEditor.Field}
                    />
                  }
                  meta={'Studentkontakt'}
                  style={{ order: 1 }}
                />
                <InfoBubble
                  icon={'paper-plane'}
                  data={
                    <Field
                      placeholder={company.website}
                      autoFocus={autoFocus}
                      name='website'
                      component={TextEditor.Field}
                    />
                  }
                  meta={'Nettside'}
                  style={{ order: 2 }}
                />
              </div>

              <div className={styles.info}>
                <div style={{ order: 0 }}>
                  <h3>Aktiv bedrift?</h3>
                  <input type='radio' name='active' value />
                    {trueIcon}<br />
                  <input type='radio' name='active' value={false} />
                    {falseIcon}<br />
                </div>

                <div style={{ order: 1 }}>
                  <h3>Kun for jobbtilbud?</h3>
                  <input type='radio' name='jobOfferOnly' value />
                    {trueIcon}<br />
                  <input type='radio' name='jobOfferOnly' value={false} />
                    {falseIcon}<br />
                </div>

                <div style={{ order: 2 }}>
                  <h3>Bedex i år?</h3>
                  <input type='radio' name='bedex' value />
                    {trueIcon}<br />
                  <input type='radio' name='bedex' value={false} />
                    {falseIcon}<br />
                </div>
              </div>

              <div className={styles.adminNote}>
                <h3>Notat fra Bedkom</h3>
                <Field
                  placeholder={company.adminComment}
                  autoFocus={autoFocus}
                  name='adminComment'
                  component={TextEditor.Field}
                />
              </div>

              <div className={styles.clear}></div>
              <Button
                className={styles.submit}
                disabled={pristine || submitting}
                submit
              >
                Lagre
              </Button>

            </div>
          </div>
        </form>

        <CompanyRightNav
          {...this.props}
        />

      </div>
    );
  }
}
