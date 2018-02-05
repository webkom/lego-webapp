// @flow

import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

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

export const ListNavigation = ({ title }: { title: Node }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to="/surveys/add">Ny undersøkelse</NavigationLink>
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
  <NavigationTab title={title}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}`}>Undersøkelsen</NavigationLink>
    <NavigationLink to="/surveys/add">Ny</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}/edit`}>Endre</NavigationLink>
    <ConfirmModalWithParent
      title="Slett undersøkelse"
      message="Er du sikker på at du vil slette denne undersøkelseen?"
      onConfirm={() => deleteFunction(surveyId)}
    >
      <div>
        <NavigationLink to="">Slett</NavigationLink>
      </div>
    </ConfirmModalWithParent>
  </NavigationTab>
);
