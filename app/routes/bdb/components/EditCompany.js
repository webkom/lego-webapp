import styles from './bdb.css';
import React, { Component } from 'react';
import { trueIcon, falseIcon, httpCheck } from '../utils.js';
import LoadingIndicator from 'app/components/LoadingIndicator';
import InfoBubble from 'app/components/InfoBubble';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextEditor, TextInput, RadioButton } from 'app/components/Form';

type Props = {
  editCompany: () => void,
  company: Object,
  submitting: boolean,
  handleSubmit: () => void,
  autoFocus: any
};

export default class EditCompany extends Component {
  onSubmit = ({
    name,
    description = '',
    adminComment = '',
    website = '',
    studentContact = '',
    active = '',
    phone = '',
    companyType = '',
    paymentMail = '',
    address = ''
  }) => {
    console.log('stud', studentContact);
    const { editCompany, company } = this.props;
    editCompany({
      companyId: company.id,
      name,
      description,
      adminComment,
      website: httpCheck(website),
      studentContact,
      active,
      phone,
      companyType,
      paymentMail,
      address
    });
  };

  props: Props;

  render() {
    const { company, submitting, autoFocus, handleSubmit } = this.props;

    if (!company) {
      return <LoadingIndicator />;
    }

    return (
      <div className={styles.root}>

        <Field
          placeholder={'Bedriftens navn'}
          autoFocus={autoFocus}
          name="name"
          component={TextInput.Field}
          className={styles.editTitle}
        />

        <div className={styles.detail}>
          <div className={styles.leftSection}>

            <form onSubmit={handleSubmit(this.onSubmit)}>

              <div className={styles.description}>
                <Field
                  placeholder={'Beskrivelse av bedriften'}
                  autoFocus={autoFocus}
                  name="description"
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
                      name="phone"
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
                      name="studentContact"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Studentkontakt'}
                  style={{ order: 1 }}
                />

                <InfoBubble
                  icon={'briefcase'}
                  data={
                    <Field
                      placeholder={'Type bedrift'}
                      autoFocus={autoFocus}
                      name="companyType"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Type bedrift'}
                  style={{ order: 2 }}
                />
              </div>

              <div className={styles.infoBubbles}>
                <InfoBubble
                  icon={'home'}
                  data={
                    <Field
                      placeholder={'Nettside'}
                      autoFocus={autoFocus}
                      name="website"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Nettside'}
                  style={{ order: 0 }}
                />

                <InfoBubble
                  icon={'building'}
                  data={
                    <Field
                      placeholder={'Adresse'}
                      autoFocus={autoFocus}
                      name="address"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Adresse'}
                  style={{ order: 1 }}
                />

                <InfoBubble
                  icon={'envelope'}
                  data={
                    <Field
                      placeholder={'Fakturamail'}
                      autoFocus={autoFocus}
                      name="paymentMail"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Fakturamail'}
                  style={{ order: 2 }}
                />
              </div>

              <div className={styles.info}>
                <div style={{ order: 0 }}>
                  <h3>Aktiv bedrift?</h3>
                  <div className={styles.editInfo}>
                    <label>
                      <Field
                        name="active"
                        component={RadioButton.Field}
                        fieldStyle={{ width: '24px', marginBottom: 0 }}
                        inputValue="true"
                      />
                      {trueIcon}
                    </label>
                  </div>
                  <div className={styles.editInfo}>
                    <label>
                      <Field
                        name="active"
                        component={RadioButton.Field}
                        fieldStyle={{ width: '24px', marginBottom: 0 }}
                        inputValue="false"
                      />
                      {falseIcon}
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.adminNote}>
                <h3>Notat fra Bedkom</h3>
                <Field
                  placeholder={company.adminComment}
                  autoFocus={autoFocus}
                  name="adminComment"
                  component={TextEditor.Field}
                />
              </div>

              <div className={styles.clear} />
              <Button className={styles.submit} disabled={submitting} submit>
                Lagre
              </Button>

            </form>
          </div>

          <BdbRightNav {...this.props} />

        </div>
      </div>
    );
  }
}
