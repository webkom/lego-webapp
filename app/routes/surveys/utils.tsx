import { Icon } from '@webkom/lego-bricks';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import config from 'app/config';
import { SurveyQuestionType } from 'app/store/models/SurveyQuestion';
import styles from './components/surveys.module.css';
import type { EntityId } from '@reduxjs/toolkit';

export const questionTypeString: Record<SurveyQuestionType, string> = {
  single_choice: 'Enkeltvalg',
  multiple_choice: 'Avkrysningsbokser',
  text_field: 'Fritekst',
};
export const questionTypeOptions = Object.values(SurveyQuestionType).map(
  (questionType) => ({
    value: questionType,
    label: questionTypeString[questionType],
  }),
);
export const SurveyDetailTabs = ({ surveyId }: { surveyId?: EntityId }) =>
  surveyId && (
    <>
      <NavigationTab href={`/surveys/${surveyId}`}>Undersøkelsen</NavigationTab>
      <NavigationTab href={`/surveys/${surveyId}/submissions/summary`}>
        Resultater
      </NavigationTab>
      <NavigationTab href={`/surveys/${surveyId}/submissions/individual`}>
        Individuelle svar
      </NavigationTab>
    </>
  );

export const getCsvUrl = (surveyId: EntityId) =>
  `${config.serverUrl}/surveys/${surveyId}/csv/`;
export const QuestionTypeOption = ({ iconName, option, ...props }: any) => (
  <div
    style={{
      backgroundColor: props.isSelected
        ? 'var(--color-gray-2)'
        : props.isFocused
          ? 'var(--additive-background)'
          : 'var(--lego-card-color)',
    }}
    className={styles.dropdownOption}
    onMouseDown={(event) => {
      props.onSelect && props.onSelect(option, event);
    }}
    onMouseEnter={(event) => props.onFocus && props.onFocus(option, event)}
    onMouseMove={(event) => {
      if (props.isFocused) return;
      props.onFocus && props.onFocus(option, event);
    }}
    ref={props.innerRef}
    {...props.innerProps}
  >
    <span>
      <Icon name={iconName} />
      {props.children}
    </span>
  </div>
);
export const QuestionTypeValue = ({ iconName, ...props }) => (
  <div
    className={styles.dropdownSelected}
    onMouseDown={(event) => {
      props.onSelect && props.onSelect(props.option, event);
    }}
    onMouseEnter={(event) =>
      props.onFocus && props.onFocus(props.option, event)
    }
    onMouseMove={(event) => {
      if (props.isFocused) return;
      props.onFocus && props.onFocus(props.option, event);
    }}
    ref={props.innerRef}
    {...props.innerProps}
  >
    <Icon name={iconName} />
    {props.children}
  </div>
);
