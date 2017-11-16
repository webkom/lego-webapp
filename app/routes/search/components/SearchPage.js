// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import SearchPageInput from 'app/components/Search/SearchPageInput';
import SearchPageResults from 'app/components/Search/SearchPageResults';
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

        <SearchPageResults query={this.state.query} results={results} />
      </Content>
    );
  }
}

export default SearchPage;
