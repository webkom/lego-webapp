import styles from './Quotes.css';
import Time from 'app/components/Time';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';

type Props = {
  quote: Object,
  deleteQuote: () => void,
  approve: () => void,
  unapprove: () => void,
  actionGrant: Array<string>,
  setDisplayAdmin: () => void,
  displayAdmin: boolean
};

export default class Quote extends Component {
  props: Props;

  state = {
    deleting: false
  };

  render() {
    const {
      quote,
      deleteQuote,
      approve,
      unapprove,
      actionGrant,
      setDisplayAdmin,
      displayAdmin
    } = this.props;

    return (
      <li className={styles.singleQuote}>
        <div className={styles.leftQuote}>
          <i
            className="fa fa-quote-right"
            style={{
              fontSize: '100px',
              color: '#dbdbdb',
              marginRight: '30px',
              order: '0',
              height: '0'
            }}
          />
          <h3 className={styles.theQuote}>
            <Link to={`/quotes/${quote.id}`}>{quote.text}</Link>
          </h3>
        </div>

        <div className={styles.quoteBottom}>
          <span className={styles.quoteSource}>
            <i>- {quote.source}</i>
          </span>

          <div className={styles.bottomRow}>
            <div className={styles.quoteDate}>{<Time time={quote.createdAt} wordsAgo />}</div>

            <div className={styles.bottomRight}>
              <div className={styles.commentCount}>
                <Link to={`/quotes/${quote.id}`}>
                  <i className="fa fa-comment-o" />{' '}
                  {quote.comments ? quote.comments.length : quote.commentCount}
                </Link>
              </div>

              {actionGrant &&
                actionGrant.includes('approve') && (
                  <div className={styles.quoteAdmin}>
                    <Dropdown
                      show={displayAdmin}
                      toggle={() => setDisplayAdmin(quote.id)}
                      contentClassName={'adminDropdown2'}
                      triggerComponent={
                        <Icon name="arrow-dropdown" className={styles.dropdownIcon} />
                      }
                    >
                      <Dropdown.List>
                        <Dropdown.ListItem>
                          <a
                            className="approveQuote"
                            onClick={() =>
                              quote.approved ? unapprove(quote.id) : approve(quote.id)}
                          >
                            {' '}
                            {quote.approved ? 'Fjern Godkjenning' : 'Godkjenn'}
                          </a>
                        </Dropdown.ListItem>
                        <Dropdown.Divider />
                        {!this.state.deleting ? (
                          <Dropdown.ListItem>
                            <a
                              className={styles.deleteQuote}
                              onClick={() => this.setState({ deleting: true })}
                            >
                              Slett
                            </a>
                          </Dropdown.ListItem>
                        ) : (
                          <Dropdown.ListItem>
                            <a
                              className={styles.deleteQuote}
                              onClick={() => deleteQuote(quote.id)}
                              style={{ fontWeight: 600 }}
                            >
                              Er du sikker?
                            </a>
                          </Dropdown.ListItem>
                        )}
                      </Dropdown.List>
                    </Dropdown>
                  </div>
                )}
            </div>
          </div>
        </div>
      </li>
    );
  }
}
