import React, { Component, PropTypes } from 'react';

const ESCAPE_KEY = 27;
const UP_KEY = 38;
const DOWN_KEY = 40;

export default class SearchBox extends Component {

  static propTypes = {
    search: PropTypes.object,
    clear: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired,
  };

  handleKeyDown(e) {
    switch (e.keyCode) {
    case ESCAPE_KEY:
      this.props.clear();
      break;

    case UP_KEY:
    case DOWN_KEY:
      e.preventDefault();
      break;
    }
  }

  handleChange(e) {
    const query = this.refs.query.value;
    this.props.performSearch(query);
  }

  render() {
    const { search: { results, query } } = this.props;

    return (
      <div className='SearchBox'>
        <div className='SearchBox-input'>
          <input ref='query'
            onChange={::this.handleChange}
            onKeyDown={::this.handleKeyDown}
            value={query}
            placeholder='Søk'
          />
        </div>

        <ul className={'SearchBox-results' + (results.length === 0 ? ' hidden' : '')}>
          {results.map((result, i) => <li key={i}>{result}</li>)}
        </ul>
      </div>
    );
  }
}
