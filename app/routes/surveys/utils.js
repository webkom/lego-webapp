// @flow

import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import moment from 'moment-timezone';
import styles from './components/surveys.css';

const questionStrings = {
  single: 'single_choice',
  multiple: 'multiple_choice',
  text: 'text_field'
};

export const QuestionTypes = (choice: string) => {
  return questionStrings[choice] || questionStrings[0];
};

export const PresentableQuestionType = (choice: string) => {
  const questionTypeToString = {
    single_choice: 'Multiple Choice',
    multiple_choice: 'Sjekkboks',
    text_field: 'Fritekst'
  };
  return questionTypeToString[choice] || questionTypeToString[0];
};
export const mappings = Object.keys(questionStrings).map(key => ({
  value: questionStrings[key],
  label: PresentableQuestionType(questionStrings[key])
}));

export const ListNavigation = ({ title }: { title: Node }) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to="/surveys/add">Ny undersøkelse</NavigationLink>
    <NavigationLink to="/surveys/templates">Maler</NavigationLink>
  </NavigationTab>
);

export const DetailNavigation = ({
  title,
  surveyId,
  deleteFunction
}: {
  title: Node,
  surveyId: number,
  deleteFunction: number => Promise<*>
}) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}`}>Undersøkelsen</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
      Resultater
    </NavigationLink>
  </NavigationTab>
);

export const defaultActiveFrom = (hours: number, minutes: number) =>
  moment()
    .startOf('day')
    .add({ hours, minutes })
    .toISOString();

export const CHART_COLORS = [
  '#c0392b',
  '#2b95d6',
  '#d9822b',
  '#3dcc91',
  '#48aff0',
  '#f55656'
];
