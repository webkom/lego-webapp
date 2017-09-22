import styles from './bdb.css';
import React, { Component } from 'react';
import { httpCheck } from '../utils.js';
import LoadingIndicator from 'app/components/LoadingIndicator';
import InfoBubble from 'app/components/InfoBubble';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import {
  TextEditor,
  TextInput,
  RadioButton,
  SelectInput,
  ImageUploadField
} from 'app/components/Form';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { reduxForm } from 'redux-form';

type Props = {
  uploadFile: () => void,
  company: Object,
  submitting: boolean,
  handleSubmit: () => void,
  autoFocus: any,
  fetching: boolean,
  submitFunction: (Object, ?number) => void
};

class CompanyEditor extends Component {
  onSubmit = formContent => {
    const { company, submitFunction } = this.props;
    return submitFunction(
      {
        ...formContent,
        studentContact:
          formContent.studentContact &&
          Number(formContent.studentContact.value),
        website: httpCheck(formContent.website)
      },
      company && company.id
    );
  };

  props: Props;

  render() {
    const {
      company,
      submitting,
      autoFocus,
      handleSubmit,
      uploadFile,
      fetching
    } = this.props;

    if (fetching) {
      return <LoadingIndicator />;
    }

    return (
      <div className={styles.root}>
        <div className={styles.detail}>
          <div className={styles.leftSection}>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                name="logo"
                component={ImageUploadField.Field}
                uploadFile={uploadFile}
                aspectRatio={20 / 6}
                img={company && company.logo}
              />
              <Field
                placeholder={'Bedriftens navn'}
                label={' '}
                autoFocus={autoFocus}
                name="name"
                component={TextInput.Field}
                className={styles.editTitle}
              />
              <div className={styles.description}>
                <Field
                  placeholder={'Beskrivelse av bedriften'}
                  label={' '}
                  autoFocus={autoFocus}
                  name="description"
                  component={TextEditor.Field}
                />
              </div>

              <div className={styles.infoBubbles}>
                <InfoBubble
                  icon={'briefcase'}
                  data={
                    <Field
                      placeholder={'Type bedrift'}
                      label={' '}
                      autoFocus={autoFocus}
                      name="companyType"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Type bedrift'}
                  style={{ order: 0 }}
                />
                <InfoBubble
                  icon={'mail'}
                  data={
                    <Field
                      placeholder={'Fakturamail'}
                      label={' '}
                      autoFocus={autoFocus}
                      name="paymentMail"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Fakturamail'}
                  style={{ order: 1 }}
                />
                <InfoBubble
                  icon={'call'}
                  data={
                    <Field
                      placeholder={'Telefonnummer'}
                      label={' '}
                      autoFocus={autoFocus}
                      name="phone"
                      component={TextInput.Field}
                      className={styles.editBubble}
                    />
                  }
                  meta={'Telefon'}
                  style={{ order: 2 }}
                />
              </div>

              <div className={styles.infoBubbles}>
                <InfoBubble
                  icon={'at'}
                  data={
                    <Field
                      placeholder={'Nettside'}
                      label={' '}
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
                  icon={'home'}
                  data={
                    <Field
                      placeholder={'Adresse'}
                      label={' '}
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
                  icon={'person'}
                  data={
                    <Field
                      placeholder={'Studentkontakt'}
                      label={' '}
                      autoFocus={autoFocus}
                      name="studentContact"
                      component={SelectInput.AutocompleteField}
                      className={styles.editBubble}
                      filter={['users.user']}
                    />
                  }
                  meta={'Studentkontakt'}
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
                      Ja
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
                      Nei
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.adminNote}>
                <h3>Notat fra Bedkom</h3>
                <Field
                  placeholder={'Notat fra bedkom'}
                  label={' '}
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

const validate = createValidator({
  name: [required()],
  paymentMail: [isEmail()]
});

export default reduxForm({
  form: 'companyEditor',
  validate,
  enableReinitialize: true
})(CompanyEditor);
