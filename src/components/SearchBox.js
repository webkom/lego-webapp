import React from 'react';
import debounce from 'lodash/function/debounce';

const ESCAPE_KEY = 27;
const UP_KEY = 38;
const DOWN_KEY = 40;

var SearchBox = React.createClass({

  getInitialState() {
    return {
      results: [],
      closed: true,
      query: ''
    };
  },

  _onChange() {
  },

  _onInput(e) {
    var query = this.refs.query.getDOMNode().value;
    this.setState({query: query});
    this.search();
  },

  search: debounce(function() {
    SearchActions.search(this.state.query);
  }, 300),

  _onKeyDown(e) {
    switch (e.keyCode) {
      case ESCAPE_KEY:
        this.close();
        break;

      case UP_KEY:
      case DOWN_KEY:
        e.preventDefault();
        break;
    }
  },

  _closeOnEscape(e) {
    if (this.state.closed) return;
    if (e.keyCode === ESCAPE_KEY) this.close();
  },

  close() {
    this.setState({query: ''});
    SearchActions.clear();
  },

  render() {
    var results = this.state.results;
    return (
      <div className='search-container'>
        <p className='search'><input ref='query'
          onChange={this._onInput}
          onKeyDown={this._onKeyDown}
          value={this.state.query}
          placeholder='Søk' /></p>

        <ul className={'search-results' + (results.length === 0 ? ' hidden' : '')}>
          {results.map(function(result, i) {
            return <li key={'search-result-' + i}>{result}</li>;
          })}
        </ul>
      </div>
    );
  }
});

export default SearchBox;
