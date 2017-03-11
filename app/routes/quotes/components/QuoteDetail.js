import React, { Component, PropTypes } from 'react';
import styles from './QuoteDetail.css';
import Quote from './Quote';
import CommentView from 'app/components/Comments/CommentView';

type Props = {
  quote: Object,
  comments?: Array<Object>,
  currentUser: any,
  deleteQuote: () => void,
  approve: () => void,
  unapprove: () => void
};

export default class QuoteDetail extends Component {
  props: Props;

  render() {
    const { quote } = this.props;

    if (!quote) {
      return null;
    }
    return (
      <div className={styles.root}>
        <div className={styles.quoteSingleroute}>

          <h1>Enkelt sitat!</h1>

          <Quote {...this.props} quote={quote} />

          <CommentView
            formEnabled
            user={currentUser}
            commentTarget={quote.commentTarget}
            loggedIn={loggedIn}
            comments={comments}
          />
        </div>
      </div>
    );
  }
}
