// @flow

import React, { Component } from 'react';
import Quote from './Quote';

type Props = {
  quotes: Array<Object>,
  approve: number => void,
  deleteQuote: number => void,
  unapprove: number => void,
  actionGrant: Array<string>
};

export default class QuoteList extends Component {
  props: Props;

  state = {
    displayAdminId: -1
  };

  componentWillReceiveProps(newProps: Object) {
    this.setState({ displayAdminId: -1 });
  }

  setDisplayAdmin = (id: number) => {
    this.setState(state => ({
      displayAdminId: state.displayAdminId === id ? -1 : id
    }));
  };

  render() {
    const { quotes, actionGrant, approve, unapprove, deleteQuote } = this.props;
    return (
      <ul>
        {quotes.map(quote => (
          <Quote
            actionGrant={actionGrant}
            approve={approve}
            unapprove={unapprove}
            deleteQuote={deleteQuote}
            quote={quote}
            key={quote.id}
            setDisplayAdmin={this.setDisplayAdmin}
            displayAdmin={quote.id === this.state.displayAdminId}
          />
        ))}
      </ul>
    );
  }
}
