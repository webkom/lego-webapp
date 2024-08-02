import {
  ButtonGroup,
  ConfirmModal,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createLendableObject,
  deleteLendableObject,
  editLendableObject,
  fetchLendableObject,
} from 'app/actions/LendableObjectActions';
import {
  Button,
  EditorField,
  Form,
  SelectInput,
  SubmitButton,
  TextInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { selectAllGroups } from 'app/reducers/groups';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { roleOptions } from 'app/utils/constants';
import type {
  DetailedLendableObject,
  EditingLendableObject,
} from 'app/store/models/LendableObject';

const TypedLegoForm = LegoFinalForm<EditingLendableObject>;

const LendableObjectEdit = () => {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();
  const isNew = lendableObjectId === undefined;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  usePreparedEffect(
    'fetchLendableObject',
    () => lendableObjectId && dispatch(fetchLendableObject(lendableObjectId)),
    [lendableObjectId],
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById<DetailedLendableObject>(state, lendableObjectId),
  );

  const groups = useAppSelector(selectAllGroups);

  const onSubmit = (values: EditingLendableObject) => {
    if (isNew) {
      dispatch(
        createLendableObject({
          ...values,
          responsibleGroups: values.responsibleGroups?.map((group) => group.id),
          responsibleRoles: values.responsibleRoles?.map((role) => role.value),
        }),
      ).then(() => navigate('/lending'));
    } else {
      dispatch(
        editLendableObject({
          ...values,
          id: lendableObjectId,
          responsibleGroups: values.responsibleGroups.map(
            (group) => group.id || group.value,
          ),
          responsibleRoles: values.responsibleRoles.map((role) => role.value),
        }),
      ).then(() => navigate(`/lending/${lendableObjectId}`));
    }
  };

  const onDelete = async () => {
    if (!lendableObjectId) {
      return;
    }
    await dispatch(deleteLendableObject(lendableObjectId));
    navigate('/lending');
  };

  const initialValues = !isNew
    ? {
        ...lendableObject,
        responsibleRoles: lendableObject?.responsibleRoles.map((role) => ({
          label: roleOptions.find((r) => r.value === role)?.label || role,
          value: role,
        })),
        responsibleGroups: (lendableObject?.responsibleGroups || [])
          .filter(Boolean)
          .map((group) => ({
            label: groups.find((g) => g.id === group)?.name || group,
            value: groups.find((g) => g.id === group),
          })),
      }
    : {};

  const showLoading = !(isNew || (lendableObject && groups));
  const title = isNew
    ? 'Opprett utlånsobjekt'
    : `Redigerer ${lendableObject?.title}`;
  return (
    <Page title={title} back={{ href: `/lending/${lendableObject?.id}` }}>
      <LoadingIndicator loading={showLoading}>
        <TypedLegoForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          subscription={{}}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                name="title"
                label="Navn"
                placeholder="Navn på utleieobjekt"
                component={TextInput.Field}
              />
              <Field
                name="description"
                label="Beskrivelse"
                component={EditorField.Field}
              />
              <Field
                name="responsibleGroups"
                filter={['users.abakusgroup']}
                label="Ansvarlige grupper"
                placeholder="Skriv inn gruppene som skal kunne administrere objektet"
                component={SelectInput.AutocompleteField}
                isMulti
              />
              <Field
                label="Ansvarlige roller (hvis du lar denne stå tom inkluderer du alle i gruppen!)"
                name="responsibleRoles"
                isMulti
                placeholder="Velg rolle"
                options={roleOptions}
                component={SelectInput.Field}
              />
              <Field
                name="location"
                label="Lokasjon"
                placeholder="Hvor befinner objektet seg?"
                component={TextInput.Field}
              />
              <SubmissionError />
              <ButtonGroup>
                <SubmitButton>
                  {isNew ? 'Opprett utlånsobjekt' : 'Lagre endringer'}
                </SubmitButton>
                {!isNew && (
                  <ConfirmModal
                    title="Bekreft sletting"
                    message={`Er du sikker på at du vil slette ${lendableObject?.title}?`}
                    onConfirm={onDelete}
                  >
                    {({ openConfirmModal }) => (
                      <Button danger onPress={openConfirmModal}>
                        Slett utlånsobjekt
                      </Button>
                    )}
                  </ConfirmModal>
                )}
              </ButtonGroup>
            </Form>
          )}
        </TypedLegoForm>
      </LoadingIndicator>
    </Page>
  );
};

export default LendableObjectEdit;
