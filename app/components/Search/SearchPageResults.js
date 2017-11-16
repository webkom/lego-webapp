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
  results: Array<SearchResultType>,
  onSelect: SearchResultType => void,
  selectedIndex: number
};

type SearchResultProps = {
  result: SearchResultType,
  onSelect: SearchResultType => void,
  isSelected: boolean
};

function SearchResult({ result, onSelect, isSelected }: SearchResultProps) {
  return (
    <div
      style={{
        backgroundColor: isSelected && 'rgba(255, 0, 0, 0.15)',
        borderColor: result.color
      }}
      className={styles.searchResult}
    >
      <div>
        <Link
          onClick={e => {
            e.preventDefault();
            onSelect(result);
          }}
          to={result.link}
        >
          <h3 className={styles.searchResultTitle}>
            <span>
              {result.label}{' '}
              {typeof result.username === 'string' && (
                <span>({result.username})</span>
              )}
            </span>

            {result.profilePicture ? (
              <ProfilePicture
                className={styles.searchResultItemIcon}
                size={24}
                user={result}
              />
            ) : (
              <Icon
                className={styles.searchResultItemIcon}
                name={result.icon}
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

function SearchPageResults({ onSelect, results, selectedIndex, query }: Props) {
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
      {results.map((result, i) => (
        <SearchResult
          key={`${result.path}-${result.value}`}
          onSelect={onSelect}
          result={result}
          isSelected={selectedIndex === i}
        />
      ))}
    </div>
  );
}

export default SearchPageResults;
