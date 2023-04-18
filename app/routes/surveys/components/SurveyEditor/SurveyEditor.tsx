import arrayMutators from 'final-form-arrays';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import Dropdown from 'app/components/Dropdown';
import { TextInput, SelectInput, DatePicker } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import Time from 'app/components/Time';
import type { EventType } from 'app/models';
import type { SurveyEntity } from 'app/reducers/surveys';
import { eventTypeToString, EVENT_CONSTANTS } from 'app/routes/events/utils';
import {
  DetailNavigation,
  ListNavigation,
  QuestionTypes,
} from 'app/routes/surveys/utils';
import { spySubmittable } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';
import styles from '../surveys.css';
import Question from './Question';
import type { ReactNode } from 'react';

type Props = {
  survey: SurveyEntity;
  autoFocus: Record<string, any>;
  surveyData: Array<Record<string, any>>;
  submitFunction: (arg0: any) => Promise<void>;
  push: (arg0: string) => void;
  template?: Record<string, any>;
  selectedTemplateType?: EventType;
  destroy: () => void;
  initialize: () => void;
  activeFrom: string;
  initialValues: Record<string, any>;
};
type TemplateTypeDropdownItemsProps = {
  survey?: Record<string, any>;
  push: (arg0: string) => void;
  destroy: () => void;
};

function TemplateTypeDropdownItems({
  survey,
  push,
  destroy,
}: TemplateTypeDropdownItemsProps) {
  const link = (eventType) =>
    survey?.id
      ? `/surveys/${survey.id}/edit/?templateType=${eventType}`
      : `/surveys/add/?templateType=${eventType}`;

  return (
    <Dropdown.List>
      {Object.keys(EVENT_CONSTANTS).map((eventType: EventType) => (
        <Dropdown.ListItem key={eventType}>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              destroy();
              push(link(eventType));
            }}
          >
            {eventTypeToString(eventType)}
          </Link>
        </Dropdown.ListItem>
      ))}
    </Dropdown.List>
  );
}

export const initialQuestion = {
  questionText: '',
  questionType: QuestionTypes('single'),
  mandatory: false,
  options: [
    {
      optionText: '',
      relativeIndex: {
        value: 0,
        label: 0,
      },
    },
  ],
};

export const hasOptions = (data: Record<string, any>) => {
  const message = {};
  message.questions = [];
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

const renderQuestions = ({
  fields,
  meta: { touched, error },
}: any): ReactNode => {
  return (
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
        <span>{error}</span>
      </ul>

      <Link
        key="addNew"
        to="#"
        onClick={() => {
          const newQuestion = initialQuestion;
          fields.push(newQuestion);
        }}
      >
        <Icon name="add-circle" size={30} className={styles.addQuestion} />
      </Link>
    </>
  );
};

const validate = createValidator(
  {
    title: [required()],
    event: [required()],
  },
  hasOptions
);

const SurveyEditor = ({
  survey,
  autoFocus,
  template,
  push,
  destroy,
  activeFrom,
  selectedTemplateType,
  submitFunction,
  initialValues,
}: Props) => {
  const [isTemplatePickerOpen, setTemplatePickerOpen] = useState(false);

  const onSubmit = (formContent: Record<string, any>) => {
    // Remove options if it's a free text question, and remove all empty options
    // options
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

  const editing = !!survey.id;

  return (
    <Content className={styles.detail}>
      <Helmet title={editing ? survey.title : 'Ny spørreundersøkelse'} />

      <LegoFinalForm
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
            {editing ? (
              <DetailNavigation
                title={titleField}
                surveyId={Number(survey.id)}
              />
            ) : (
              <ListNavigation title={titleField} />
            )}

            <ConfirmModalWithParent
              title="Bekreft bruk av mal"
              message={
                'Dette vil slette alle ulagrede endringer i undersøkelsen!\n' +
                'Lagrede endringer vil ikke overskrives før du trykker "Lagre".'
              }
              closeOnConfirm
              onCancel={() => {
                return Promise.all([setTemplatePickerOpen(false)]);
              }}
              onConfirm={() => {
                return Promise.all([setTemplatePickerOpen(true)]);
              }}
            >
              <Button className={styles.templatePicker}>
                {template ? 'Bytt mal' : 'Bruk mal'}
                <Dropdown
                  className={styles.templateDropdown}
                  show={isTemplatePickerOpen}
                  toggle={() => setTemplatePickerOpen(!isTemplatePickerOpen)}
                  closeOnContentClick
                >
                  <TemplateTypeDropdownItems
                    survey={survey}
                    push={push}
                    destroy={destroy}
                  />
                </Dropdown>
              </Button>
            </ConfirmModalWithParent>

            {selectedTemplateType && (
              <div className={styles.templateType}>
                <span>
                  Mal i bruk: <i>{EVENT_CONSTANTS[selectedTemplateType]}</i>
                </span>
              </div>
            )}

            {survey.templateType ? (
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
              {spySubmittable((submittable) => (
                <Button success disabled={submitting || !submittable} submit>
                  {editing ? 'Lagre' : 'Opprett'}
                </Button>
              ))}

              <Button
                onClick={() =>
                  push(editing ? `/surveys/${survey.id}` : '/surveys')
                }
              >
                Avbryt
              </Button>
            </Flex>
          </form>
        )}
      </LegoFinalForm>

      <i className={styles.mailInfo}>
        Deltagerene på arrangementet vil få mail med link til
        spørreundersøkelsen når den aktiveres (
        <Time time={activeFrom} format="HH:mm DD. MMM" />
        ).
      </i>
    </Content>
  );
};

export default SurveyEditor;
