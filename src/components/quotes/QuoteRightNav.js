import React, { Component, PropTypes } from 'react';

export default class QuoteRightNav extends Component {

  static propTypes = {
    routeParams: PropTypes.object.isRequired
  };

  render() {
    const path = this.props.routeParams.filter;
    return (
      <div className='content-right'>
        <a
          href={ path === 'unapproved' ?
          '/quotes' : '/quotes?filter=unapproved'}
        >
          {path === 'unapproved' ? 'Godkjente sitater' : 'Ikke godkjente sitater'}
        </a>
        <br />
        <a href='/quotes/add'>Legg til nytt sitat!</a>
      </div>
    );
  }
}
