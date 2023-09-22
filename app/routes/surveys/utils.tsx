import cx from 'classnames';
import moment from 'moment-timezone';
import Icon from 'app/components/Icon';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import config from 'app/config';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import styles from './components/surveys.css';
import type { ReactNode } from 'react';

const questionStrings = {
  single: 'single_choice',
  multiple: 'multiple_choice',
  text: 'text_field',
};
export const QuestionTypes = (choice: string) => {
  return questionStrings[choice] || questionStrings[0];
};
export const PresentableQuestionType = (choice: string) => {
  const questionTypeToString = {
    single_choice: 'Enkeltvalg',
    multiple_choice: 'Avkrysningsbokser',
    text_field: 'Fritekst',
  };
  return questionTypeToString[choice] || questionTypeToString[0];
};
export const mappings = Object.keys(questionStrings).map((key) => ({
  value: questionStrings[key],
  label: PresentableQuestionType(questionStrings[key]),
})) as Array<{
  value: string;
  label: string;
}>;
export const ListNavigation = ({ title }: { title: ReactNode }) => (
  <NavigationTab title={title}>
    <NavigationLink to="/surveys">Undersøkelser</NavigationLink>
    <NavigationLink to="/surveys/add">Ny undersøkelse</NavigationLink>
    <NavigationLink to="/surveys/templates">Maler</NavigationLink>
  </NavigationTab>
);
export const DetailNavigation = ({
  title,
  surveyId,
}: {
  title: ReactNode;
  surveyId: number;
  actionGrant?: ActionGrant;
}) => (
  <NavigationTab
    title={title}
    back={{
      label: 'Tilbake til undersøkelser',
      path: '/surveys',
    }}
  >
    <NavigationLink to={`/surveys/${surveyId}`}>Undersøkelsen</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
      Resultater
    </NavigationLink>
  </NavigationTab>
);
export const TokenNavigation = ({
  title,
  surveyId,
  actionGrant = [],
}: {
  title: ReactNode;
  surveyId: number;
  actionGrant?: ActionGrant;
}) => (
  <NavigationTab title={title}>
    {actionGrant.includes('EDIT') && (
      <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
        Adminversjon
      </NavigationLink>
    )}
  </NavigationTab>
);
export const defaultActiveFrom = (hours: number, minutes: number) =>
  moment().startOf('day').add({ day: 1, hours, minutes }).toISOString();

export const getCsvUrl = (surveyId: ID) =>
  `${config.serverUrl}/surveys/${surveyId}/csv/`;
export const QuestionTypeOption = ({ iconName, option, ...props }: any) => (
  <div
    style={{
      cursor: 'pointer',
      backgroundColor: props.isSelected
        ? 'var(--color-gray-2)'
        : props.isFocused
        ? 'var(--additive-background)'
        : 'var(--lego-card-color)',
    }}
    className={cx(styles.dropdownOption, styles.dropdown)}
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
    <span className={styles.dropdownColor}>
      <Icon
        name={iconName}
        style={{
          marginRight: '15px',
        }}
      />
      {props.children}
    </span>
  </div>
);
export const QuestionTypeValue = ({ iconName, ...props }) => (
  <div
    className={cx(styles.dropdownSelected, styles.dropdown)}
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
    <span className={styles.dropdownColor}>
      <Icon
        name={iconName}
        style={{
          marginRight: '15px',
        }}
      />
      {props.children}
    </span>
  </div>
);
