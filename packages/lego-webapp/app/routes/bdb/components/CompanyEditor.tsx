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
import { useNavigate, useParams } from 'react-router';
import {
  TextEditor,
  TextInput,
  SelectInput,
  ImageUploadField,
  Form,
  RowSection,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import ToggleSwitch from 'app/components/Form/ToggleSwitch';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required, isEmail } from 'app/utils/validation';
import {
  addCompany,
  deleteCompany,
  editCompany,
  fetchAdmin,
} from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { AutocompleteContentType } from '~/redux/models/Autocomplete';
import { selectCompanyById } from '~/redux/slices/companies';
import { selectUsersByIds } from '~/redux/slices/users';
import { httpCheck } from '../utils';
import type {
  AdminDetailCompany,
  StudentCompanyContact,
} from '~/redux/models/Company';
import type { AutocompleteUser } from '~/redux/models/User';

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
  active?: boolean;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const CompanyEditor = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const isNew = companyId === undefined;
  const company = useAppSelector((state) =>
    selectCompanyById<AdminDetailCompany>(state, companyId),
  );
  const studentContacts = useAppSelector((state) =>
    company?.studentContacts !== null
      ? selectUsersByIds(
          state,
          company?.studentContacts?.map(
            (studentContact) => studentContact.user,
          ),
        )
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
      navigate(`/bdb/${isNew ? res.payload.result : companyId}`);
    });
  };

  const initialValues = !company
    ? {
        name: '',
        description: '',
        website: '',
        studentContacts: [] as StudentCompanyContact[],
        active: 'true',
        phone: '',
        companyType: '',
        paymentMail: '',
        address: '',
      }
    : {
        name: company.name,
        description: company.description,
        website: company.website,
        studentContact:
          studentContacts &&
          studentContacts.map((studentContact) => ({
            value: studentContact.id,
            label: studentContact.fullName,
          })),
        active: company.active,
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
        {({ handleSubmit }) => (
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

            <RowSection>
              <Field
                placeholder="Beskrivelse av bedriften"
                name="description"
                label="Beskrivelse"
                component={TextEditor.Field}
              />
            </RowSection>

            <RowSection>
              <Field
                placeholder="Velg bedriftstype"
                label="Type bedrift"
                name="companyType"
                component={TextInput.Field}
              />
              <Field
                placeholder="Studentkontakter"
                name="studentContacts"
                isMulti
                component={SelectInput.AutocompleteField}
                filter={[AutocompleteContentType.User]}
              />
            </RowSection>

            <RowSection>
              <Field
                placeholder="penger@bedrift.no"
                name="paymentMail"
                label="E-post for faktura"
                component={TextInput.Field}
              />
              <Field
                placeholder="+47 909 09 090"
                name="phone"
                label="Telefon"
                component={TextInput.Field}
              />
            </RowSection>

            <RowSection>
              <Field
                placeholder="https://bedrift.no"
                name="website"
                label="Nettside"
                component={TextInput.Field}
              />
              <Field
                placeholder="Sem Sælands vei 7-9, 7491 Trondheim"
                name="address"
                label="Adresse"
                component={TextInput.Field}
              />
            </RowSection>

            <Field
              name="active"
              label="Aktiv bedrift?"
              component={ToggleSwitch.Field}
            />

            <SubmissionError />
            <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
          </Form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(CompanyEditor);
