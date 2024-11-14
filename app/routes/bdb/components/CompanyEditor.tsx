import {
  Button,
  ConfirmModal,
  Icon,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Trash2 } from 'lucide-react';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addCompany,
  deleteCompany,
  editCompany,
  fetchAdmin,
} from 'app/actions/CompanyActions';
import {
  TextEditor,
  TextInput,
  RadioButton,
  SelectInput,
  ImageUploadField,
  MultiSelectGroup,
  Form,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectCompanyById } from 'app/reducers/companies';
import { addToast } from 'app/reducers/toasts';
import { selectUserById } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { AutocompleteContentType } from 'app/store/models/Autocomplete';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { httpCheck } from '../utils';
import styles from './bdb.module.css';
import type { AdminDetailCompany } from 'app/store/models/Company';
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
    selectCompanyById<AdminDetailCompany>(state, companyId),
  );
  const studentContact = useAppSelector((state) =>
    company?.studentContact !== null
      ? selectUserById(state, company?.studentContact)
      : undefined,
  );
  const fetching = useAppSelector((state) => state.companies.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEditCompany',
    () => companyId && dispatch(fetchAdmin(companyId)),
    [companyId],
  );

  const navigate = useNavigate();

  const title = isNew ? 'Ny bedrift' : `Redigerer: ${company?.name}`;
  const backUrl = isNew ? '/bdb' : `/bdb/${companyId}`;

  if (!isNew && fetching) {
    return (
      <Page title={title} back={{ href: backUrl }}>
        <LoadingIndicator loading />
      </Page>
    );
  }

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

  const initialValues = !company
    ? {
        name: '',
        description: '',
        adminComment: '',
        website: '',
        studentContact: undefined,
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
        studentContact: studentContact && {
          id: studentContact.id,
          value: studentContact.id,
          label: studentContact.fullName,
        },
        active: company.active ? 'true' : 'false',
        phone: company.phone,
        companyType: company.companyType,
        paymentMail: company.paymentMail,
        address: company.address,
      };

  return (
    <Page
      title={title}
      skeleton={fetching}
      back={{ href: backUrl }}
      actionButtons={
        !isNew && (
          <ConfirmModal
            key="delete"
            title="Slett bedrift"
            message="Er du sikker på at du vil slette denne bedriften?"
            onConfirm={() =>
              dispatch(deleteCompany(companyId)).then(() => {
                navigate('/bdb');
              })
            }
          >
            {({ openConfirmModal }) => (
              <Button onPress={openConfirmModal} danger>
                <Icon iconNode={<Trash2 />} size={19} />
                Slett bedrift
              </Button>
            )}
          </ConfirmModal>
        )
      }
    >
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Field
                name="logo"
                component={ImageUploadField}
                aspectRatio={20 / 6}
                img={company && company.logo}
              />

              <Field
                placeholder="Bedriftens navn"
                name="name"
                label="Navn"
                required
                component={TextInput.Field}
              />

              <Field
                placeholder="Beskrivelse av bedriften"
                name="description"
                label="Beskrivelse"
                component={TextEditor.Field}
              />

              <Field
                placeholder="Type bedrift"
                label="Type bedrift"
                name="companyType"
                component={TextInput.Field}
              />

              <Field
                placeholder="mail@abakus.no"
                name="paymentMail"
                label="Fakturamail"
                component={TextInput.Field}
              />

              <Field
                placeholder="123 45 678"
                name="phone"
                label="Telefon"
                component={TextInput.Field}
              />

              <Field
                placeholder="https://www.abakus.no"
                name="website"
                label="Nettside"
                component={TextInput.Field}
              />

              <Field
                placeholder="Adresse"
                name="address"
                label="Adresse"
                component={TextInput.Field}
              />

              <Field
                placeholder="Studentkontakt"
                label="Studentkontakt"
                name="studentContact"
                component={SelectInput.AutocompleteField}
                filter={[AutocompleteContentType.User]}
              />

              <div>
                <MultiSelectGroup name="active" legend="Aktiv bedrift?">
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
            </Form>
          );
        }}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(CompanyEditor);
