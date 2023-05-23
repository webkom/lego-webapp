import { Link } from 'react-router-dom';
import EmptyState from 'app/components/EmptyState';
import Icon from 'app/components/Icon';
import { ProfilePicture, Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import type { SearchResult as SearchResultType } from 'app/reducers/search';
import { isUserResult } from 'app/reducers/search';
import truncateString from 'app/utils/truncateString';
import styles from './SearchPageResults.css';
import type { KeyboardEventHandler } from 'react';

type Props = {
  query: string;
  results: Array<SearchResultType>;
  onSelect: (arg0: SearchResultType) => void;
  onKeyDown: KeyboardEventHandler;
  selectedIndex: number;
};
type SearchResultProps = {
  result: SearchResultType;
  onSelect: (arg0: SearchResultType) => void;
  isSelected: boolean;
};

function SearchResult({ result, onSelect, isSelected }: SearchResultProps) {
  return (
    <Flex
      wrap
      style={{
        backgroundColor: isSelected && 'rgba(255, 0, 0, 0.15)',
        borderColor: result.color,
      }}
      className={styles.searchResult}
    >
      <Flex column className={styles.textbox}>
        <Link
          onClick={(e) => {
            e.preventDefault();
            onSelect(result);
          }}
          to={result.link}
        >
          <h3 className={styles.searchResultTitle}>
            <span>
              {result.label}
              {isUserResult(result) && <span>({result.username})</span>}
            </span>

            {isUserResult(result) ? (
              <ProfilePicture
                className={styles.searchResultItemIcon}
                size={24}
                user={result}
              />
            ) : (
              <Icon
                name={result.icon}
                className={styles.searchResultItemIcon}
              />
            )}
          </h3>
        </Link>
        <div>
          {result.content && (
            <div>
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
        {query ? (
          <span>
            Fant ingen treff på søket <em>{query}</em>
          </span>
        ) : (
          <span>Søk i vei!</span>
        )}
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
