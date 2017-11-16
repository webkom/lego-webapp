// @flow
import React from 'react';
import type { SearchResult as SearchResultType } from 'app/reducers/search';
import EmptyState from 'app/components/EmptyState';
import { Link } from 'react-router';
import { ProfilePicture } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import Icon from 'app/components/Icon';
import styles from './SearchPageResults.css';

type Props = {
  query: string,
  results: Array<SearchResultType>
};

function SearchResult({ result }: { result: SearchResultType }) {
  return (
    <div style={{ borderColor: result.color }} className={styles.searchResult}>
      <div>
        <Link to={result.link}>
          <h3 className={styles.searchResultTitle}>
            {result.label}
            {result.icon && (
              <Icon
                className={styles.searchResultItemIcon}
                name={result.icon}
              />
            )}
            {!result.icon && (
              <ProfilePicture
                size={20}
                user={result}
                style={{ margin: '0px 10px 0px 0px' }}
              />
            )}
          </h3>
        </Link>

        {result.content && (
          <div className={styles.content}>
            <span>
              {truncateString(result.content.replace(/(<([^>]+)>)/gi, ''), 250)}
            </span>
          </div>
        )}
      </div>

      {result.picture && (
        <div className={styles.picture}>
          <img src={result.picture} alt="search" role="presentation" />
        </div>
      )}
    </div>
  );
}

function SearchPageResults({ query, results }: Props) {
  if (results.length === 0) {
    return (
      <EmptyState icon="glasses-outline">
        <h1>
          Fant ingen treff på søket <em style={{ fontWeight: 100 }}>{query}</em>.
        </h1>
      </EmptyState>
    );
  }

  return (
    <div>
      {results.map(result => (
        <SearchResult key={`${result.path}-${result.value}`} result={result} />
      ))}
    </div>
  );
}

export default SearchPageResults;
