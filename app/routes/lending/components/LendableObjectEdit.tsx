import { Field, FormSpy } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createLendableObject,
  editLendableObject,
  fetchLendableObject,
} from 'app/actions/LendableObjectActions';
import { Content } from 'app/components/Content';
import {
  Button,
  EditorField,
  Form,
  SelectInput,
  TextInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { roleOptions } from 'app/utils/constants';
import { spySubmittable } from 'app/utils/formSpyUtils';
import { usePreparedEffect } from '@webkom/react-prepare';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { LoadingIndicator } from '@webkom/lego-bricks';
import { fetchGroup } from 'app/actions/GroupActions';
import { selectGroups } from 'app/reducers/groups';

type Params = {
  lendableObjectId: string | undefined;
};

const LendableObjectEdit = () => {
  const { lendableObjectId } = useParams<Params>();
  const isNew = lendableObjectId === undefined;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isNew) {
    usePreparedEffect(
      'fetchLendableObject',
      () => dispatch(fetchLendableObject(Number(lendableObjectId))),
      []
    );
  }

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, {
      lendableObjectId,
    })
  );

  const groups = useAppSelector((state) => selectGroups(state));

  const onSubmit = (values) => {
    if (isNew) {
      dispatch(
        createLendableObject({
          ...values,
          responsibleGroups: values.responsibleGroups.map((group) => group.id),
          responsibleRoles: values.responsibleRoles.map((role) => role.value),
        })
      ).then(() => navigate('/lending'));
    } else {
      dispatch(
        editLendableObject({
          id: lendableObjectId,
          ...values,
          responsibleGroups: values.responsibleGroups.map((group) => group.id),
          responsibleRoles: values.responsibleRoles.map((role) => role.value),
        })
      ).then(() => navigate(`/lending/${lendableObjectId}`));
    }
  };

  if (!isNew && !lendableObject) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  /*for (let group of lendableObject.responsibleGroups) {
    dispatch(fetchGroup(group));
  }*/

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
        responsibleGroups: (lendableObject?.responsibleGroups || []).filter(Boolean).map((groups) => ({
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
            {spySubmittable((submittable) => (
              <Button disabled={!submittable} submit>
                {isNew ? 'Opprett utlåndsobjekt' : 'Lagre endringer'}
              </Button>
            ))}
          </Form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default LendableObjectEdit;
