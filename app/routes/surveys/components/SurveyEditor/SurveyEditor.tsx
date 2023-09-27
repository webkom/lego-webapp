import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import arrayMutators from 'final-form-arrays';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import Dropdown from 'app/components/Dropdown';
import { DatePicker, SelectInput, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import Time from 'app/components/Time';
import type { EventType } from 'app/models';
import { EVENT_CONSTANTS, eventTypeToString } from 'app/routes/events/utils';
import {
  DetailNavigation,
  ListNavigation,
  QuestionTypes,
} from 'app/routes/surveys/utils';
import { useAppSelector } from 'app/store/hooks';
import type {
  CreateSurvey,
  DetailedSurvey,
  FormSurvey,
} from 'app/store/models/Survey';
import type { FormSurveyQuestion } from 'app/store/models/SurveyQuestion';
import { SurveyQuestionDisplayType } from 'app/store/models/SurveyQuestion';
import { spySubmittable, spyValues } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';
import styles from '../surveys.css';
import Question from './Question';
import {
  useCurrentSurvey,
  useInitialValues,
  usePreparedFetchEditSurveyData,
  useSurveyEvent,
  useSurveyTemplate,
} from './utils';
import type { History } from 'history';

type Props = {
  survey: DetailedSurvey;
  autoFocus: Record<string, any>;
  surveyData: Array<Record<string, any>>;
  submitFunction: (surveyData: CreateSurvey) => Promise<void>;
  push: History['push'];
  template?: DetailedSurvey;
  initialize: () => void;
  activeFrom: string;
  initialValues: FormSurvey;
};

type TemplateTypeDropdownItemsProps = {
  survey?: DetailedSurvey;
  push: History['push'];
};

function TemplateTypeDropdownItems({
  survey,
  push,
}: TemplateTypeDropdownItemsProps) {
  const link = (eventType) =>
    survey?.id
      ? `/surveys/${survey.id}/edit/?templateType=${eventType}`
      : `/surveys/add/?templateType=${eventType}`;

  return (
    <Dropdown.List>
      {(Object.keys(EVENT_CONSTANTS) as (keyof typeof EVENT_CONSTANTS)[]).map(
        (eventType: EventType) => (
          <Dropdown.ListItem key={eventType}>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                push(link(eventType));
              }}
            >
              {eventTypeToString(eventType)}
            </Link>
          </Dropdown.ListItem>
        )
      )}
    </Dropdown.List>
  );
}

export const initialQuestion: FormSurveyQuestion = {
  questionText: '',
  questionType: { value: QuestionTypes('single'), label: 'Enkeltvalg' },
  displayType: SurveyQuestionDisplayType.PieChart,
  mandatory: false,
  options: [
    {
      optionText: '',
      relativeIndex: 0,
    },
  ],
  relativeIndex: 0,
};

type QuestionsValidationErrors = {
  questions: {
    questionText: string[];
  }[];
};

export const hasOptions = (
  data: Record<string, any>
): QuestionsValidationErrors => {
  const message: QuestionsValidationErrors = {
    questions: [],
  };
  data.questions?.forEach((element, i) => {
    if (!['multiple_choice', 'single_choice'].includes(element.questionType))
      return;

    if (element.options.length < 2) {
      message.questions[i] = {
        questionText: ['Spørsmål må ha minst ett svaralternativ'],
      };
    }
  });
  return message;
};
const updateRelativeIndexes = (oldIndex, newIndex, fields) => {
  fields.move(oldIndex, newIndex);
};

const renderQuestions = ({ fields }) => (
  <>
    <ul className={styles.questions} key="questions">
      {fields.map((question, i) => (
        <Question
          key={i}
          numberOfQuestions={fields.length}
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

const validate = createValidator(
  {
    title: [required()],
    event: [required()],
  },
  hasOptions
);

const TypedLegoForm = LegoFinalForm<FormSurvey>;

export type Params = {
  surveyId?: string;
};

const SurveyEditor = ({
  autoFocus,
  push,
  activeFrom,
  submitFunction,
}: Props) => {
  usePreparedFetchEditSurveyData();
  const fetching = useAppSelector(
    (state) => state.surveys.fetching || state.events.fetching
  );

  const survey = useCurrentSurvey();
  const isNew = survey === undefined;
  const event = useSurveyEvent(survey);
  const { template, templateType } = useSurveyTemplate(isNew, event);
  const initialValues = useInitialValues(fetching, isNew, event, template);

  const [isTemplatePickerOpen, setTemplatePickerOpen] = useState(false);

  const onSubmit = (formContent: FormSurvey) => {
    // Remove options if it's a free text question, and remove all empty options
    const cleanQuestions = formContent.questions.map((q, i) => {
      const question = {
        ...q,
        questionType: q.questionType?.value,
        relativeIndex: i,
      };

      if (question.questionType === QuestionTypes('text')) {
        question.options = [];
      } else {
        question.options = question.options.filter(
          (option) => option.optionText !== ''
        );
      }

      return question;
    });
    return submitFunction({
      ...formContent,
      surveyId: survey?.id,
      title: formContent.title,
      event: formContent.event && Number(formContent.event.value),
      questions: cleanQuestions,
    }).then((result) => {
      const id = survey?.id ? survey.id : result.payload.result;
      push(`/surveys/${String(id)}`);
    });
  };

  const titleField = (
    <Field
      placeholder="Tittel"
      label=" "
      autoFocus={autoFocus}
      name="title"
      component={TextInput.Field}
      className={styles.editTitle}
    />
  );

  return (
    <Content>
      <Helmet title={isNew ? 'Ny spørreundersøkelse' : survey.title} />

      <LoadingIndicator loading={fetching}>
        <TypedLegoForm
          onSubmit={onSubmit}
          validate={validate}
          initialValues={initialValues}
          subscription={{}}
          mutators={{
            ...arrayMutators,
          }}
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              {spyValues((values) => (
                <pre>{JSON.stringify(values, undefined, 2)}</pre>
              ))}
              {isNew ? (
                <ListNavigation title={titleField} />
              ) : (
                <DetailNavigation
                  title={titleField}
                  surveyId={Number(survey.id)}
                />
              )}

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
                  <Button
                    onClick={openConfirmModal}
                    className={styles.templatePicker}
                  >
                    {template ? 'Bytt mal' : 'Bruk mal'}
                    <Dropdown
                      className={styles.templateDropdown}
                      show={isTemplatePickerOpen}
                      toggle={() => setTemplatePickerOpen(false)}
                      closeOnContentClick
                    >
                      <TemplateTypeDropdownItems survey={survey} push={push} />
                    </Dropdown>
                  </Button>
                )}
              </ConfirmModal>

              {templateType && (
                <div className={styles.templateType}>
                  <span>
                    Mal i bruk: <i>{EVENT_CONSTANTS[templateType]}</i>
                  </span>
                </div>
              )}

              {survey?.templateType ? (
                <h2
                  style={{
                    color: 'var(--lego-color-red)',
                  }}
                >
                  Dette er malen for arrangementer av type{' '}
                  {eventTypeToString(survey.templateType)}
                </h2>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Field
                    placeholder="Velg arrangement"
                    label="Arrangement"
                    autoFocus={autoFocus}
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
                </div>
              )}
              <FieldArray
                name="questions"
                component={renderQuestions}
                rerenderOnEveryChange={true}
              />

              <Flex>
                <Button
                  flat
                  onClick={() =>
                    push(isNew ? '/surveys' : `/surveys/${survey.id}`)
                  }
                >
                  Avbryt
                </Button>

                {spySubmittable((submittable) => (
                  <Button disabled={submitting || !submittable} submit>
                    {isNew ? 'Opprett' : 'Lagre'}
                  </Button>
                ))}
              </Flex>
            </form>
          )}
        </TypedLegoForm>

        <Card severity="info">
          <span>
            Deltagerene på arrangementet vil få e-post med link til
            spørreundersøkelsen når den aktiveres (
            <Time time={activeFrom} format="HH:mm DD. MMM" />
            ). Legg merke til at kun deltagerene som har registrert oppmøte vil
            få e-post.{' '}
          </span>
        </Card>
      </LoadingIndicator>
    </Content>
  );
};

export default SurveyEditor;
