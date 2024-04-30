import { LoadingIndicator, ConfirmModal, Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createLendableObject,
  deleteLendableObject,
  editLendableObject,
  fetchLendableObject,
} from 'app/actions/LendableObjectActions';
import { Content } from 'app/components/Content';
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
import { FlexRow } from 'app/components/FlexBox';

type Params = {
  lendableObjectId: string | undefined;
};

const LendableObjectEdit = () => {
  const { lendableObjectId } = useParams<Params>();
  const isNew = lendableObjectId === undefined;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  usePreparedEffect(
    'fetchLendableObject',
    () => dispatch(fetchLendableObject(Number(lendableObjectId))),
    [isNew],
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendableObjectId),
  );

  const groups = useAppSelector(selectAllGroups);

  const onSubmit = (values) => {
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
          id: lendableObjectId,
          ...values,
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

  if (!isNew && !lendableObject) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  if (!isNew && !groups) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  const initialValues = !isNew
    ? {
        ...lendableObject,
        responsibleRoles: lendableObject.responsibleRoles.map((role) => ({
          label: roleOptions.find((r) => r.value === role)?.label || role,
          value: role,
        })),
        responsibleGroups: (lendableObject?.responsibleGroups || [])
          .filter(Boolean)
          .map((groups) => ({
            label: groups.name,
            value: groups.id,
          })),
      }
    : {};

  return (
    <Content>
      <LegoFinalForm
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
            <FlexRow>
              <SubmitButton>
                {isNew ? 'Opprett utlånsobjekt' : 'Lagre endringer'}
              </SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Bekreft sletting"
                  message={`Er du sikker på at du vil slette ${lendableObject.name}"?`}
                  onConfirm={onDelete}
                >
                  {({ openConfirmModal }) => (
                    <Button danger disabled={false} onClick={openConfirmModal}>
                      Slett utlånsobjekt
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </FlexRow>
          </Form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default LendableObjectEdit;
