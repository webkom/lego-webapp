// @flow

import { Field } from 'redux-form';

import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import {
  ImageUploadField,
  legoForm,
  RadioButton,
  RadioButtonGroup,
  SelectInput,
  TextEditor,
  TextInput,
} from 'app/components/Form';
import InfoBubble from 'app/components/InfoBubble';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type {
  CompanyEntity,
  SubmitCompanyEntity,
} from 'app/reducers/companies';
import { createValidator, isEmail, required } from 'app/utils/validation';
import { DetailNavigation, httpCheck, ListNavigation } from '../utils.js';

import styles from './bdb.css';

type Props = {
  uploadFile: (Object) => Promise<*>,
  company: CompanyEntity,
  submitting: boolean,
  handleSubmit: ((CompanyEntity) => Promise<*>) => void,
  autoFocus: any,
  fetching: boolean,
  submitFunction: (SubmitCompanyEntity, ?number) => Promise<*>,
  deleteCompany: (number) => Promise<*>,
};

const CompanyEditor = ({
  company,
  submitting,
  autoFocus,
  handleSubmit,
  uploadFile,
  fetching,
  deleteCompany,
}: Props) => {
  if (fetching) {
    return <LoadingIndicator />;
  }

  const nameField = (
    <Field
      placeholder="Bedriftens navn"
      label=" "
      autoFocus={autoFocus}
      name="name"
      component={TextInput.Field}
      className={styles.editTitle}
    />
  );

  return (
    <Content>
      <div className={styles.detail}>
        <form onSubmit={handleSubmit}>
          <Field
            name="logo"
            component={ImageUploadField}
            uploadFile={uploadFile}
            aspectRatio={20 / 6}
            img={company && company.logo}
          />

          {company ? (
            <DetailNavigation
              title={nameField}
              companyId={company.id}
              deleteFunction={deleteCompany}
            />
          ) : (
            <ListNavigation title={nameField} />
          )}

          <div className={styles.description}>
            <Field
              placeholder="Beskrivelse av bedriften"
              label=" "
              autoFocus={autoFocus}
              name="description"
              component={TextEditor.Field}
            />
          </div>

          <div className={styles.infoBubbles}>
            <InfoBubble
              icon="briefcase"
              data={
                <Field
                  placeholder="Type bedrift"
                  label=" "
                  autoFocus={autoFocus}
                  name="companyType"
                  component={TextInput.Field}
                  className={styles.editBubble}
                />
              }
              meta="Type bedrift"
              style={{ order: 0 }}
            />
            <InfoBubble
              icon="mail"
              data={
                <Field
                  placeholder="Fakturamail"
                  label=" "
                  autoFocus={autoFocus}
                  name="paymentMail"
                  component={TextInput.Field}
                  className={styles.editBubble}
                />
              }
              meta="Fakturamail"
              style={{ order: 1 }}
            />
            <InfoBubble
              icon="call"
              data={
                <Field
                  placeholder="Telefonnummer"
                  label=" "
                  autoFocus={autoFocus}
                  name="phone"
                  component={TextInput.Field}
                  className={styles.editBubble}
                />
              }
              meta="Telefon"
              style={{ order: 2 }}
            />
          </div>

          <div className={styles.infoBubbles}>
            <InfoBubble
              icon="at"
              data={
                <Field
                  placeholder="Nettside"
                  label=" "
                  autoFocus={autoFocus}
                  name="website"
                  component={TextInput.Field}
                  className={styles.editBubble}
                />
              }
              meta="Nettside"
              style={{ order: 0 }}
            />

            <InfoBubble
              icon="home"
              data={
                <Field
                  placeholder="Adresse"
                  label=" "
                  autoFocus={autoFocus}
                  name="address"
                  component={TextInput.Field}
                  className={styles.editBubble}
                />
              }
              meta="Adresse"
              style={{ order: 1 }}
            />
            <InfoBubble
              icon="person"
              data={
                <Field
                  placeholder="Studentkontakt"
                  label=" "
                  autoFocus={autoFocus}
                  name="studentContact"
                  component={SelectInput.AutocompleteField}
                  className={styles.editBubble}
                  filter={['users.user']}
                />
              }
              meta="Studentkontakt"
              style={{ order: 2 }}
            />
          </div>

          <div className={styles.info}>
            <div style={{ order: 0 }}>
              <RadioButtonGroup name="active" label="Aktiv bedrift?">
                <Field
                  name="Yes"
                  label="Ja"
                  component={RadioButton.Field}
                  inputValue="true"
                />
                <Field
                  name="No"
                  label="Nei"
                  component={RadioButton.Field}
                  inputValue="false"
                />
              </RadioButtonGroup>
            </div>
          </div>

          <div className={styles.adminNote}>
            <Field
              placeholder="Bedriften ønsker kun kurs"
              label="Notat fra Bedkom"
              autoFocus={autoFocus}
              name="adminComment"
              component={TextEditor.Field}
            />
          </div>

          <div className={styles.clear} />
          <Button
            className={styles.submit}
            disabled={submitting}
            submit
            success
          >
            Lagre
          </Button>
        </form>
      </div>
    </Content>
  );
};

const onSubmit = (formContent, dispatch, { company, submitFunction }: Props) =>
  submitFunction({
    ...formContent,
    logo: formContent.logo || undefined,
    studentContact:
      formContent.studentContact && Number(formContent.studentContact.id),
    website: httpCheck(formContent.website),
    companyId: company && company.id,
  });

const validate = createValidator({
  name: [required()],
  paymentMail: [isEmail()],
});

export default legoForm({
  form: 'companyEditor',
  validate,
  onSubmit,
  enableReinitialize: true,
})(CompanyEditor);
