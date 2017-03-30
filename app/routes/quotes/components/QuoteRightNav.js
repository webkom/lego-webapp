import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Quotes.css';

type Props = {
  query: Object,
  detail: Boolean
};

export default class QuoteRightNav extends Component {
  props: Props;

  render() {
    const path = this.props.query.filter;
    const { detail } = this.props;
    return (
      <div
        className={styles.quotepageRight}
        style={{ marginTop: detail ? '50px' : '120px' }}
      >
        {!detail
          ? <Link
              to={
                path === 'unapproved' ? '/quotes' : '/quotes?filter=unapproved'
              }
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
}
