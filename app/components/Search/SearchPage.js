// @flow

import React, { Component } from 'react';
import SearchPageInput from 'app/components/Search/SearchPageInput';
import SearchPageResults from 'app/components/Search/SearchPageResults';
import { Keyboard } from 'app/utils/constants';
import type { SearchResult } from 'app/reducers/search';

type Props = {
  searching: boolean,
  location: Object,
  onQueryChanged: string => void,
  results: Array<SearchResult>,
  handleSelect: SearchResult => void
};

type State = {
  query: string,
  selectedIndex: number
};

class SearchPage extends Component<Props, State> {
  state: State = {
    selectedIndex: 0,
    query: this.props.location.query.q || ''
  };

  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.which) {
      case Keyboard.UP:
        e.preventDefault();
        this.setState({
          selectedIndex: Math.max(0, this.state.selectedIndex - 1)
        });
        break;

      case Keyboard.DOWN:
        e.preventDefault();
        this.setState({
          selectedIndex: Math.min(
            this.props.results.length - 1,
            this.state.selectedIndex + 1
          )
        });
        break;

      case Keyboard.ENTER:
        e.preventDefault();
        this.setState({ query: '' });
        this.props.handleSelect(this.props.results[this.state.selectedIndex]);
        break;
    }
  };

  handleQueryChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
    const query = target.value;
    this.setState({ query });
    this.props.onQueryChanged(query);
  };

  render() {
    const { handleSelect, searching, results } = this.props;

    return (
      <div>
        <SearchPageInput
          isSearching={searching}
          value={this.state.query}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleQueryChange}
        />

        <SearchPageResults
          onKeyDown={this.handleKeyDown}
          onSelect={handleSelect}
          query={this.state.query}
          results={results}
          selectedIndex={this.state.selectedIndex}
        />
      </div>
    );
  }
}

export default SearchPage;
