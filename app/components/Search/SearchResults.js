import React from 'react';
import styles from './Search.css';
import cx from 'classnames';
import { Link } from 'react-router';
import ProfilePicture from '../ProfilePicture';
import Icon from '../Icon';
import ResolveLink from 'app/components/ResolveLink';

const SearchResultItem = ({ result, isSelected, onCloseSearch }: Object) =>
  <Link to={result.link} onClick={onCloseSearch}>
    <li className={cx(isSelected && styles.isSelected)}>
      {result.icon &&
        <Icon className={styles.searchResultItemIcon} name={result.icon} />}
      {!result.icon &&
        <ProfilePicture
          size={30}
          user={result}
          style={{ margin: '0px 10px 0px 0px' }}
        />}
      {result.label}
    </li>
  </Link>;

const SearchResults = ({
  query,
  results,
  navigationLinks,
  adminLinks,
  onCloseSearch,
  selectedIndex
}: Object) =>
  <div className={styles.resultsContainer}>
    {query &&
      <ul className={styles.results}>
        {results.length === 0 && <li>Ingen treff</li>}
        {results.map((result, i) =>
          <SearchResultItem
            key={i}
            result={result}
            onCloseSearch={onCloseSearch}
            isSelected={i === selectedIndex - 1}
          />
        )}
      </ul>}
    <div className={styles.quickLinks}>
      <h2 className={styles.navigationHeader}>Sider</h2>
      <ul className={styles.navigationFlex}>
        {navigationLinks.map((link, i) =>
          <li
            className={styles.navigationLink}
            key={`navigationLink-${i}`}
            onClick={onCloseSearch}
          >
            <ResolveLink link={link} />
          </li>
        )}
      </ul>
      {adminLinks.length > 0 &&
        <h2 className={styles.navigationHeader}>Admin</h2>}
      <ul className={styles.navigationFlex}>
        {adminLinks.map((link, i) =>
          <li
            className={styles.navigationLink}
            key={`adminLink-${i}`}
            onClick={onCloseSearch}
          >
            <ResolveLink link={link} />
          </li>
        )}
      </ul>
    </div>
  </div>;

export default SearchResults;
