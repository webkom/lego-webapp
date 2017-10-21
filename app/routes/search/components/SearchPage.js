// @flow

import React, { Component } from 'react';
import Icon from 'app/components/Icon';
import EmptyState from 'app/components/EmptyState';
import { Content } from 'app/components/Layout';
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

  onQueryChanged = (query: string) => {
    this.setState({ query });
    this.props.onQueryChanged(query);
  };

  render() {
    const { searching, results } = this.props;

    return (
      <Content>
        <div className={styles.inputContainer}>
          <div className={styles.searchIcon}>
            <Icon name="search" />
          </div>

          <input
            placeholder="Hva leter du etter?"
            autoFocus
            onChange={e => this.onQueryChanged(e.target.value)}
            value={this.state.query}
          />

          {searching && <i className="fa fa-spinner fa-spin" />}
        </div>
        <div className={styles.searchResults}>
          {results.length === 0 ? (
            <EmptyState icon="glasses-outline">
              <h1>
                Søket
                <em style={{ fontWeight: 100 }}>{this.state.query}</em> matchet
                ingen objekter.
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
