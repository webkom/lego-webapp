import React from 'react';
import { Link } from 'react-router';
import truncateString from 'app/utils/truncateString';
import styles from './SearchPage.css';

export default (props) => {
  const { result } = props;

  return (
    <div
      style={{ borderColor: result.color }}
      className={styles.searchResult}
    >
      <div>
        <Link to={result.link}>
          <h3 className={result.searchResultTitle}>
            {result.title}
          </h3>
        </Link>

        {result.content &&
          <div className={styles.content}>
            <span>{truncateString(result.content.replace(/(<([^>]+)>)/ig, ''), 250)}</span>
          </div>
        }

      </div>

      {result.picture &&
        <div className={styles.picture}>
          <img src={result.picture} role='presentation' />
        </div>
      }
    </div>
  );
};
