import { Button, ButtonGroup, ConfirmModal, Icon } from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import { Plus, Trash2 } from 'lucide-react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { navigate } from 'vike/client/router';
import {
  CheckBox,
  Form,
  LegoFinalForm,
  SelectInput,
  SubmissionError,
  SubmitButton,
  TextArea,
  TextInput,
} from '~/components/Form';
import Tooltip from '~/components/Tooltip';
import styles from '~/pages/polls/@pollsId/PollEditor.module.css';
import { createPoll, deletePoll, editPoll } from '~/redux/actions/PollActions';
import { useAppDispatch } from '~/redux/hooks';
import { createValidator, required } from '~/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import type Poll from '~/redux/models/Poll';
type Props = {
  poll?: Poll;
  editing?: boolean;
  toggleEdit?: () => void;
};

const renderOptions = ({ fields }): ReactNode => (
  <>
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
              <Icon onPress={openConfirmModal} iconNode={<Trash2 />} danger />
            </Tooltip>
          )}
        </ConfirmModal>
      </li>
    ))}

    <Button onPress={() => fields.push({})}>
      <Icon iconNode={<Plus />} size={19} />
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
          <Form onSubmit={handleSubmit}>
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
            <ButtonGroup>
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
                    <Button onPress={openConfirmModal} danger>
                      <Icon iconNode={<Trash2 />} size={19} />
                      Slett avstemning
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </ButtonGroup>
          </Form>
        )}
      </LegoFinalForm>
    </>
  );
};

export default PollEditor;
