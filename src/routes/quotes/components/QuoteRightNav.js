import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class QuoteRightNav extends Component {

  static propTypes = {
    query: PropTypes.object.isRequired
  };

  render() {
    const path = this.props.query.filter;
    return (
      <div className='quotepage-right'>
        <a
          href={path === 'unapproved' ?
          '/quotes' : '/quotes?filter=unapproved'}
        >
          {path === 'unapproved' ? 'Godkjente sitater' : 'Ikke godkjente sitater'}
        </a>
        <br />
        <Link to='/quotes/add'>Legg til nytt sitat!</Link>
      </div>
    );
  }
}
