import { Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Plus, RefreshCcw } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import LegoReactions from '~/components/LegoReactions';
import { fetchRandomQuote } from '~/redux/actions/QuoteActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectRandomQuote } from '~/redux/slices/quotes';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import styles from './RandomQuote.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type Quote from '~/redux/models/Quote';

type Props = {
  dummyQuote?: Quote;
  useReactions?: boolean;
};

const RandomQuote = ({ dummyQuote, useReactions = true }: Props) => {
  const seenQuotes = useRef<EntityId[]>([]);

  const [animation, setAnimation] = useState(false);

  const randomQuote = useAppSelector(selectRandomQuote);
  const fetching = useAppSelector((state) => state.quotes.fetching);

  useEffect(() => {
    const quoteId = randomQuote?.id;

    if (!quoteId) return;

    if (!seenQuotes.current.includes(quoteId)) {
      seenQuotes.current = [...seenQuotes.current, quoteId];
    }
  }, [randomQuote?.id]);

  const dispatch = useAppDispatch();

  const onPress = () => {
    setAnimation(true);
    dispatch(fetchRandomQuote(seenQuotes.current));
    setTimeout(() => setAnimation(false), 1000);
  };

  const quoteToShow = dummyQuote || randomQuote;

  return (
    <Card skeleton={fetching && !quoteToShow} className={styles.randomQuote}>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex column className={styles.content}>
          <div className={styles.quoteText}>{quoteToShow?.text}</div>
          <div className={styles.quoteSource}>- {quoteToShow?.source}</div>
        </Flex>

        <Flex column alignItems="center" gap="var(--spacing-sm)">
          <Icon
            iconNode={<RefreshCcw />}
            size={21}
            onPress={onPress}
            className={cx(animation && styles.rotateIcon)}
          />
          <Icon to="/quotes/add" iconNode={<Plus />} />
        </Flex>
      </Flex>

      {useReactions && randomQuote && (
        <div className={styles.quoteReactions}>
          <LegoReactions parentEntity={randomQuote} />
        </div>
      )}
    </Card>
  );
};

export default guardLogin(RandomQuote);
