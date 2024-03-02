import { Icon } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import config from 'app/config';
import { SurveyQuestionType } from 'app/store/models/SurveyQuestion';
import styles from './components/surveys.css';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type { ReactNode } from 'react';

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
  title: string;
  surveyId?: ID;
  actionGrant?: ActionGrant;
}) => (
  <NavigationTab
    title={title}
    back={{ label: 'Tilbake til undersøkelser', path: '/surveys' }}
  >
    <Helmet title={title} />
    {surveyId && (
      <>
        <NavigationLink to={`/surveys/${surveyId}`}>
          Undersøkelsen
        </NavigationLink>
        <NavigationLink
          to={`/surveys/${surveyId}/submissions/summary`}
          additionalActivePaths={[
            `/surveys/${surveyId}/submissions/individual`,
          ]}
        >
          Resultater
        </NavigationLink>
      </>
    )}
  </NavigationTab>
);
export const TokenNavigation = ({
  title,
  surveyId,
  actionGrant = [],
}: {
  title: ReactNode;
  surveyId: ID;
  actionGrant?: ActionGrant;
}) => (
  <NavigationTab title={title}>
    {actionGrant.includes('edit') && (
      <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
        Adminversjon
      </NavigationLink>
    )}
  </NavigationTab>
);

export const getCsvUrl = (surveyId: ID) =>
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
