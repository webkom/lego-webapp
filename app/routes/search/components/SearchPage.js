// @flow

import React, { Component } from 'react';
import EmptyState from 'app/components/EmptyState';
import { Content } from 'app/components/Content';
import SearchPageInput from 'app/components/Search/SearchPageInput';
import SearchResultComponent from './SearchResult';
import styles from './SearchPage.css';
import type { SearchResult } from 'app/reducers/search';

type Props = {
  searching: boolean,
  location: Object,
  onQueryChanged: string => void,
  results: Array<SearchResult>
};

type State = {
  query: string
};

class SearchPage extends Component<Props, State> {
  state: State = {
    query: this.props.location.query.q || ''
  };

  handleQueryChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
    const query = target.value;
    this.setState({ query });
    this.props.onQueryChanged(query);
  };

  render() {
    const { searching, results } = this.props;

    return (
      <Content>
        <SearchPageInput
          isSearching={searching}
          value={this.state.query}
          onChange={this.handleQueryChange}
        />
        <div className={styles.searchResults}>
          {results.length === 0 ? (
            <EmptyState icon="glasses-outline">
              <h1>
                Fant ingen treff på søket{' '}
                <em style={{ fontWeight: 100 }}>{this.state.query}</em>.
              </h1>
            </EmptyState>
          ) : (
            results.map((result, id) => (
              <SearchResultComponent key={id} result={result} />
            ))
          )}
        </div>
      </Content>
    );
  }
}

export default SearchPage;
