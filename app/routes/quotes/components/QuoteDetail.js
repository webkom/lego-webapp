import React, { Component } from 'react';
import styles from './Quotes.css';
import Quote from './Quote';
import CommentView from 'app/components/Comments/CommentView';
import QuoteRightNav from './QuoteRightNav';
import cx from 'classnames';

type Props = {
  quote: Object,
  comments?: Array<Object>,
  currentUser: any,
  loggedIn: boolean,
  deleteQuote: () => void,
  approve: () => void,
  unapprove: () => void,
  query: Object
};

export default class QuoteDetail extends Component {
  props: Props;

  render() {
    const {
      quote,
      comments,
      currentUser,
      loggedIn
    } = this.props;

    if (!quote) {
      return null;
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

          <h1>Enkelt sitat!</h1>

          <Quote {...this.props} quote={quote} style={{}} />

          <CommentView
            formEnabled
            user={currentUser}
            commentTarget={quote.commentTarget}
            loggedIn={loggedIn}
            comments={comments}
          />

        </div>

        <QuoteRightNav query={this.props.query} detail={true} />

      </div>
    );
  }
}
