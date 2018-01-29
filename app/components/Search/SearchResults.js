// @flow

import React from 'react';
import styles from './Search.css';
import cx from 'classnames';
import { Link } from 'react-router';
import { ProfilePicture } from '../Image';
import Icon from '../Icon';
import ResolveLink from 'app/components/ResolveLink';
import Time from 'app/components/Time';

type SearchResultItemProps = {
  result: Object,
  isSelected: boolean,
  onCloseSearch: () => void
};

const SearchResultItem = ({
  result,
  isSelected,
  onCloseSearch
}: SearchResultItemProps) => (
  <Link to={result.link} onClick={onCloseSearch}>
    <li className={cx(isSelected && styles.isSelected, styles.resultItem)}>
      {result.profilePicture && (
        <ProfilePicture
          size={30}
          user={result}
          style={{ margin: '0px 10px 0px 0px' }}
        />
      )}
      {!result.profilePicture &&
        result.icon && (
          <Icon className={styles.searchResultItemIcon} name={result.icon} />
        )}
      <ul>
        <li>{result.label}</li>
        {result.type && <li className={styles.resultType}>{result.type}</li>}
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
  selectedIndex
}: Object) => (
  <div className={styles.resultsContainer}>
    <div>
      <div className={styles.scrollAble}>
        {query && (
          <ul className={styles.results}>
            {searching ? (
              <p>
                <i className="fa fa-spinner fa-spin" /> Søker...
              </p>
            ) : (
              <div>
                {results.length === 0 && <li>Ingen treff</li>}
                {results.map((result, i) => (
                  <SearchResultItem
                    key={i}
                    result={result}
                    onCloseSearch={onCloseSearch}
                    isSelected={i === selectedIndex - 1}
                  />
                ))}
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
