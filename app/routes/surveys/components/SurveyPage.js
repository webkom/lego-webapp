// @flow

import React, { Component } from 'react';
import SurveyList from './SurveyList';
import styles from './surveys.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { SurveyEntity } from 'app/reducers/surveys';
import { ListNavigation } from '../utils.js';
import TextInput from 'app/components/Form/TextInput';
import Content from 'app/components/Layout/Content';

type Props = {
  surveys: Array<SurveyEntity>,
  fetching: boolean,
  addSurvey: SurveyEntity => Promise<*>,
  deleteSurvey: number => Promise<*>,
  push: string => void
};

type State = {
  searchQuery: string
};

export default class SurveyPage extends Component<Props, State> {
  state = {
    filters: {},
    searchQuery: ''
  };

  surveySearch = (surveys: Array<Object>) =>
    surveys.filter(survey =>
      survey.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    );

  filterSurveys = (surveys: Array<Object>) =>
    this.state.searchQuery !== '' ? this.surveySearch(surveys) : surveys;

  updateSearchQuery = (event: Object) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
  };

  render() {
    const { surveys, fetching, push } = this.props;

    if (!surveys) {
      return <LoadingIndicator loading />;
    }

    const filteredSurveys = this.filterSurveys(surveys);

    const searchKeyPress = (event: Object) => {
      if (event.key === 'Enter' && filteredSurveys.length === 1) {
        push(`/surveys/${filteredSurveys[0].id}`);
      }
    };
    return (
      <Content>
        <ListNavigation title="Spørreundersøkelser" />

        <div className={styles.search}>
          <h2>Søk</h2>
          <TextInput
            onChange={this.updateSearchQuery}
            onKeyPress={searchKeyPress}
          />
        </div>

        <SurveyList surveys={filteredSurveys} fetching={fetching} />
      </Content>
    );
  }
}
