// @flow

import styles from './Quotes.css';
import Time from 'app/components/Time';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';
import CommentView from 'app/components/Comments/CommentView';
import type { ID, ActionGrant } from 'app/models';
import type { QuoteEntity } from 'app/reducers/quotes';
import Button from 'app/components/Button';

type Props = {
  quote: QuoteEntity,
  deleteQuote: number => Promise<*>,
  approve: number => Promise<*>,
  unapprove: number => Promise<*>,
  actionGrant: ActionGrant,
  setDisplayAdmin: number => void,
  displayAdmin: boolean,
  currentUser: any,
  loggedIn: boolean,
  comments: Object,
  deleteComment: (id: ID, contentTarget: string) => Promise<*>
};

type State = {
  deleting: boolean,
  showComments: boolean
};

export default class Quote extends Component<Props, State> {
  state = {
    deleting: false,
    showComments: true
  };

  render() {
    const {
      quote,
      deleteQuote,
      approve,
      unapprove,
      actionGrant,
      setDisplayAdmin,
      displayAdmin,
      currentUser,
      loggedIn,
      comments,
      deleteComment
    } = this.props;

    const { showComments } = this.state;

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
            <div className={styles.quoteDate}>
              {<Time time={quote.createdAt} wordsAgo />}
            </div>

            <div className={styles.bottomRight}>
              <div className={styles.commentCount}>
                <Button
                  flat
                  onClick={() =>
                    this.setState(state => ({
                      showComments: !state.showComments
                    }))
                  }
                >
                  <i
                    className="fa fa-comment-o"
                    style={{ marginRight: '5px' }}
                  />
                  {quote.comments ? quote.comments.length : quote.commentCount}
                </Button>
              </div>

              {actionGrant && actionGrant.includes('approve') && (
                <div className={styles.quoteAdmin}>
                  <Dropdown
                    show={displayAdmin}
                    toggle={() => setDisplayAdmin(quote.id)}
                    contentClassName="adminDropdown2"
                    triggerComponent={
                      <Icon
                        name="arrow-dropdown"
                        className={styles.dropdownIcon}
                      />
                    }
                  >
                    <Dropdown.List>
                      <Dropdown.ListItem>
                        <Button
                          flat
                          className="approveQuote"
                          onClick={() =>
                            quote.approved
                              ? unapprove(quote.id)
                              : approve(quote.id)
                          }
                        >
                          {quote.approved ? 'Fjern Godkjenning' : 'Godkjenn'}
                        </Button>
                      </Dropdown.ListItem>
                      <Dropdown.Divider />
                      {!this.state.deleting ? (
                        <Dropdown.ListItem>
                          <Button
                            flat
                            className={styles.deleteQuote}
                            onClick={e => {
                              if (e) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                              this.setState({ deleting: true });
                            }}
                          >
                            Slett
                          </Button>
                        </Dropdown.ListItem>
                      ) : (
                        <Dropdown.ListItem>
                          <Button
                            flat
                            className={styles.deleteQuote}
                            onClick={() => deleteQuote(quote.id)}
                            style={{ fontWeight: 600 }}
                          >
                            Er du sikker?
                          </Button>
                        </Dropdown.ListItem>
                      )}
                    </Dropdown.List>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </div>
        {quote.contentTarget && showComments && (
          <div className={styles.comments}>
            <CommentView
              user={currentUser}
              contentTarget={quote.contentTarget}
              loggedIn={loggedIn}
              comments={comments[quote.id]}
              displayTitle={false}
              deleteComment={deleteComment}
            />
          </div>
        )}
      </li>
    );
  }
}
