import { Button, Card, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import arrayMutators from 'final-form-arrays';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Link } from 'react-router';
import { fetchTemplates } from 'app/actions/SurveyActions';
import Dropdown from 'app/components/Dropdown';
import {
  Form,
  DatePicker,
  LegoFinalForm,
  SelectInput,
  TextInput,
  SubmitButton,
  SubmissionError,
  CheckBox,
} from 'app/components/Form';
import Time from 'app/components/Time';
import Question from 'app/routes/surveys/components/SurveyEditor/Question';
import {
  hasOptions,
  initialQuestion,
} from 'app/routes/surveys/components/SurveyEditor/utils';
import styles from 'app/routes/surveys/components/surveys.module.css';
import { spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';
import type {
  FormSurvey,
  FormSubmitSurvey,
  DetailedSurvey,
} from 'app/store/models/Survey';
import type { FormSurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { FieldArrayRenderProps } from 'react-final-form-arrays';

const TypedLegoForm = LegoFinalForm<FormSurvey>;

const validate = createValidator(
  {
    title: [required()],
  },
  hasOptions,
);

type Props = {
  isNew?: boolean;
  onSubmit: (surveyData: FormSubmitSurvey) => Promise<void>;
  initialValues: Partial<FormSurvey>;
  templateTitle: string | undefined;
  setTemplateTitle: (TemplateTitle: string) => void;
  templates: DetailedSurvey[];
};

const SurveyForm = ({
  isNew,
  onSubmit,
  initialValues,
  templateTitle,
  setTemplateTitle,
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

          {templateTitle && (
            <div className={styles.templateType}>
              <span>
                Bruker mal: <i>{templateTitle}</i>
              </span>
            </div>
          )}
          <Field
            name="isTemplate"
            id="isTemplate"
            label="Lagre som mal"
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
                    {templateTitle ? 'Bytt mal' : 'Bruk mal'}
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
                  setTemplateTitle={setTemplateTitle}
                  templates={templates}
                />
              </Dropdown>
            </div>
          )}
          {spyValues((values: FormSurvey) =>
            // If this is a template
            values.isTemplate ? (
              <h2>Dette er malen {templateTitle}</h2>
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
          <SubmitButton allowPristine={isNew && !!templateTitle}>
            {isNew ? 'Opprett' : 'Lagre'}
          </SubmitButton>
        </Form>
      )}
    </TypedLegoForm>
  );
};

type TemplateTypeDropdownItemsProps = {
  setTemplateTitle: (templateTitle: string) => void;
  templates: DetailedSurvey[];
};
const TemplateTypeDropdownItems = ({
  setTemplateTitle,
  templates,
}: TemplateTypeDropdownItemsProps) => {
  return (
    <Dropdown.List>
      {templates.map((template) => {
        return (
          <Dropdown.ListItem key={template.id}>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTemplateTitle(template.title);
              }}
            >
              {template.title}
            </Link>
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
