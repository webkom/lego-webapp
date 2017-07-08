import React, { Component } from 'react';
import Icon from 'app/components/Icon';
import SearchResult from './SearchResult';
import styles from './SearchPage.css';

class SearchPage extends Component {
  state: State = {
    query: this.props.query || ''
  };

  onQueryChanged = query => {
    this.setState({ query });
    this.props.onQueryChanged(query);
  };

  render() {
    const { searching, results } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.inputContainer}>
          <div className={styles.searchIcon}>
            <Icon name="search" />
          </div>

          <input
            type="search"
            placeholder="Hva leter du etter?"
            autoFocus
            onChange={e => this.onQueryChanged(e.target.value)}
            value={this.state.query}
          />

          {searching &&
            <div className={styles.loadingIcon}>
              <Icon name="spinner fa-spin" />
            </div>}
        </div>
        <div className={styles.searchResults}>
          {results.map((result, id) =>
            <SearchResult key={id} result={result} />
          )}
        </div>
      </div>
    );
  }
}

export default SearchPage;
