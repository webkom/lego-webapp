import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addCompany,
  editCompany,
  fetchAdmin,
} from 'app/actions/CompanyActions';
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
import { selectCompanyById } from 'app/reducers/companies';
import { addToast } from 'app/reducers/toasts';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { httpCheck, DetailNavigation, ListNavigation } from '../utils';
import styles from './bdb.css';
import type { AutocompleteUser } from 'app/store/models/User';

const validate = createValidator({
  name: [required()],
  paymentMail: [isEmail()],
});

type FormValues = {
  logo?: string;
  name?: string;
  description?: string;
  companyType?: string;
  website?: string;
  address?: string;
  studentContact?: AutocompleteUser;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const CompanyEditor = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const isNew = companyId === undefined;
  const company = useAppSelector((state) =>
    selectCompanyById(state, { companyId }),
  );
  const fetching = useAppSelector((state) => state.companies.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEditCompany',
    () => companyId && dispatch(fetchAdmin(companyId)),
    [companyId],
  );

  const navigate = useNavigate();

  if (!isNew && fetching) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  const nameField = (
    <Field
      placeholder="Bedriftens navn"
      name="name"
      component={TextInput.Field}
      className={styles.editTitle}
      withoutMargin
    />
  );

  const onSubmit = (formContent: FormValues) => {
    const body = {
      ...formContent,
      logo: formContent.logo || undefined,
      studentContact:
        formContent.studentContact && Number(formContent.studentContact.id),
      website: formContent.website && httpCheck(formContent.website),
      companyId: company && company.id,
    };

    dispatch(isNew ? addCompany(body) : editCompany(body)).then((res) => {
      dispatch(
        addToast({
          message: isNew ? 'Bedrift lagt til' : 'Bedrift oppdatert',
        }),
      );
      navigate(`/bdb/${isNew ? res.payload.result : companyId}`);
    });
  };

  const initialValues = isNew
    ? {
        name: '',
        description: '',
        adminComment: '',
        website: '',
        studentContact: '',
        active: 'true',
        phone: '',
        companyType: '',
        paymentMail: '',
        address: '',
      }
    : {
        name: company.name,
        description: company.description,
        adminComment: company.adminComment,
        website: company.website,
        studentContact: company.studentContact && {
          value: Number(company.studentContact.id),
          label: company.studentContact.fullName,
        },
        active: company.active ? 'true' : 'false',
        phone: company.phone,
        companyType: company.companyType,
        paymentMail: company.paymentMail,
        address: company.address,
      };

  return (
    <Content>
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="logo"
              component={ImageUploadField}
              aspectRatio={20 / 6}
              img={company && company.logo}
            />

            {!isNew ? (
              <DetailNavigation title={nameField} companyId={company.id} />
            ) : (
              <ListNavigation title={nameField} />
            )}

            <Field
              placeholder="Beskrivelse av bedriften"
              name="description"
              component={TextEditor.Field}
            />

            <div className={styles.infoBubbles}>
              <InfoBubble
                icon="briefcase"
                data={
                  <Field
                    placeholder="Type bedrift"
                    label=" "
                    name="companyType"
                    component={TextInput.Field}
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
                    name="paymentMail"
                    component={TextInput.Field}
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
                    name="phone"
                    component={TextInput.Field}
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
                    name="website"
                    component={TextInput.Field}
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
                    name="address"
                    component={TextInput.Field}
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
                    name="studentContact"
                    component={SelectInput.AutocompleteField}
                    filter={[AutocompleteContentType.User]}
                  />
                }
                meta="Studentkontakt"
                style={{
                  order: 2,
                }}
              />
            </div>

            <div>
              <MultiSelectGroup name="active" label="Aktiv bedrift?">
                <Field
                  name="Yes"
                  label="Ja"
                  value="true"
                  type="radio"
                  component={RadioButton.Field}
                />
                <Field
                  name="No"
                  label="Nei"
                  value="false"
                  type="radio"
                  component={RadioButton.Field}
                />
              </MultiSelectGroup>
            </div>

            <Field
              placeholder="Bedriften ønsker kun kurs"
              label="Notat fra Bedkom"
              name="adminComment"
              component={TextEditor.Field}
              className={styles.adminNote}
            />

            <SubmissionError />
            <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
          </form>
        )}
      </TypedLegoForm>
    </Content>
  );
};

export default CompanyEditor;
