// @flow

import React from 'react';
import { Link } from 'react-router';
import truncateString from 'app/utils/truncateString';
import styles from './SearchPage.css';
import Icon from 'app/components/Icon';
import { ProfilePicture } from 'app/components/Image';
import type { SearchResult } from 'app/reducers/search';

type Props = {
  result: SearchResult
};

const SearchResultComponent = ({ result }: Props) => (
  <div style={{ borderColor: result.color }} className={styles.searchResult}>
    <div>
      <Link to={result.link}>
        <h3 className={styles.searchResultTitle}>
          {result.label}
          {result.icon && (
            <Icon className={styles.searchResultItemIcon} name={result.icon} />
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

export default SearchResultComponent;
