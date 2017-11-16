// @flow

import React, { Component } from 'react';
import SurveyList from './SurveyList';
import styles from './surveys.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import { ListNavigation } from '../utils.js';
import TextInput from 'app/components/Form/TextInput';
import { Content } from 'app/components/Content';
import { Flex } from 'app/components/Layout';

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
    searchQuery: ''
  };

  surveySearch = (surveys: Array<Object>) =>
    surveys.filter(
      survey =>
        survey.title
          .toLowerCase()
          .includes(this.state.searchQuery.toLowerCase()) ||
        survey.event.title
          .toLowerCase()
          .includes(this.state.searchQuery.toLowerCase())
    );

  filterSurveys = (surveys: Array<Object>) =>
    this.state.searchQuery !== '' ? this.surveySearch(surveys) : surveys;

  updateSearchQuery = (event: Object) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
  };

  render() {
    const { surveys, fetching, push } = this.props;

    const filteredSurveys = this.filterSurveys(surveys);

    const searchKeyPress = (event: Event) => {
      if (event.key === 'Enter' && filteredSurveys.length === 1) {
        push(`/surveys/${filteredSurveys[0].id}`);
      }
    };
    return (
      <Content>
        <ListNavigation title="Spørreundersøkelser" />

        <Flex className={styles.search}>
          <h2>Søk</h2>
          <TextInput
            onChange={this.updateSearchQuery}
            onKeyPress={searchKeyPress}
          />
        </Flex>

        <SurveyList surveys={filteredSurveys} fetching={fetching} />
      </Content>
    );
  }
}
