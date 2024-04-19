import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { createPoll, deletePoll, editPoll } from 'app/actions/PollActions';
import { Content } from 'app/components/Content';
import {
  TextInput,
  SelectInput,
  TextArea,
  CheckBox,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import NavigationTab from 'app/components/NavigationTab';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';
import styles from './PollEditor.css';
import type { EntityId } from '@reduxjs/toolkit';
import type Poll from 'app/store/models/Poll';
import type { ReactNode } from 'react';

type Props = {
  poll?: Poll;
  editing?: boolean;
  toggleEdit?: () => void;
};

const renderOptions = ({ fields }): ReactNode => (
  <>
    <ul>
      {fields.map((option: string, i: number) => (
        <li className={styles.optionField} key={i}>
          <Field
            name={`${option}.name`}
            label={`Valg nr. ${i + 1}`}
            placeholder={`Valg ${i + 1}`}
            component={TextInput.Field}
            validate={(value) => {
              if (!value || value.length == 0) return 'Alle valg må ha et navn';
              if (value.length > 30)
                return 'Valget kan ikke være lengre enn 30 tegn';
              return undefined;
            }}
            required
          />
          <ConfirmModal
            title="Slett valg"
            message="Er du sikker på at du vil fjerne dette valget?"
            onConfirm={async () => await fields.remove(i)}
            closeOnConfirm
          >
            {({ openConfirmModal }) => (
              <Tooltip className="deleteOption" content="Fjern">
                <Icon onClick={openConfirmModal} name="trash" danger />
              </Tooltip>
            )}
          </ConfirmModal>
        </li>
      ))}
    </ul>

    <Button onClick={() => fields.push({})}>
      <Icon name="add" size={25} />
      Legg til alternativ
    </Button>
  </>
);

const validate = createValidator({
  title: [required('Du må gi avstemningen en tittel')],
});

const PollEditor = ({
  poll,
  editing = false,
  toggleEdit = () => {},
}: Props) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

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
      id: EntityId | null | undefined;
      name: string;
    }>;
    resultsHidden: boolean;
    pinned: boolean;
  }) => {
    const payload = {
      title,
      description,
      resultsHidden,
      tags: tags ? tags.map((val) => val.value) : [],
      options,
      pinned: pinned || false,
      ...(rest as Record<string, any>),
    };

    dispatch(editing ? editPoll(payload) : createPoll(payload)).then(() => {
      navigate('/polls');
      toggleEdit();
    });
  };

  const initialValues = {
    pollId: poll?.id,
    title: poll?.title,
    description: poll?.description,
    resultsHidden: poll?.resultsHidden,
    pinned: poll?.pinned || false,
    tags: poll?.tags.map((value) => ({
      className: 'Select-create-option-placeholder',
      label: value,
      value: value,
    })),
    options: poll?.options || [{}, {}],
  };

  return (
    <>
      <LegoFinalForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
        subscription={{}}
      >
        {({ handleSubmit }) => (
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
              placeholder="Mer info ..."
              component={TextArea.Field}
            />
            <Field
              name="pinned"
              label="Vis på forsiden"
              type="checkbox"
              component={CheckBox.Field}
            />
            <Field
              name="resultsHidden"
              label="Skjul resultatet"
              type="checkbox"
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
            />
            <FieldArray
              name="options"
              component={renderOptions}
              rerenderOnEveryChange
            />

            <SubmissionError />
            <Flex className={styles.actionButtons}>
              <SubmitButton>
                {editing ? 'Lagre endringer' : 'Lag ny avstemning'}
              </SubmitButton>
              {editing && (
                <ConfirmModal
                  title="Slett avstemning"
                  message="Er du sikker på at du vil slette avstemningen?"
                  onConfirm={() =>
                    dispatch(deletePoll(poll?.id)).then(() => {
                      navigate('/polls');
                    })
                  }
                  closeOnConfirm
                >
                  {({ openConfirmModal }) => (
                    <Button onClick={openConfirmModal} danger>
                      <Icon name="trash" size={19} />
                      Slett avstemning
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </Flex>
          </form>
        )}
      </LegoFinalForm>
    </>
  );
};

export default PollEditor;

export const PollCreator = () => {
  const title = 'Ny avstemning';
  return (
    <Content>
      <Helmet title={title} />
      <NavigationTab
        title={title}
        back={{
          label: 'Tilbake',
          path: '/polls',
        }}
      />
      <PollEditor />
    </Content>
  );
};
