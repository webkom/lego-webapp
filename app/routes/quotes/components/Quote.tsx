import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';
import Reactions from 'app/components/Reactions';
import Reaction from 'app/components/Reactions/Reaction';
import Time from 'app/components/Time';
import type { ID, ActionGrant } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { QuoteEntity } from 'app/reducers/quotes';
import styles from './Quotes.css';

type Props = {
  quote: QuoteEntity;
  deleteQuote: (arg0: number) => Promise<any>;
  approve: (arg0: number) => Promise<any>;
  unapprove: (arg0: number) => Promise<any>;
  actionGrant: ActionGrant;
  setDisplayAdmin: (arg0: number) => void;
  displayAdmin: boolean;
  currentUser: any;
  loggedIn: boolean;
  addReaction: (arg0: { emoji: string; contentTarget: string }) => Promise<any>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<any>;
  fetchEmojis: () => Promise<any>;
  fetchingEmojis: boolean;
  emojis: Array<EmojiEntity>;
};
type State = {
  deleting: boolean;
  showReactions: boolean;
};
export default class Quote extends Component<Props, State> {
  state = {
    deleting: false,
    showReactions: true,
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
      emojis,
      addReaction,
      deleteReaction,
      fetchEmojis,
      fetchingEmojis,
      loggedIn,
    } = this.props;
    let mappedEmojis = [];

    if (!fetchingEmojis) {
      mappedEmojis = emojis.map((emoji) => {
        const foundReaction = quote.reactionsGrouped.find(
          (reaction) =>
            emoji.shortCode === reaction.emoji && reaction.hasReacted
        );

        if (foundReaction !== undefined) {
          emoji.hasReacted = true;
          emoji.reactionId = foundReaction.reactionId;
        } else {
          emoji.hasReacted = false;
          emoji.reactionId = -1;
        }

        return emoji;
      });
    }

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
              height: '0',
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
              <div className={styles.reactionCount}>
                <Button
                  flat
                  onClick={() =>
                    this.setState((state) => ({
                      showReactions: !state.showReactions,
                    }))
                  }
                >
                  <i
                    className="fa fa-reaction-o"
                    style={{
                      marginRight: '5px',
                    }}
                  />
                  {quote.reactions
                    ? quote.reactions.length
                    : quote.reactionCount}
                </Button>
              </div>

              {actionGrant && actionGrant.includes('approve') && (
                <div className={styles.quoteAdmin}>
                  <Dropdown
                    show={displayAdmin}
                    toggle={() => setDisplayAdmin(quote.id)}
                    closeOnContentClick
                    contentClassName="adminDropdown2"
                    triggerComponent={
                      <Icon
                        name="chevron-down-circle-outline"
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
                            onClick={(e) => {
                              if (e) {
                                e.preventDefault();
                                e.stopPropagation();
                              }

                              this.setState({
                                deleting: true,
                              });
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
                            style={{
                              fontWeight: 600,
                            }}
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
        <div className={styles.quoteReactions}>
          <Reactions
            emojis={mappedEmojis}
            fetchEmojis={fetchEmojis}
            fetchingEmojis={fetchingEmojis}
            addReaction={addReaction}
            deleteReaction={deleteReaction}
            contentTarget={quote.contentTarget}
            loggedIn={loggedIn}
          >
            {quote.reactionsGrouped.map((reaction) => {
              return (
                <Reaction
                  key={`reaction-${reaction.emoji}`}
                  emoji={reaction.emoji}
                  count={reaction.count}
                  unicodeString={reaction.unicodeString}
                  reactionId={reaction.reactionId}
                  hasReacted={reaction.hasReacted}
                  canReact={loggedIn}
                  addReaction={addReaction}
                  deleteReaction={deleteReaction}
                  contentTarget={quote.contentTarget}
                />
              );
            })}
          </Reactions>
        </div>
      </li>
    );
  }
}
