import React from 'react';
import debounce from 'debounce';
import SearchActionCreators from '../actions/SearchActionCreators';
import SearchStore from '../stores/SearchStore';

const ESCAPE_KEY = 27;
const UP_KEY = 38;
const DOWN_KEY = 40;

var SearchBox = React.createClass({

  getInitialState() {
    return {
      results: SearchStore.getResults(),
      closed: SearchStore.isClosed(),
      query: ''
    };
  },

  componentDidMount() {
    SearchStore.addChangeListener(this._onChange);
    window.addEventListener('keydown', this._closeOnEscape);
  },

  componentWillUnmount() {
    SearchStore.removeChangeListener(this._onChange);
    window.removeEventListener('keydown', this._closeOnEscape);
  },

  _onChange() {
    this.setState({
      results: SearchStore.getResults(),
      closed: SearchStore.isClosed()
    });
  },

  _onInput(e) {
    var query = this.refs.query.getDOMNode().value;
    this.setState({query: query});
    this.search();
  },

  search: debounce(function() {
    SearchActionCreators.search(this.state.query);
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
    SearchActionCreators.clear();
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
