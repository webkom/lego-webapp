// @flow

import React, { Component } from 'react';
import SurveyList from './SurveyList';
import styles from './surveys.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { SurveyEntity } from 'app/reducers/surveys';
import { ListNavigation } from '../utils.js';
import TextInput from 'app/components/Form/TextInput';
import OptionsBox from './OptionsBox';

type Props = {
  surveys: Array<SurveyEntity>,
  fetching: boolean,
  addSurvey: SurveyEntity => Promise<*>,
  deleteSurvey: number => Promise<*>,
  push: string => void
};

type State = {
  filters: { [key: string]: Object },
  searchQuery: string
};

export default class SurveyPage extends Component<Props, State> {
  state = {
    filters: {},
    searchQuery: ''
  };

  updateFilters = (title: string, value: mixed) => {
    // For OptionsBox
    const filters = { ...this.state.filters, [title]: value };
    this.setState({ filters });
  };

  removeFilters = (title: string) => {
    // For OptionsBox
    const filters = { ...this.state.filters, [title]: undefined };
    this.setState({ filters });
  };

  surveySearch = (surveys: Array<Object>) =>
    surveys.filter(survey =>
      survey.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    );

  filterSurveys = (surveys: Array<Object>) => {
    if (this.state.searchQuery !== '') {
      surveys = this.surveySearch(surveys);
    }
    const { filters } = this.state;

    return surveys.filter(survey => {
      // Using 'for of' here. Probably a cleaner way to do it, but I couldn't think of one

      for (const key of Object.keys(filters)) {
        const filterShouldApply = filters[key] !== undefined;
        if (
          filterShouldApply &&
          (survey[key] === undefined || survey[key] === null)
        )
          return false;

        const shouldFilterById =
          filterShouldApply && survey[key].id && filters[key].id;
        const regularFilter = !shouldFilterById && survey[key] !== filters[key];
        const idFilter = shouldFilterById && survey[key].id !== filters[key].id;

        if (filterShouldApply && (regularFilter || idFilter)) {
          return false;
        }
      }
      return true;
    });
  };

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
      <div className={styles.root}>
        <ListNavigation title="Spørreundersøkelser" />

        <div className={styles.search}>
          <h2>Søk</h2>
          <TextInput
            onChange={this.updateSearchQuery}
            onKeyPress={searchKeyPress}
          />
        </div>

        <OptionsBox
          surveys={surveys}
          updateFilters={this.updateFilters}
          removeFilters={this.removeFilters}
          filters={this.state.filters}
        />

        <SurveyList surveys={filteredSurveys} fetching={fetching} />
      </div>
    );
  }
}
