import styles from './Quotes.css';
import Time from 'app/components/Time';
import React, { Component, PropTypes } from 'react';

export default class SingleQuote extends Component {
  static propTypes = {
    quote: PropTypes.object.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    unapprove: PropTypes.func.isRequired,
    deleteQuote: PropTypes.func.isRequired
  };

  render() {
    const { quote, like, unlike, approve, unapprove, deleteQuote } = this.props;

    return (
      <li className={styles.singleQuote}>
        <div className={styles.leftQuote}>
          <i
            className='fa fa-quote-right'
            style={{
              fontSize: '100px',
              color: '#dbdbdb',
              marginRight: '30px',
              order: '0',
              height: '0'
            }}
          ></i>
          <h3 className={styles.theQuote}>
            <a href={`/quotes/${quote.id}`}>{quote.text}</a>
          </h3>

        </div>

        <div className={styles.rightQuote}>
          <a
            dataQuote-id={quote.id}
            className={`${quote.hasLiked ? 'quote-unlikes' : 'quote-likes'}`}
            onClick={() => quote.hasLiked ? unlike(quote.id) : like(quote.id)}
          >
            <i
              className={`fa fa-thumbs-up ${quote.hasLiked ? styles.quoteLiked :
                styles.quoteDefault}`}
              style={{ paddingTop: '5px', fontSize: '35px', order: '0' }}
            ></i>
          </a>
          <br />

          <span className={styles.likeCount}> {quote.likes}</span>
        </div>
        <div className={styles.quoteBottom}>

          <span className={styles.quoteSource}>
            <i>- {quote.source}</i>
          </span>

          <div className='quote-date'>
            {<Time time={quote.createdAt} wordsAgo />}
          </div>

          {quote.permissions && quote.permissions.indexOf('can_approve') !== -1 && (
          <div className={styles.quoteAdmin}>
            <a
              dataQuote-id={quote.id}
              className= 'approveQuote'
              onClick={() => (quote.approved ? unapprove(quote.id) :
                approve(quote.id))}
            > {(quote.approved ? 'Fjern Godkjenning' : 'Godkjenn')}</a>
            <a
              className={styles.deleteQuote}
              onClick = {() => deleteQuote(quote.id)}
            >Slett</a>
          </div>
          )}
       </div>
      </li>
    );
  }
}
