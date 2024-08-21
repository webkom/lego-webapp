import { Flex, Icon, Skeleton, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { FolderOpen, FolderSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from 'app/components/EmptyState';
import { ProfilePicture } from 'app/components/Image';
import { isUserResult } from 'app/reducers/search';
import { useAppSelector } from 'app/store/hooks';
import truncateString from 'app/utils/truncateString';
import styles from './SearchPageResults.css';
import type { SearchResult as SearchResultType } from 'app/reducers/search';
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

const SearchResult = ({ result, onSelect, isSelected }: SearchResultProps) => {
  if (!result.link) return;

  return (
    <Flex
      wrap
      style={{
        backgroundColor: isSelected ? 'var(--additive-background)' : undefined,
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
          <Flex
            alignItems="center"
            gap="var(--spacing-sm)"
            className={styles.searchResultTitle}
          >
            <h3>{result.label}</h3>

            {isUserResult(result) ? (
              <ProfilePicture size={24} user={result} />
            ) : (
              <Icon name={result.icon} />
            )}
          </Flex>
        </Link>
        {result.content && (
          <p>
            {truncateString(result.content.replace(/(<([^>]+)>)/gi, ''), 140)}
          </p>
        )}
      </Flex>

      {result.picture && result.picture !== 'cover' && (
        <Flex className={styles.picture}>
          <Image
            src={result.picture}
            alt={`Bilde fra ${result.label}`}
            role="presentation"
          />
        </Flex>
      )}
    </Flex>
  );
};

const SearchPageResults = ({
  onSelect,
  results,
  selectedIndex,
  query,
}: Props) => {
  const searching = useAppSelector((state) => state.search.searching);

  if (results.length === 0 && !searching) {
    return (
      <EmptyState
        iconNode={query ? <FolderOpen /> : <FolderSearch />}
        body={
          query ? (
            <span>
              Fant ingen treff på søket <em>{query}</em>
            </span>
          ) : (
            <span>Søk i vei!</span>
          )
        }
      />
    );
  }

  return (
    <Flex column gap="var(--spacing-md)">
      {results.length === 0 ? (
        <Skeleton
          array={6}
          className={cx(styles.searchResult, styles.skeleton)}
        />
      ) : (
        results.map((result, i) => (
          <SearchResult
            key={`${result.path}-${result.value}`}
            onSelect={onSelect}
            result={result}
            isSelected={selectedIndex === i}
          />
        ))
      )}
    </Flex>
  );
};

export default SearchPageResults;
