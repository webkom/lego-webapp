import styles from './bdb.css';
import React, { Component } from 'react';
import { trueIcon, falseIcon } from '../utils.js';
import LoadingIndicator from 'app/components/LoadingIndicator';
import InfoBubble from 'app/components/InfoBubble';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextEditor, TextInput } from 'app/components/Form';

type Props = {
  editCompany: () => void,
  fields: any,
  company: Object,
  companyId: string,
  submitting: boolean,
  handleSubmit: () => void,
  autoFocus: any
};

export default class EditCompany extends Component {

  props: Props;

  onSubmit({ name, adminComment, description, phone, website, companyType, paymentMail }) {
    const { active } = this.state;
    this.props.editCompany({
      companyId: this.props.companyId,
      name,
      description,
      adminComment,
      website,
      active,
      phone,
      companyType,
      paymentMail
    });
  }

  constructor(props) {
    super();
    this.state = {
      active: props.company && props.company.active
    };
  }
  componentWillReceiveProps(newProps) {
    this.setState({ active: newProps.company.active });
  }

  toggleActive = (active) => {
    this.setState({ active });
  };

  render() {
    const {
      company,
      submitting,
      autoFocus
    } = this.props;

    if (!company) {
      return (
        <LoadingIndicator />
      );
    }
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

              <div className={styles.info}>
                <div style={{ order: 0 }}>
                  <h3>Aktiv bedrift?</h3>
                  <div className={styles.editInfo}>
                    <input
                      type='radio'
                      value
                      name='active'
                      checked={this.state.active}
                      onChange={this.toggleActive.bind(this, true)}
                      id='active'
                    /><label htmlFor='active'>{trueIcon}<br /></label>
                  </div>
                  <div className={styles.editInfo}>
                    <input
                      type='radio'
                      value={false}
                      name='active'
                      checked={!this.state.active}
                      onChange={this.toggleActive.bind(this, false)}
                      id='inactive'
                    /><label htmlFor='inactive'>{falseIcon}<br /></label>
                  </div>
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
