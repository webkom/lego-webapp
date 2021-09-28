// @flow

import styles from '../surveys.css';
import type { Element } from 'react';
import { Component } from 'react';
import { DetailNavigation, ListNavigation, QuestionTypes } from '../../utils';
import Question from './Question';
import { Field, FieldArray } from 'redux-form';
import type { FieldArrayProps, FormProps } from 'redux-form';
import Button from 'app/components/Button';
import {
  TextInput,
  SelectInput,
  DatePicker,
  legoForm,
} from 'app/components/Form';
import { createValidator, required } from 'app/utils/validation';
import type { SurveyEntity } from 'app/reducers/surveys';
import { Content } from 'app/components/Content';

import Icon from 'app/components/Icon';
import { Link } from 'react-router-dom';
import Dropdown from 'app/components/Dropdown';
import { eventTypeToString, EVENT_CONSTANTS } from 'app/routes/events/utils';
import Time from 'app/components/Time';
import type { EventType } from 'app/models';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

type Props = FormProps & {
  survey: SurveyEntity,
  autoFocus: Object,
  surveyData: Array<Object>,
  submitFunction: (SurveyEntity, ?number) => Promise<*>,
  push: (string) => void,
  template?: Object,
  selectedTemplateType?: EventType,
  destroy: () => void,
  initialize: () => void,
  activeFrom: string,
};

type State = {
  templatePickerOpen: boolean,
  templateTypeSelected: string,
};

type TemplateTypeDropdownItemsProps = {
  survey?: Object,
  push: (string) => void,
  destroy: () => void,
};

function TemplateTypeDropdownItems({
  survey,
  push,
  destroy,
}: TemplateTypeDropdownItemsProps) {
  const link = (eventType) =>
    survey && survey.id
      ? `/surveys/${survey.id}/edit/?templateType=${eventType}`
      : `/surveys/add/?templateType=${eventType}`;

  return (
    <Dropdown.List>
      {Object.keys(EVENT_CONSTANTS).map((eventType) => (
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

class SurveyEditor extends Component<Props, State> {
  state = {
    templatePickerOpen: false,
    templateTypeSelected: '',
  };

  updateRelativeIndexes = (oldIndex, newIndex, fields) => {
    fields.move(oldIndex, newIndex);
  };

  renderQuestions = ({
    fields,
    meta: { touched, error },
  }: FieldArrayProps): Element<any> => {
    return (
      <>
        <ul className={styles.questions} key="questions">
          {fields.map((question, i) => (
            <Question
              key={i}
              numberOfQuestions={fields.length}
              question={question}
              questionData={fields.get(i)}
              deleteQuestion={() => Promise.resolve(fields.remove(i))}
              updateRelativeIndexes={this.updateRelativeIndexes}
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

  render() {
    const {
      survey,
      submitting,
      autoFocus,
      handleSubmit,
      template,
      push,
      destroy,
      activeFrom,
      selectedTemplateType,
    } = this.props;

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
      <Content className={styles.detail}>
        {survey && survey.id ? (
          <DetailNavigation title={titleField} surveyId={Number(survey.id)} />
        ) : (
          <ListNavigation title={titleField} />
        )}
        <ConfirmModalWithParent
          title="Bekreft bruk av mal"
          message={
            'Dette vil slette alle ulagrede endringer i undersøkelsen!\n' +
            'Lagrede endringer vil ikke overskrives før du trykker "Lagre".'
          }
          closeOnConfirm={true}
          onCancel={() => {
            this.setState((state) => ({
              templatePickerOpen: false,
            }));
            return Promise.resolve();
          }}
          onConfirm={() => {
            this.setState((state) => ({
              templatePickerOpen: true,
            }));
            return Promise.resolve();
          }}
        >
          <Button className={styles.templatePicker}>
            {template ? 'Bytt mal' : 'Bruk mal'}
            <Dropdown
              className={styles.templateDropdown}
              show={this.state.templatePickerOpen}
              toggle={() => {
                this.setState((state) => ({
                  templatePickerOpen: !state.templatePickerOpen,
                }));
              }}
            >
              <TemplateTypeDropdownItems
                survey={survey}
                push={push}
                destroy={destroy}
              />
            </Dropdown>
          </Button>
        </ConfirmModalWithParent>

        <form onSubmit={handleSubmit}>
          <div className={styles.templateType}>
            {selectedTemplateType && (
              <span>
                Mal i bruk: <i>{EVENT_CONSTANTS[selectedTemplateType]}</i>
              </span>
            )}
          </div>

          {survey.templateType ? (
            <h2 style={{ color: 'red' }}>
              Dette er malen for arrangementer av type{' '}
              {eventTypeToString(survey.templateType)}
            </h2>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            component={this.renderQuestions}
            rerenderOnEveryChange={true}
          />
          <div className={styles.clear} />
          <Button className={styles.submit} disabled={submitting} submit>
            Lagre
          </Button>
          <i className={styles.mailInfo}>
            Deltagerene på arrangementet vil få mail med link til
            spørreundersøkelsen når den aktiveres (
            <Time time={activeFrom} format="HH:mm DD. MMM" />
            ).
          </i>
        </form>
      </Content>
    );
  }
}

export const initialQuestion = {
  questionText: '',
  questionType: QuestionTypes('single'),
  mandatory: false,
  options: [
    {
      optionText: '',
      relativeIndex: { value: 0, label: 0 },
    },
  ],
};

export const hasOptions = (data: Object) => {
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

const validate = createValidator(
  {
    title: [required()],
    event: [required()],
  },
  hasOptions
);

const onSubmit = (formContent: Object, dispatch, props: Props) => {
  const { survey, submitFunction, push } = props;
  const { questions } = formContent;

  // Remove options if it's a free text question, and remove all empty
  // options
  const cleanQuestions = questions.map((q, i) => {
    const question = {
      ...q,
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
    event: formContent.event && Number(formContent.event.value),
    surveyId: survey && survey.id,
    questions: cleanQuestions,
  }).then((result) => {
    const id = survey && survey.id ? survey.id : result.payload.result;
    push(`/surveys/${String(id)}`);
  });
};

export default legoForm({
  form: 'surveyEditor',
  validate,
  onSubmit,
})(SurveyEditor);
