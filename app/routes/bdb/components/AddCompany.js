import styles from './bdb.css';
import React, { Component } from 'react';
import InfoBubble from 'app/components/InfoBubble';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextEditor, TextInput } from 'app/components/Form';

type Props = {
  addCompany: () => void,
  fields: any,
  submitting: boolean,
  handleSubmit: () => void,
  autoFocus: any
};

export default class AddCompany extends Component {

  onSubmit({ name, studentContact, adminComment, active, description,
    phone, website, companyType, paymentMail }) {
    this.props.addCompany({
      name,
      studentContact,
      adminComment: adminComment || '',
      active: active || false,
      description: description || false,
      phone: phone || '',
      website: website || '',
      companyType: companyType || '',
      paymentMail: paymentMail || ''
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
                  icon={'briefcase'}
                  data={
                    <Field
                      placeholder={'Type bedrift'}
                      autoFocus={autoFocus}
                      name='companyType'
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
                      name='website'
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
                      name='adress'
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
                      name='companyMail'
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Fakturamail'}
                  style={{ order: 2 }}
                />
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

              <div className={styles.clear} />
              <Button
                className={styles.submit}
                disabled={submitting}
                submit
              >
                Lagre
              </Button>

            </form>
          </div>

          <BdbRightNav
            {...this.props}
          />

        </div>
      </div>
    );
  }
}
