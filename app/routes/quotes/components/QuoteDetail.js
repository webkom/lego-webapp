import React, { Component } from 'react';
import styles from './Quotes.css';
import Quote from './Quote';
import CommentView from 'app/components/Comments/CommentView';
import QuoteRightNav from './QuoteRightNav';
import cx from 'classnames';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { isEmpty } from 'lodash';

type Props = {
  quote: Object,
  comments?: Array<Object>,
  currentUser: any,
  loggedIn: boolean,
  query: Object,
  actionGrant: Array<string>
};

export default class QuoteDetail extends Component {
  props: Props;

  state = {
    displayAdmin: false
  };

  setDisplayAdmin = () => {
    this.setState(state => ({ displayAdmin: !state.displayAdmin }));
  };

  render() {
    const {
      quote,
      comments,
      currentUser,
      loggedIn,
      query,
      actionGrant
    } = this.props;

    if (isEmpty(quote)) {
      return <LoadingIndicator loading />;
    }
    return (
      <div
        className={cx(
          styles.root,
          styles.quoteContainer,
          styles.quoteSingleroute
        )}
      >
        <div className={styles.quotepageLeft}>
          <h1>Enkelt sitat</h1>

          <Quote
            {...this.props}
            quote={quote}
            actionGrant={actionGrant}
            displayAdmin={this.state.displayAdmin}
            setDisplayAdmin={this.setDisplayAdmin}
          />

          {quote.commentTarget && (
            <CommentView
              user={currentUser}
              commentTarget={quote.commentTarget}
              loggedIn={loggedIn}
              comments={comments}
            />
          )}
        </div>

        <QuoteRightNav query={query} detail={true} actionGrant={actionGrant} />
      </div>
    );
  }
}
