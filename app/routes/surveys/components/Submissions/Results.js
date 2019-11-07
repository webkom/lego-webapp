// @flow

import React from 'react';
import styles from '../surveys.css';
import type { SurveyEntity, QuestionEntity } from 'app/reducers/surveys';
import { SelectInput, legoForm } from 'app/components/Form';
import { Field, FieldArray } from 'redux-form';

import { mappings, QuestionTypes, CHART_COLORS } from '../../utils';
import InfoBubble from 'app/components/InfoBubble';
import { VictoryPie, VictoryTheme } from 'victory';
import { createValidator, required } from 'app/utils/validation';
import cx from 'classnames';
import Icon from 'app/components/Icon';

type Props = {
  survey: SurveyEntity,
  graphData: Object,
  numberOfSubmissions: number,
  generateTextAnswers: QuestionEntity => any
};

type EventDataProps = {
  info: Array<Info>
};

type Info = {
  icon: string,
  data: number,
  meta: string
};

const questionTypeToIcon = {
  single_choice: 'radio-button-on',
  multiple_choice: 'checkbox',
  text_field: 'more'
};

const QuestionTypeOption = (props: Object) => (
  <div
    className={cx(props.className, styles.dropdown)}
    onMouseDown={event => {
      props.onSelect && props.onSelect(props.option, event);
    }}
    onMouseEnter={event => props.onFocus && props.onFocus(props.option, event)}
    onMouseMove={event => {
      if (props.isFocused) return;
      props.onFocus && props.onFocus(props.option, event);
    }}
  >
    <span className={styles.dropdownColor}>
      <Icon
        name={questionTypeToIcon[props.option && props.option.value]}
        style={{ marginRight: '15px' }}
      />
      {props.children}
    </span>
  </div>
);

const renderQuestionsWithChartType = ({ fields, meta: { touched, error } }) => {
  console.log('renderQuestionsWithChartType');
  return [
    fields.map((question, i) => {
      return (
        // Should render the questions here, see existing code on master branch
        <li key={question.id}>
          <h3>{question.questionText}</h3>
        </li>
      );
    })
  ];
};

const EventData = ({ info }: EventDataProps) => {
  return info.map((dataPoint, i) => (
    <InfoBubble
      key={i}
      icon={dataPoint.icon}
      data={String(dataPoint.data)}
      meta={dataPoint.meta}
      style={{ order: i }}
    />
  ));
};

const Results = ({
  graphData,
  generateTextAnswers,
  survey,
  numberOfSubmissions
}: Props) => {
  const info = [
    {
      icon: 'person',
      data: survey.event.registrationCount,
      meta: 'Påmeldte'
    },
    {
      icon: 'checkmark',
      data: survey.event.attendedCount,
      meta: 'Møtte opp'
    },
    {
      icon: 'list',
      data: survey.event.waitingRegistrationCount,
      meta: 'På venteliste'
    },
    {
      icon: 'chatboxes',
      data: numberOfSubmissions,
      meta: 'Har svart'
    }
  ];

  return (
    <div>
      <form>
        <div className={styles.eventSummary}>
          <h3>Arrangementet</h3>
          <div className={styles.infoBubbles}>
            <EventData info={info} />
          </div>
        </div>
        <ul className={styles.summary} />
        <FieldArray
          name="question"
          component={renderQuestionsWithChartType}
          rerenderOnEveryChange={true}
        />
      </form>
    </div>
  );
};

const validate = createValidator({
  title: [required()],
  event: [required()]
});

const onSubmit = (formContent: Object, dispatch, props: Props) => {
  console.log(props);
};

export default legoForm({
  form: 'surveyEditor',
  validate,
  onSubmit
})(Results);
