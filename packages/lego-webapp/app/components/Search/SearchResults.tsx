import { Flex, Icon, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { ProfilePicture } from '../Image';
import styles from './Search.module.css';
import type { SearchResult } from '~/redux/slices/search';

type SearchResultItemProps = {
  result: SearchResult;
  isSelected: boolean;
  onCloseSearch: () => void;
};

type SearchResultProps = {
  searching: boolean;
  results: SearchResult[];
  onCloseSearch: () => void;
  selectedIndex: number;
  query: string;
};

const ResultIcon = ({ result }) => {
  switch (result.iconType) {
    case 'profilePic':
      return (
        <ProfilePicture
          size={28}
          user={result}
          className={styles.searchResultItemIcon}
        />
      );
    case 'image':
      if (result.icon) {
        return (
          <Image
            alt={`${result.title} sin logo`}
            src={result.icon}
            style={{ width: '28px', display: 'block' }}
            className={styles.searchResultItemIcon}
          />
        );
      } else {
        return (
          <Icon name="help" size={28} className={styles.searchResultItemIcon} />
        );
      }
    default:
    case 'icon':
      return (
        <Icon
          name={result.icon ?? 'help'}
          size={28}
          className={styles.searchResultItemIcon}
        />
      );
  }
};

export const SearchResultItem = ({
  result,
  isSelected,
  onCloseSearch,
}: SearchResultItemProps) => (
  <Link to={result.link ?? ''} onClick={onCloseSearch}>
    <Flex
      gap="var(--spacing-sm)"
      className={cx(isSelected && styles.isSelected, styles.resultItem)}
    >
      <ResultIcon result={result} />
      <div className={styles.resultTitle}>
        <p className={styles.truncateTitle}>{result.title}</p>
        <Flex className={styles.resultDetail}>
          {result.type && (
            <span className={styles.resultType}>{result.type}</span>
          )}
          {result.date && <Time time={result.date} wordsAgo />}
        </Flex>
      </div>
    </Flex>
  </Link>
);

const SearchResults = ({
  results,
  onCloseSearch,
  searching,
  selectedIndex,
  query,
}: SearchResultProps) => {
  if (searching) {
    return (
      <div className={styles.results}>
        <p className={styles.searchingText}>
          <i className="fa fa-spinner fa-spin" /> Søker ...
        </p>
      </div>
    );
  }
  return (
    <div className={styles.results}>
      <ul>
        {results
          .filter((r) => r.link)
          .map((result, i) => (
            <SearchResultItem
              key={i}
              result={result}
              onCloseSearch={onCloseSearch}
              isSelected={i === selectedIndex}
            />
          ))}
      </ul>
      <p className={styles.searchingText}>
        {results.length === 0
          ? `Ingen treff på "${query}", men trykk enter for avansert søk!`
          : 'Trykk enter for avansert søk'}
      </p>
    </div>
  );
};

export default SearchResults;
