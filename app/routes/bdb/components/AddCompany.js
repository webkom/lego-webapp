import styles from './bdb.css';
import React, { Component } from 'react';
import { trueIcon, falseIcon } from '../utils.js';
import InfoBubble from 'app/components/InfoBubble';
import CompanyRightNav from './CompanyRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextEditor } from 'app/components/Form';
import { TextInput } from 'app/components/Form';

type Props = {
  addCompany: () => void,
  fields: any,
  submitting: boolean,
  handleSubmit: () => void,
  autoFocus: any
};

export default class AddCompany extends Component {

  onSubmit({ name, studentContact, adminComment, active, jobOfferOnly, bedex,
    description, phone, website }) {
    this.props.addCompany({
      name,
      studentContact,
      adminComment: adminComment || '',
      active: active || false,
      jobOfferOnly: jobOfferOnly || false,
      bedex: bedex || false,
      description: description || false,
      phone: phone || '',
      website: website || ''
    });
  }

  props: Props;

  render() {
    const {
      submitting,
      autoFocus
    } = this.props;

    return (
      <div className={styles.root}>

        <Field
          placeholder={'Bedriftens navn'}
          autoFocus={autoFocus}
          name='name'
          component={TextInput.Field}
          className={styles.editTitle}
        />

        <div className={styles.detail}>
          <div className={styles.leftSection}>

            <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

              <div className={styles.description}>
                <Field
                  placeholder={'Beskrivelse av bedriften'}
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
                      placeholder={'Telefonnummer'}
                      autoFocus={autoFocus}
                      name='phone'
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Telefon'}
                  style={{ order: 0 }}
                />
                <InfoBubble
                  icon={'user'}
                  data={
                    <Field
                      placeholder={'Studentkontakt'}
                      autoFocus={autoFocus}
                      name='studentContact'
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Studentkontakt'}
                  style={{ order: 1 }}
                />
                <InfoBubble
                  icon={'paper-plane'}
                  data={
                    <Field
                      placeholder={'Nettside'}
                      autoFocus={autoFocus}
                      name='website'
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Nettside'}
                  style={{ order: 2 }}
                />
              </div>

              <div className={styles.info}>
                <div style={{ order: 0 }}>
                  <h3>Aktiv bedrift?</h3>
                  <div className={styles.editInfo}>
                    <input type='radio' name='active' value />
                      {trueIcon}<br />
                  </div>
                  <div className={styles.editInfo}>
                    <input type='radio' name='active' value={false} />
                      {falseIcon}<br />
                  </div>
                </div>

                <div style={{ order: 1 }}>
                  <h3>Kun for jobbtilbud?</h3>
                  <div className={styles.editInfo}>
                    <input type='radio' name='jobOfferOnly' value />
                      {trueIcon}<br />
                  </div>
                  <div className={styles.editInfo}>
                    <input type='radio' name='jobOfferOnly' value={false} />
                      {falseIcon}<br />
                  </div>
                </div>

                <div style={{ order: 2 }}>
                  <h3>Bedex i år?</h3>
                  <div className={styles.editInfo}>
                    <input type='radio' name='bedex' value />
                      {trueIcon}<br />
                  </div>
                  <div className={styles.editInfo}>
                    <input type='radio' name='bedex' value={false} />
                      {falseIcon}<br />
                  </div>
                </div>
              </div>

              <div className={styles.adminNote}>
                <h3>Notat fra Bedkom</h3>
                <Field
                  placeholder={'Kort notat som vises på hovedsiden til bdb'}
                  autoFocus={autoFocus}
                  name='adminComment'
                  component={TextEditor.Field}
                />
              </div>

              <div className={styles.clear}></div>
              <Button
                className={styles.submit}
                disabled={submitting}
                submit
              >
                Lagre
              </Button>

            </form>
          </div>

          <CompanyRightNav
            {...this.props}
          />

        </div>
      </div>
    );
  }
}
