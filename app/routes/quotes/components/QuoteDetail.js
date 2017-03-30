import React from 'react';
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
  query: Object
};

export default function QuoteDetail(
  { quote, comments, currentUser, loggedIn, query, ...props }: Props
) {
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

      <QuoteRightNav query={query} detail={true} />

    </div>
  );
}
