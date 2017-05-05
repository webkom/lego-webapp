import styles from './bdb.css';
import React, { Component } from 'react';
import InfoBubble from 'app/components/InfoBubble';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextEditor, TextInput } from 'app/components/Form';
import { httpCheck } from '../utils';

type Props = {
  addCompany: () => void,
  submitting: boolean,
  handleSubmit: () => void,
  autoFocus: any
};

export default class AddCompany extends Component {
  state = {
    active: true
  };

  onSubmit = ({
    name,
    description = '',
    adminComment = '',
    website = '',
    studentContact = '',
    phone = '',
    companyType = '',
    paymentMail = '',
    address = ''
  }) => {
    const { active } = this.state;
    this.props.addCompany({
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
    const { submitting, autoFocus, handleSubmit } = this.props;

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

              <div className={styles.adminNote}>
                <h3>Notat fra Bedkom</h3>
                <Field
                  placeholder={'Kort notat som vises på hovedsiden til bdb'}
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
