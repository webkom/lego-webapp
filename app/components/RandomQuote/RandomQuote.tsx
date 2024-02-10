import { Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useRef, useEffect, useState } from 'react';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import LegoReactions from 'app/components/LegoReactions';
import { selectRandomQuote } from 'app/reducers/quotes';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import styles from './RandomQuote.css';
import type { ID } from 'app/store/models';
import type Quote from 'app/store/models/Quote';

type Props = {
  dummyQuote?: Quote;
  useReactions?: boolean;
};

const RandomQuote = ({ dummyQuote, useReactions = true }: Props) => {
  const seenQuotes = useRef<ID[]>([]);

  const [animation, setAnimation] = useState(false);

  const randomQuote = useAppSelector(selectRandomQuote) as Quote;
  const fetching = useAppSelector((state) => state.quotes.fetching);

  useEffect(() => {
    const quoteId = randomQuote.id;

    if (!quoteId) return;

    if (!seenQuotes.current.includes(quoteId)) {
      seenQuotes.current = [...seenQuotes.current, quoteId];
    }
  }, [randomQuote.id]);

  const dispatch = useAppDispatch();

  const onClick = () => {
    setAnimation(true);
    dispatch(fetchRandomQuote(seenQuotes.current));
    setTimeout(() => setAnimation(false), 1000);
  };

  return (
    <Card
      skeleton={fetching && (!randomQuote || !dummyQuote)}
      className={styles.randomQuote}
    >
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex column className={styles.content}>
          <div className={styles.quoteText}>
            {dummyQuote ? dummyQuote.text : randomQuote.text}
          </div>
          <div className={styles.quoteSource}>
            - {dummyQuote ? dummyQuote.source : randomQuote.source}
          </div>
        </Flex>

        <Flex column justifyContent="space-between" gap={5}>
          <Icon
            name="refresh"
            onClick={onClick}
            className={cx(animation && styles.rotateIcon)}
          />
          <Icon to="/quotes/add" name="add" />
        </Flex>
      </Flex>

      {useReactions && (
        <div className={styles.quoteReactions}>
          <LegoReactions parentEntity={randomQuote} />
        </div>
      )}
    </Card>
  );
};

export default guardLogin(RandomQuote);
