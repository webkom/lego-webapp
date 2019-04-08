// @flow
import React from 'react';
import type { SearchResult as SearchResultType } from 'app/reducers/search';
import EmptyState from 'app/components/EmptyState';
import { Link } from 'react-router-dom';
import { ProfilePicture } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import Icon from 'app/components/Icon';
import styles from './SearchPageResults.css';
import { Flex } from 'app/components/Layout';
import { Image } from 'app/components/Image';

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
    <Flex
      wrap
      style={{
        backgroundColor: isSelected && 'rgba(255, 0, 0, 0.15)',
        borderColor: result.color
      }}
      className={styles.searchResult}
    >
      <Flex column className={styles.textbox}>
        <Link
          onClick={e => {
            e.preventDefault();
            onSelect(result);
          }}
          to={result.link}
        >
          <h3 className={styles.searchResultTitle}>
            <span>
              {result.label} {/* $FlowFixMe*/}
              {typeof result.username === 'string' && (
                <span>({result.username})</span>
              )}
            </span>

            {/* $FlowFixMe*/}
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
        <div>
          {result.content && (
            <div className={styles.content}>
              <span>
                {truncateString(
                  result.content.replace(/(<([^>]+)>)/gi, ''),
                  250
                )}
              </span>
            </div>
          )}
        </div>
      </Flex>

      {result.picture && result.picture !== 'cover' && (
        <Flex className={styles.picture}>
          <Image src={result.picture} alt="search" role="presentation" />
        </Flex>
      )}
    </Flex>
  );
}

function SearchPageResults({ onSelect, results, selectedIndex, query }: Props) {
  if (results.length === 0) {
    return (
      <EmptyState icon="glasses-outline">
        <h1>
          {query ? (
            <span>
              Fant ingen treff på søket{' '}
              <em style={{ fontWeight: 100 }}>{query}</em>
            </span>
          ) : (
            <span>Søk i vei!</span>
          )}
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
