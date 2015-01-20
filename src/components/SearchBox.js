'use strict';

var React = require('react');
var debounce = require('debounce');
var SearchActionCreators = require('../actions/SearchActionCreators');
var SearchStore = require('../stores/SearchStore');

var ESCAPE_KEY = 27;
var UP_KEY = 38;
var DOWN_KEY = 40;

var SearchBox = React.createClass({

  getInitialState: function() {
    return {
      results: SearchStore.getResults(),
      closed: SearchStore.isClosed(),
      query: ''
    };
  },

  componentDidMount: function() {
    SearchStore.addChangeListener(this._onChange);
    window.addEventListener('keydown', this._closeOnEscape);
  },

  componentWillUnmount: function() {
    SearchStore.removeChangeListener(this._onChange);
    window.removeEventListener('keydown', this._closeOnEscape);
  },

  _onChange: function() {
    this.setState({
      results: SearchStore.getResults(),
      closed: SearchStore.isClosed()
    });
  },

  _onInput: function(e) {
    var query = this.refs.query.getDOMNode().value;
    this.setState({query: query});
    this.search();
  },

  search: debounce(function() {
    SearchActionCreators.search(this.state.query);
  }, 300),

  _onKeyDown: function(e) {
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

  _closeOnEscape: function(e) {
    if (this.state.closed) return;
    (e.keyCode === ESCAPE_KEY) && this.close();
  },

  close: function() {
    this.setState({query: ''});
    SearchActionCreators.clear();
  },

  render: function() {
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

module.exports = SearchBox;
