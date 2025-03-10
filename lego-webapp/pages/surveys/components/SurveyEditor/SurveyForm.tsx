import { EntityId } from '@reduxjs/toolkit';
import { Button, Card, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import Dropdown from '~/components/Dropdown';
import {
  Form,
  DatePicker,
  LegoFinalForm,
  SelectInput,
  TextInput,
  SubmitButton,
  SubmissionError,
  CheckBox,
} from '~/components/Form';
import Time from '~/components/Time';
import Question from '~/pages/surveys/components/SurveyEditor/Question';
import {
  hasOptions,
  initialQuestion,
} from '~/pages/surveys/components/SurveyEditor/utils';
import styles from '~/pages/surveys/components/surveys.module.css';
import { spyValues } from '~/utils/formSpyUtils';
import { createValidator, required } from '~/utils/validation';
import type { FieldArrayRenderProps } from 'react-final-form-arrays';
import type {
  FormSurvey,
  FormSubmitSurvey,
  DetailedSurvey,
} from '~/redux/models/Survey';
import type { FormSurveyQuestion } from '~/redux/models/SurveyQuestion';

const TypedLegoForm = LegoFinalForm<FormSurvey>;

const validate = createValidator(
  {
    title: [required()],
    event: [required()],
  },
  hasOptions,
);

type Props = {
  isNew?: boolean;
  onSubmit: (surveyData: FormSubmitSurvey) => Promise<void>;
  initialValues: Partial<FormSurvey>;
  templateId: EntityId | undefined;
  setTemplateId: (id: string) => void;
  templates: DetailedSurvey[];
};

const SurveyForm = ({
  isNew,
  onSubmit,
  initialValues,
  templateId,
  setTemplateId,
  templates,
}: Props) => {
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const internalOnSubmit = (surveyData: FormSurvey) => {
    return onSubmit({
      ...surveyData,
      event: surveyData?.event?.value ?? null,
      questions: surveyData.questions.map((question, i) => ({
        ...question,
        questionType: question.questionType.value,
        options: question.options.slice(0, -1),
        relativeIndex: i,
      })),
    });
  };

  return (
    <TypedLegoForm
      onSubmit={internalOnSubmit}
      validate={validate}
      initialValues={initialValues}
      subscription={{}}
      mutators={{
        ...arrayMutators,
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            placeholder="Spørreundersøkelse for arrangementet"
            label="Tittel"
            name="title"
            component={TextInput.Field}
          />

          <Field
            name="isTemplate"
            id="isTemplate"
            label="Lagre som mal"
            type="checkbox"
            component={CheckBox.Field}
          />

          {templates.length > 0 && (
            <div className={styles.templatePicker}>
              <ConfirmModal
                title="Bekreft bruk av mal"
                message={
                  'Dette vil slette alle ulagrede endringer i undersøkelsen!\n' +
                  'Lagrede endringer vil ikke overskrives før du trykker "Lagre".'
                }
                closeOnConfirm
                onCancel={async () => setTemplatePickerOpen(false)}
                onConfirm={async () => setTemplatePickerOpen(true)}
              >
                {({ openConfirmModal }) => (
                  <Button onPress={openConfirmModal}>
                    {templateId ? 'Bytt mal' : 'Bruk mal'}
                  </Button>
                )}
              </ConfirmModal>
              <Dropdown
                className={styles.templateDropdown}
                show={templatePickerOpen}
                toggle={() => setTemplatePickerOpen(false)}
                closeOnContentClick
              >
                <TemplateTypeDropdownItems
                  setTemplateId={setTemplateId}
                  templates={templates}
                />
              </Dropdown>
            </div>
          )}
          {spyValues((values: FormSurvey) =>
            // If this is a template
            values.isTemplate ? (
              <h2>Dette er malen {values.title}</h2>
            ) : (
              <Flex
                gap="var(--spacing-md)"
                className={styles.eventAndTimeFields}
              >
                <Field
                  placeholder="Velg arrangement"
                  label="Arrangement"
                  name="event"
                  component={SelectInput.AutocompleteField}
                  filter={['events.event']}
                />

                <Field
                  label="Aktiveringstidspunkt"
                  name="activeFrom"
                  component={DatePicker.Field}
                />
              </Flex>
            ),
          )}

          <FieldArray
            name="questions"
            component={Questions}
            rerenderOnEveryChange={true}
          />
          <Card severity="info">
            <span>
              Deltagerene på arrangementet vil få e-post med link til
              spørreundersøkelsen når den aktiveres ({<SurveyActivationTime />}
              ). Legg merke til at kun deltagerene som har registrert oppmøte
              vil få e-post.
            </span>
          </Card>
          <SubmissionError />
          <SubmitButton allowPristine={isNew && !!templateId}>
            {isNew ? 'Opprett' : 'Lagre'}
          </SubmitButton>
        </Form>
      )}
    </TypedLegoForm>
  );
};

type TemplateTypeDropdownItemsProps = {
  setTemplateId: (templateId: EntityId) => void;
  templates: DetailedSurvey[];
};
const TemplateTypeDropdownItems = ({
  setTemplateId,
  templates,
}: TemplateTypeDropdownItemsProps) => {
  return (
    <Dropdown.List>
      {templates.map((template) => {
        return (
          <Dropdown.ListItem key={template.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTemplateId(template.id);
              }}
            >
              {template.title}
            </a>
          </Dropdown.ListItem>
        );
      })}
    </Dropdown.List>
  );
};

type QuestionsProps = FieldArrayRenderProps<FormSurveyQuestion, HTMLElement>;
const updateRelativeIndexes = (
  oldIndex: number,
  newIndex: number,
  fields: QuestionsProps['fields'],
) => {
  fields.move(oldIndex, newIndex);
};
const Questions = ({ fields }: QuestionsProps) => (
  <>
    {fields.map((question, i) => (
      <Question
        key={i}
        numberOfQuestions={fields.length ?? 0}
        question={question}
        questionData={fields.value[i]}
        deleteQuestion={() => Promise.resolve(fields.remove(i))}
        updateRelativeIndexes={updateRelativeIndexes}
        relativeIndex={i}
        fields={fields}
      />
    ))}

    <Icon
      iconNode={<Plus />}
      size={30}
      onPress={() => {
        fields.push(initialQuestion);
      }}
      className={styles.addQuestion}
    />
  </>
);

const SurveyActivationTime = () =>
  spyValues((values: FormSurvey) => (
    <Time time={values.activeFrom} format="HH:mm DD. MMM" />
  ));

export default SurveyForm;
