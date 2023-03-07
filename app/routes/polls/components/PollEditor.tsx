import arrayMutators from 'final-form-arrays';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import {
  TextInput,
  SelectInput,
  TextArea,
  CheckBox,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import NavigationTab from 'app/components/NavigationTab';
import Tooltip from 'app/components/Tooltip';
import type { ID } from 'app/models';
import type { PollEntity } from 'app/reducers/polls';
import { createValidator, required } from 'app/utils/validation';
import styles from './PollEditor.css';
import type { ReactNode } from 'react';

const keyCodes = {
  enter: 13,
  space: 32,
};
type Props = {
  editOrCreatePoll: (arg0: PollEntity) => Promise<any>;
  //TODO add reduxForm typing
  editing: boolean;
  initialValues: PollEntity;
  pollId: ID;
  deletePoll: () => Promise<any>;
  toggleEdit: () => void;
};

const renderOptions = ({ fields }: any): ReactNode => (
  <div>
    <ul className={styles.options}>
      {fields.map((option: string, i: number) => (
        <li className={styles.optionField} key={i}>
          <Field
            name={`${option}.name`}
            label={`Valg nr. ${i + 1}`}
            placeholder={`Valg ${i + 1}`}
            component={TextInput.Field}
            validate={(value) =>
              value && value.length > 0
                ? undefined
                : 'Alle alternativer må ha et navn'
            }
            required
          />
          <ConfirmModalWithParent
            title="Slett valg"
            message="Er du sikker på at du vil slette dette valget?"
            onConfirm={async () => fields.remove(i)}
            closeOnConfirm
            className={styles.deleteOption}
          >
            <Tooltip content="Fjern">
              <Icon name="trash" className={styles.deleteOption} />
            </Tooltip>
          </ConfirmModalWithParent>
        </li>
      ))}
    </ul>

    <Button onClick={() => fields.push({})}>
      <Icon name="add" size={25} />
      Legg til alternativ
    </Button>
  </div>
);

const validate = createValidator({
  title: [required('Du må gi avstemningen en tittel')],
});

const EditPollForm = ({
  deletePoll,
  editOrCreatePoll,
  editing,
  initialValues,
  toggleEdit,
}: Props) => {
  const onSubmit = ({
    title,
    description,
    tags,
    options,
    pinned,
    resultsHidden,
    ...rest
  }: {
    title: string;
    description: string;
    tags: Array<{
      value: string;
    }>;
    options: Array<{
      id: ID | null | undefined;
      name: string;
    }>;
    resultsHidden: boolean;
    pinned: boolean;
  }) =>
    editOrCreatePoll({
      title,
      description,
      resultsHidden,
      tags: tags ? tags.map((val) => val.value) : [],
      options,
      pinned: pinned ? pinned : false,
      ...(rest as Record<string, any>),
    }).then(() => toggleEdit());

  return (
    <Content>
      <Helmet title={editing ? `Redigerer avstemning` : 'Ny avstemning'} />
      {!editing && (
        <NavigationTab
          title="Ny avstemning"
          back={{
            label: 'Tilbake',
            path: '/polls',
          }}
        />
      )}
      <LegoFinalForm
        onSubmit={onSubmit}
        initialValues={initialValues ?? { options: [{}, {}], pinned: false }}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ handleSubmit, pristine, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="title"
              label="Spørsmål"
              placeholder="Hva er din favorittrett?"
              component={TextInput.Field}
              required
            />
            <Field
              name="description"
              label="Beskrivelse"
              placeholder="Mer info..."
              component={TextArea.Field}
            />
            <Field
              name="pinned"
              label="Vis på forsiden"
              component={CheckBox.Field}
            />
            <Field
              name="resultsHidden"
              label="Skjul resultatet"
              component={CheckBox.Field}
            />
            <Field
              name="tags"
              label="Tags"
              filter={['tags.tag']}
              placeholder="Skriv inn tags"
              component={SelectInput.AutocompleteField}
              isMulti
              tags
              shouldKeyDownEventCreateNewOption={({
                keyCode,
              }: {
                keyCode: number;
              }) => keyCode === keyCodes.enter || keyCode === keyCodes.space}
            />
            <FieldArray
              name="options"
              component={renderOptions}
              rerenderOnEveryChange={true}
            />
            <Flex className={styles.actionButtons}>
              <Button
                disabled={pristine || submitting}
                success={editing}
                submit
              >
                {editing ? 'Lagre endringer' : 'Lag ny avstemning'}
              </Button>
              {editing && (
                <ConfirmModalWithParent
                  title="Slett avstemning"
                  message="Er du sikker på at du vil slette avstemningen?"
                  onConfirm={deletePoll}
                  closeOnConfirm
                >
                  <Button danger>
                    <Icon name="trash" size={19} />
                    Slett avstemning
                  </Button>
                </ConfirmModalWithParent>
              )}
            </Flex>
          </form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default EditPollForm;
