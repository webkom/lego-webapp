
var React = require('react');
var SearchViewActionCreators = require('../actions/SearchViewActionCreators');
var SearchStore = require('../stores/SearchStore');

var ESCAPE_KEY = 27;
var UP_KEY = 38;
var DOWN_KEY = 40;

var debounce = require('debounce');

var SearchBox = React.createClass({

  getInitialState: function() {
    return {
      results: SearchStore.getResults(),
      query: ''
    };
  },

  componentDidMount: function() {
    SearchStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SearchStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      results: SearchStore.getResults()
    });
  },

  _onInput: function(e) {
    var query = this.refs.query.getDOMNode().value;
    this.setState({query: query});
    this.search();
  },

  search: debounce(function() {
    SearchViewActionCreators.search(this.state.query);
  }, 300),

  _onKeyDown: function(e) {
    switch (e.keyCode) {
      case ESCAPE_KEY:
        this.setState({query: ''});
        SearchViewActionCreators.clear();
        break;

      case UP_KEY:
      case DOWN_KEY:
        e.preventDefault();
        break;
    }
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
