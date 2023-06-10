import cx from 'classnames';
import { Link } from 'react-router-dom';
import ResolveLink from 'app/components/ResolveLink';
import Time from 'app/components/Time';
import type { SearchResult } from 'app/reducers/search';
import { isUserResult } from 'app/reducers/search';
import Icon from '../Icon';
import { ProfilePicture } from '../Image';
import styles from './Search.module.css';
import type { NavigationLink } from './utils';

type SearchResultItemProps = {
  result: SearchResult;
  isSelected: boolean;
  onCloseSearch: () => void;
};

type SearchResultProps = {
  query: string;
  searching: boolean;
  results: SearchResult[];
  navigationLinks: NavigationLink[];
  adminLinks: NavigationLink[];
  onCloseSearch: () => void;
  selectedIndex: number;
};

const SearchResultItem = ({
  result,
  isSelected,
  onCloseSearch,
}: SearchResultItemProps) => (
  <Link to={result.link} onClick={onCloseSearch}>
    <li className={cx(isSelected && styles.isSelected, styles.resultItem)}>
      {isUserResult(result) && (
        <ProfilePicture
          size={28}
          user={result}
          style={{
            margin: '0px 12px 0px 0px',
          }}
        />
      )}
      {!isUserResult(result) && result.icon && (
        <Icon
          name={result.icon}
          size={28}
          className={styles.searchResultItemIcon}
        />
      )}
      <ul>
        <li className={styles.resultTitle}>
          <div className={styles.truncateTitle}>{result.title}</div>
        </li>
        <li className={styles.resultDetails}>
          {result.type && (
            <div className={styles.resultType}>{result.type} </div>
          )}
          {result.date && (
            <Time
              time={result.date}
              wordsAgo
              className={styles.resultDateMobile}
            />
          )}
        </li>
      </ul>
      {result.date && (
        <Time time={result.date} wordsAgo className={styles.resultDate} />
      )}
    </li>
  </Link>
);

const SearchResults = ({
  query,
  results,
  navigationLinks,
  adminLinks,
  onCloseSearch,
  searching,
  selectedIndex,
}: SearchResultProps) => (
  <div className={styles.resultsContainer}>
    <div>
      <div className={styles.scrollAble}>
        {query && (
          <ul className={styles.results}>
            {searching ? (
              <p>
                <i className="fa fa-spinner fa-spin" /> Søker ...
              </p>
            ) : (
              <div>
                {results.map((result, i) => (
                  <SearchResultItem
                    key={result.id}
                    result={result}
                    onCloseSearch={onCloseSearch}
                    isSelected={i === selectedIndex - 1}
                  />
                ))}
                {results.length === 0 ? (
                  <li>Ingen treff, trykk enter for fullstendig søk</li>
                ) : (
                  <li>Trykk enter for fullstendig søk</li>
                )}
              </div>
            )}
          </ul>
        )}
        <div className={styles.quickLinks}>
          <h2 className={styles.navigationHeader}>Sider</h2>
          <ul className={styles.navigationFlex}>
            {navigationLinks.map((link, i) => (
              <li
                className={styles.navigationLink}
                key={`navigationLink-${i}`}
                onClick={onCloseSearch}
              >
                <ResolveLink link={link} />
              </li>
            ))}
          </ul>
          {adminLinks.length > 0 && (
            <h2 className={styles.navigationHeader}>Admin</h2>
          )}
          <ul className={styles.navigationFlex}>
            {adminLinks.map((link, i) => (
              <li
                className={styles.navigationLink}
                key={`adminLink-${i}`}
                onClick={onCloseSearch}
              >
                <ResolveLink link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default SearchResults;
