import '../../styles/Quotes.css';
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

    function deleteIt(id) {
      // I tilfelle man skal legge til bekreftelse av sletting av quotes
      deleter(id);
    }

    return (
      <li className='enkelQuote'>
        <div className='leftQuote'>
          <h3 className='theQuote'>
            <a href={`/quotes/${quote.id}`}>{quote.text}</a>
          </h3>

          <div className='clear'></div>
        </div>

        <div className='rightQuote'>
          <a
            data-quote-id={quote.id}
            className={`likeFunc ${quote.hasLiked ? 'unlikes' : 'likes'}`}
            onClick={() => {
              return quote.hasLiked ? unlike(quote.id) : like(quote.id);
            }}
          >
            <i
              className={ (quote.hasLiked ? 'fa fa-thumbs-up liked' : 'fa fa-thumbs-up default')}
            ></i>
          </a>
          <br />

          <span className='likeCount'> {quote.likes}</span>
        </div>
        <div className='clear'> </div>
        <div className ='bottom'>

          <span className='source'>
            <i>-{quote.source}</i>
          </span>

          {quote.permissions && quote.permissions.indexOf('can_approve') !== -1 && (
          <div className='admin'>
            <a
              data-quote-id={quote.id}
              className= 'approve-it'
              onClick={() => (quote.approved ? unapprove(quote.id) :
                approve(quote.id))}
            > {(quote.approved ? 'Fjern Godkjenning' : 'Godkjenn')}</a>
            <a
              className='delete'
              onClick = { () => deleteIt(quote.id) }
            >Slett</a>
          </div>
          )}
       </div>
        <hr></hr>
      </li>
    );
  }
}
