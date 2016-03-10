import React, { Component, PropTypes } from 'react';
import ReadableDateTime from '../../../shared/components/ui/ReadableDateTime.js';
import './QuoteSingleRoute.css';

export default class QuoteSingleRoute extends Component {

  state = {
    sortType: 'date'
  };

  static propTypes = {
    quotes: PropTypes.array.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    unapprove: PropTypes.func.isRequired,
    deleter: PropTypes.func.isRequired
  };

  setSortType = sortType => {
    this.setState({ sortType });
  };

  render() {
    const { like, unlike, approve, unapprove, deleter } = this.props;
    const quote = this.props.quotes[0];
    console.log(this.props);
    console.log(quote);

    function deleteIt(id) {
      // I tilfelle man skal legge til bekreftelse av sletting av quotes
      deleter(id);
    }
    if (!quote) {
      return null;
    }
    return (
      <div className='u-container quote-container'>
        <div className='quote-singleroute'>
          <h1>Enkelt sitat!</h1>
          <li className='enkel-quote'>
            <i className='fa fa-quote-right'></i>
            <div className='left-quote'>
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
                {<ReadableDateTime dateTime={quote.createdAt} />}
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
                  onClick = {() => deleteIt(quote.id)}
                >Slett</a>
              </div>
              )}
           </div>
          </li>

        </div>
      </div>
    );
  }
}
