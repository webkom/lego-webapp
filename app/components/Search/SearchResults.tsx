import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Time from 'app/components/Time';
import { Image, ProfilePicture } from '../Image';
import styles from './Search.css';
import type { SearchResult } from 'app/reducers/search';

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
            alt={`${result.title}'s logo`}
            src={result.icon}
            style={{ width: '28px', display: 'block' }}
            className={styles.searchResultItemIcon}
          />
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
  <Link to={result.link} onClick={onCloseSearch}>
    <li className={cx(isSelected && styles.isSelected, styles.resultItem)}>
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
    </li>
  </Link>
);

const SearchResults = ({
  results,
  onCloseSearch,
  searching,
  selectedIndex,
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
        {results.length === 0 && 'Ingen treff. '}Trykk enter for fullstendig søk
      </p>
    </div>
  );
};

export default SearchResults;
