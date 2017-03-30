import React from 'react';
import { Link } from 'react-router';
import styles from './Quotes.css';

type Props = {
  query: Object,
  detail: Boolean
};

export default function QuoteRightNav({ query, detail, ...props }: Props) {
  const path = query.filter;
  return (
    <div
      className={styles.quotepageRight}
      style={{ marginTop: detail ? '50px' : '120px' }}
    >
      {!detail
        ? <Link
            to={path === 'unapproved' ? '/quotes' : '/quotes?filter=unapproved'}
          >
            {path === 'unapproved'
              ? 'Godkjente sitater'
              : 'Ikke godkjente sitater'}
          </Link>
        : <Link to="/quotes">
            <i className="fa fa-arrow-circle-left" /> Tilbake til sitater
          </Link>}
      <Link to="/quotes/add">Legg til nytt sitat!</Link>
    </div>
  );
}
