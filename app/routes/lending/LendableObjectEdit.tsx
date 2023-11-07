import { Field, FormSpy } from 'react-final-form';
import { useParams } from 'react-router-dom';
import { createLendableObject } from 'app/actions/LendableObjectActions';
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
import { useAppDispatch } from 'app/store/hooks';
import { roleOptions } from 'app/utils/constants';
import { spySubmittable } from 'app/utils/formSpyUtils';

type Params = {
  lendableObjectId: string | undefined;
};

const LendableObjectEdit = () => {
  const { lendableObjectId } = useParams<Params>();
  const isNew = lendableObjectId === undefined;

  const dispatch = useAppDispatch();

  const onSubmit = (values) =>
    dispatch(
      createLendableObject({
        ...values,
        responsibleGroups: values.responsibleGroups.map((group) => group.id),
        responsibleRoles: values.responsibleRoles.map((role) => role.value),
      })
    );

  return (
    <Content>
      <LegoFinalForm onSubmit={onSubmit} subscription={{}}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FormSpy>
              {(form) => {
                return <pre>{JSON.stringify(form.values, undefined, 2)}</pre>;
              }}
            </FormSpy>
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
              initialized={true}
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
