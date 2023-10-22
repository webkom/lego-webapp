import { LoadingIndicator } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { Content } from 'app/components/Content';
import {
  TextEditor,
  TextInput,
  RadioButton,
  SelectInput,
  ImageUploadField,
  MultiSelectGroup,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import InfoBubble from 'app/components/InfoBubble';
import type {
  CompanyEntity,
  SubmitCompanyEntity,
} from 'app/reducers/companies';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { httpCheck, DetailNavigation, ListNavigation } from '../utils';
import styles from './bdb.css';

type Props = {
  uploadFile: (arg0: Record<string, any>) => Promise<any>;
  company: CompanyEntity;
  autoFocus: any;
  fetching: boolean;
  submitFunction: (arg0: SubmitCompanyEntity) => Promise<any>;
  deleteCompany: (arg0: number) => Promise<any>;
};

const validate = createValidator({
  name: [required()],
  paymentMail: [isEmail()],
});

const CompanyEditor = ({
  company,
  autoFocus,
  uploadFile,
  fetching,
  deleteCompany,
  submitFunction,
}: Props) => {
  if (fetching) {
    return <LoadingIndicator loading />;
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

  const onSubmit = (formContent) =>
    submitFunction({
      ...formContent,
      logo: formContent.logo || undefined,
      studentContact:
        formContent.studentContact && Number(formContent.studentContact.id),
      website: httpCheck(formContent.website),
      companyId: company && company.id,
    });

  return (
    <Content>
      <div className={styles.detail}>
        <LegoFinalForm
          onSubmit={onSubmit}
          validate={validate}
          subscription={{}}
        >
          {({ handleSubmit }) => (
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
                  style={{
                    order: 0,
                  }}
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
                      required
                    />
                  }
                  meta="Fakturamail"
                  style={{
                    order: 1,
                  }}
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
                  style={{
                    order: 2,
                  }}
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
                  style={{
                    order: 0,
                  }}
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
                  style={{
                    order: 1,
                  }}
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
                  style={{
                    order: 2,
                  }}
                />
              </div>

              <div className={styles.info}>
                <div
                  style={{
                    order: 0,
                  }}
                >
                  <MultiSelectGroup name="active" label="Aktiv bedrift?">
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
                  </MultiSelectGroup>
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

              <SubmissionError />
              <SubmitButton>Lagre</SubmitButton>
            </form>
          )}
        </LegoFinalForm>
      </div>
    </Content>
  );
};

export default CompanyEditor;
