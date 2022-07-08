// @flow

import { Component } from 'react';

import type { ActionGrant, ID } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { QuoteEntity } from 'app/reducers/quotes';
import Quote from './Quote';

type Props = {
  quotes: Array<QuoteEntity>,
  approve: (number) => Promise<*>,
  deleteQuote: (number) => Promise<*>,
  unapprove: (number) => Promise<*>,
  actionGrant: ActionGrant,
  currentUser: any,
  loggedIn: boolean,
  reactions: Object,
  addReaction: ({
    emoji: string,
    contentTarget: string,
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  fetchEmojis: () => Promise<*>,
  fetchingEmojis: boolean,
  emojis: Array<EmojiEntity>,
};

type State = {
  displayAdminId: number,
};

export default class QuoteList extends Component<Props, State> {
  state = {
    displayAdminId: -1,
  };

  // eslint-disable-next-line
  componentWillReceiveProps(newProps: Object) {
    this.setState({ displayAdminId: -1 });
  }

  setDisplayAdmin = (id: number) => {
    this.setState((state) => ({
      displayAdminId: state.displayAdminId === id ? -1 : id,
    }));
  };

  render() {
    const {
      quotes,
      actionGrant,
      approve,
      unapprove,
      deleteQuote,
      currentUser,
      loggedIn,
      reactions,
      addReaction,
      deleteReaction,
      emojis,
      fetchEmojis,
      fetchingEmojis,
    } = this.props;

    return (
      <ul>
        {quotes.filter(Boolean).map((quote) => (
          <Quote
            actionGrant={actionGrant}
            approve={approve}
            unapprove={unapprove}
            deleteQuote={deleteQuote}
            quote={quote}
            key={quote.id}
            setDisplayAdmin={this.setDisplayAdmin}
            displayAdmin={quote.id === this.state.displayAdminId}
            currentUser={currentUser}
            loggedIn={loggedIn}
            reactions={reactions}
            addReaction={addReaction}
            deleteReaction={deleteReaction}
            emojis={emojis}
            fetchEmojis={fetchEmojis}
            fetchingEmojis={fetchingEmojis}
          />
        ))}
      </ul>
    );
  }
}
