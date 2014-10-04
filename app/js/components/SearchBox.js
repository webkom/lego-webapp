/** @jsx React.DOM */

var React = require('react');

/**
 * Hey, Google! Watch out! There's a new kid in town.
 */
function dummySearch(n) {
  var database = ["Hello World", "Awesome shit", "I like this baby", "Give me a Beer bitch"];
  var result = [], i = -1, m = Math.min(n, 5);
  while (++i < m) result.push(database[(Math.random()*database.length)|0]);
  return result;
}

var ESCAPE_KEY = 27;
var UP_KEY = 38;
var DOWN_KEY = 40;

var SearchBox = React.createClass({

  getInitialState: function() {
    return {
      results: []
    };
  },

  componentDidMount: function() {

  },

  componentWillUnmount: function() {

  },

  _onKeyDown: function(e) {
    switch (e.keyCode) {
      case ESCAPE_KEY:
        this.refs.query.getDOMNode().value = '';
        this.setState({results: []});
        break;

      case UP_KEY:
      case DOWN_KEY:
        break;

      default:
        var query = this.refs.query.getDOMNode().value.trim();
        this.setState({
          results: dummySearch(query.replace(/\s+/, '').length)
        });
    }
  },

  render: function() {
    var results = this.state.results;
    return (
      <div className='search-container'>
        <p className='search'><input ref='query'
          onKeyDown={this._onKeyDown}
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
