// @flow

import React, { Component } from 'react';
import SearchPageInput from 'app/components/Search/SearchPageInput';
import SearchPageResults from 'app/components/Search/SearchPageResults';
import { Keyboard } from 'app/utils/constants';
import type { SearchResult } from 'app/reducers/search';
import qs from 'qs';

type Props = {
  searching: boolean,
  location: Object,
  inputRef?: (?HTMLInputElement) => void,
  onQueryChanged: string => void,
  placeholder?: string,
  results: Array<SearchResult>,
  handleSelect: SearchResult => Promise<*>
};

type State = {
  query: string,
  selectedIndex: number
};

class SearchPage extends Component<Props, State> {
  state = {
    selectedIndex: 0,
    query:
      qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).q || ''
  };

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    // Make sure the selectedIndex is within 0 <= index < results.length:
    const selectedIndex = Math.min(
      this.state.selectedIndex,
      Math.max(nextProps.results.length - 1, 0)
    );

    this.setState({ selectedIndex });
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (this.props.results.length === 0) return;
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
        this.handleSelect(this.props.results[this.state.selectedIndex]);
        break;
    }
  };

  handleSelect = (result: SearchResult) => {
    this.setState({ query: '', selectedIndex: 0 });
    this.props.handleSelect(result);
  };

  handleQueryChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
    const query = target.value;
    this.setState({ query });
    this.props.onQueryChanged(query);
  };

  render() {
    const { inputRef, placeholder, searching, results } = this.props;

    return (
      <div>
        <SearchPageInput
          inputRef={inputRef}
          isSearching={searching}
          value={this.state.query}
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}
          onChange={this.handleQueryChange}
        />

        <SearchPageResults
          onKeyDown={this.handleKeyDown}
          onSelect={this.handleSelect}
          query={this.state.query}
          results={results.filter(({ link }) => link)}
          selectedIndex={this.state.selectedIndex}
        />
      </div>
    );
  }
}

export default SearchPage;
