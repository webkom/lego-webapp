import './Quotes.css';
import './QuoteSingle.css';
import './QuoteResponsive.css';
import ReadableDateTime from 'app/components/ReadableDateTime';
import React, { Component, PropTypes } from 'react';

export default class SingleQuote extends Component {
  static propTypes = {
    quote: PropTypes.object.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    unapprove: PropTypes.func.isRequired,
    deleter: PropTypes.func.isRequired
  };

  render() {
    const { quote, like, unlike, approve, unapprove, deleter } = this.props;

    return (
      <li className='single-quote'>
        <div className='left-quote'>
          <i className='fa fa-quote-right'></i>
          <h3 className='the-quote'>
            <a href={`/quotes/${quote.id}`}>{quote.text}</a>
          </h3>

        </div>

        <div className='right-quote'>
          <a
            data-quote-id={quote.id}
            className={`${quote.hasLiked ? 'quote-unlikes' : 'quote-likes'}`}
            onClick={() => {
              return quote.hasLiked ? unlike(quote.id) : like(quote.id);
            }}
          >
            <i
              className={(quote.hasLiked ?
                'fa fa-thumbs-up quote-liked' : 'fa fa-thumbs-up quote-default')}
            ></i>
          </a>
          <br />

          <span className='like-count'> {quote.likes}</span>
        </div>
        <div className='quote-bottom'>

          <span className='quote-source'>
            <i>-{quote.source}</i>
          </span>

          <div className='quote-date'>
            {<ReadableDateTime dateTime={this.props.quote.createdAt} />}
          </div>

          {quote.permissions && quote.permissions.indexOf('can_approve') !== -1 && (
          <div className='quote-admin'>
            <a
              data-quote-id={quote.id}
              className= 'approve-quote'
              onClick={() => (quote.approved ? unapprove(quote.id) :
                approve(quote.id))}
            > {(quote.approved ? 'Fjern Godkjenning' : 'Godkjenn')}</a>
            <a
              className='delete-quote'
              onClick = {() => deleter(quote.id)}
            >Slett</a>
          </div>
          )}
       </div>
      </li>
    );
  }
}
