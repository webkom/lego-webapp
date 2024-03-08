import { Button, Card, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Link } from 'react-router-dom';
import Dropdown from 'app/components/Dropdown';
import {
  DatePicker,
  LegoFinalForm,
  SelectInput,
  TextInput,
} from 'app/components/Form';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import Time from 'app/components/Time';
import {
  EventTypeConfig,
  displayNameForEventType,
} from 'app/routes/events/utils';
import Question from 'app/routes/surveys/components/SurveyEditor/Question';
import {
  hasOptions,
  initialQuestion,
} from 'app/routes/surveys/components/SurveyEditor/utils';
import styles from 'app/routes/surveys/components/surveys.css';
import { spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';
import type { EventType } from 'app/store/models/Event';
import type { FormSurvey, FormSubmitSurvey } from 'app/store/models/Survey';
import type { FormSurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { FieldArrayRenderProps } from 'react-final-form-arrays';

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
  templateType: EventType | undefined;
  setTemplateType: (templateType: EventType) => void;
};

const SurveyForm = ({
  isNew,
  onSubmit,
  initialValues,
  templateType,
  setTemplateType,
}: Props) => {
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const internalOnSubmit = (surveyData: FormSurvey) => {
    return onSubmit({
      ...surveyData,
      event: surveyData.event.value,
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
        <form onSubmit={handleSubmit}>
          <Field
            placeholder="Tittel"
            label=" "
            name="title"
            component={TextInput.Field}
            className={styles.editTitle}
          />
          {templateType && (
            <div className={styles.templateType}>
              <span>
                Bruker mal: <i>{displayNameForEventType(templateType)}</i>
              </span>
            </div>
          )}
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
                <Button onClick={openConfirmModal}>
                  {templateType ? 'Bytt mal' : 'Bruk mal'}
                </Button>
              )}
            </ConfirmModal>
            <Dropdown
              className={styles.templateDropdown}
              show={templatePickerOpen}
              toggle={() => setTemplatePickerOpen(false)}
              closeOnContentClick
            >
              <TemplateTypeDropdownItems setTemplateType={setTemplateType} />
            </Dropdown>
          </div>
          {spyValues((values: FormSurvey) =>
            // If this is a template
            values.templateType ? (
              <h2
                style={{
                  color: 'var(--lego-color-red)',
                }}
              >
                Dette er malen for arrangementer av type:{' '}
                {displayNameForEventType(values.templateType)}
              </h2>
            ) : (
              <Flex>
                <Field
                  placeholder="Velg arrangement"
                  label="Arrangement"
                  name="event"
                  component={SelectInput.AutocompleteField}
                  className={styles.editEvent}
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
          <SubmitButton allowPristine={isNew && !!templateType}>
            {isNew ? 'Opprett' : 'Lagre'}
          </SubmitButton>
        </form>
      )}
    </TypedLegoForm>
  );
};

type TemplateTypeDropdownItemsProps = {
  setTemplateType: (templateType: EventType) => void;
};
const TemplateTypeDropdownItems = ({
  setTemplateType,
}: TemplateTypeDropdownItemsProps) => {
  return (
    <Dropdown.List>
      {Object.entries(EventTypeConfig).map(([key, config]) => {
        const eventType = key as EventType;
        return (
          <Dropdown.ListItem key={eventType}>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTemplateType(eventType);
              }}
            >
              {config.displayName}
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
    <ul className={styles.questions} key="questions">
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
    </ul>

    <Icon
      name="add"
      size={30}
      onClick={() => {
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
