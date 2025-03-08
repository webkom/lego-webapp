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
import { navigate } from 'vike/client/router';
import {
  TextEditor,
  TextInput,
  ImageUploadField,
  Form,
  RowSection,
} from '~/components/Form';
import LegoFinalForm from '~/components/Form/LegoFinalForm';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import {
  addCompany,
  deleteCompany,
  editCompany,
  fetchAdmin,
} from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCompanyById } from '~/redux/slices/companies';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import { createValidator, required, isEmail } from '~/utils/validation';
import { httpCheck } from './utils';
import type { AdminDetailCompany } from '~/redux/models/Company';

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
  active?: boolean | 'true' | 'false';
  phone?: string;
  paymentMail?: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const CompanyEditor = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const isNew = companyId === undefined;
  const company = useAppSelector((state) =>
    selectCompanyById<AdminDetailCompany>(state, companyId),
  );
  const fetching = useAppSelector((state) => state.companies.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEditCompany',
    () => companyId && dispatch(fetchAdmin(companyId)),
    [companyId],
  );

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
      website: formContent.website && httpCheck(formContent.website),
      companyId: company && company.id,
    };

    dispatch(isNew ? addCompany(body) : editCompany(body)).then((res) => {
      navigate(`/bdb/${isNew ? res.payload.result : companyId}`);
    });
  };

  const initialValues: Partial<FormValues> = !company
    ? {
        name: '',
        description: '',
        website: '',
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

            <Field
              placeholder="Velg bedriftstype"
              label="Type bedrift"
              name="companyType"
              component={TextInput.Field}
            />

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
