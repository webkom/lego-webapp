import { Card, Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import Dropdown from '~/components/Dropdown';
import Reactions from '~/components/Reactions';
import Reaction from '~/components/Reactions/Reaction';
import Time from '~/components/Time';
import { approve, deleteQuote, unapprove } from '~/redux/actions/QuoteActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectEmojis } from '~/redux/slices/emojis';
import styles from './Quotes.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type Emoji from '~/redux/models/Emoji';
import type QuoteType from '~/redux/models/Quote';

type Props = {
  quote: QuoteType;
  actionGrant: ActionGrant;
  toggleDisplayAdmin: () => void;
  displayAdmin: boolean;
};

const Quote = ({
  quote,
  actionGrant,
  toggleDisplayAdmin,
  displayAdmin,
}: Props) => {
  const emojis = useAppSelector(selectEmojis);
  const fetchingEmojis = useAppSelector((state) => state.emojis.fetching);

  const [deleting, setDeleting] = useState(false);
  const dispatch = useAppDispatch();

  const currentUser = useCurrentUser();

  let mappedEmojis: (Emoji & { hasReacted: boolean; reactionId: EntityId })[] =
    [];

  if (!fetchingEmojis) {
    mappedEmojis = emojis.map((emoji) => {
      const foundReaction = quote.reactionsGrouped.find(
        (reaction) => emoji.shortCode === reaction.emoji && reaction.hasReacted,
      );

      return foundReaction !== undefined
        ? {
            ...emoji,
            hasReacted: true,
            reactionId: foundReaction.reactionId,
          }
        : {
            ...emoji,
            hasReacted: false,
            reactionId: -1,
          };
    });
  }

  return (
    <Card>
      <Flex justifyContent="space-between">
        <a className={styles.quoteTitle} href={`/quotes/${quote.id}`}>
          {quote.text}
        </a>
        <div className={cx(styles.quoteDate, styles.largeViewportOnly)}>
          {<Time time={quote.createdAt} wordsAgo />}
        </div>
      </Flex>

      <i>- {quote.source}</i>

      <div className={cx(styles.quoteDate, styles.smallViewportOnly)}>
        {<Time time={quote.createdAt} wordsAgo />}
      </div>

      <Flex justifyContent={'space-between'} className={styles.bottomBar}>
        <Reactions emojis={mappedEmojis} contentTarget={quote.contentTarget}>
          {quote.reactionsGrouped.map((reaction) => (
            <Reaction
              key={`reaction-${reaction.emoji}`}
              reaction={reaction}
              contentTarget={quote.contentTarget}
            />
          ))}
        </Reactions>
        {actionGrant?.includes('approve') && (
          <div>
            <Dropdown
              show={displayAdmin}
              toggle={toggleDisplayAdmin}
              closeOnContentClick
              iconName="ellipsis-horizontal"
            >
              <Dropdown.List>
                {currentUser?.username !== quote.createdBy?.username && (
                  <Dropdown.ListItem>
                    <button
                      onClick={() =>
                        quote.approved
                          ? dispatch(unapprove(quote.id))
                          : dispatch(approve(quote.id))
                      }
                    >
                      {quote.approved ? 'Fjern godkjenning' : 'Godkjenn'}
                    </button>
                  </Dropdown.ListItem>
                )}

                {!deleting ? (
                  <Dropdown.ListItem danger>
                    <button
                      onClick={(e) => {
                        if (e) {
                          e.preventDefault();
                          e.stopPropagation();
                        }

                        setDeleting(!deleting);
                      }}
                    >
                      Slett
                    </button>
                  </Dropdown.ListItem>
                ) : (
                  <Dropdown.ListItem>
                    <button onClick={() => dispatch(deleteQuote(quote.id))}>
                      Er du sikker?
                    </button>
                  </Dropdown.ListItem>
                )}
              </Dropdown.List>
            </Dropdown>
          </div>
        )}
      </Flex>
    </Card>
  );
};

export default Quote;
