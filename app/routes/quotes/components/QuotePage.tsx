import { Button, LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom-v5-compat';
import Select from 'react-select';
import { fetchAll, fetchQuote } from 'app/actions/QuoteActions';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import { LoginPage } from 'app/components/LoginForm';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectQuoteById, selectQuotes } from 'app/reducers/quotes';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import { navigation } from '../utils';
import QuoteList from './QuoteList';
import styles from './Quotes.css';

type Option = {
  label: string;
  value: string;
};

const orderingOptions: Array<Option> = [
  {
    label: 'nyeste',
    value: '-created_at',
  },
  {
    label: 'flest reaksjoner',
    value: '-reaction_count',
  },
];

const defaultQuotesQuery = {
  approved: 'true',
  ordering: '-created_at',
};

const QuotePage = () => {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectIsLoggedIn);

  const { quoteId } = useParams();
  const isSingle = !!quoteId;

  const { query, setQueryValue } = useQuery(defaultQuotesQuery);

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/quotes/`,
      query: query,
      entity: 'quotes',
    })(state)
  );
  const showFetchMore = !isSingle && pagination.hasMore;

  const quotes = useAppSelector((state) => {
    if (quoteId) {
      return [selectQuoteById(state, quoteId)];
    }
    return selectQuotes(state, { pagination });
  });
  const fetching = useAppSelector((state) => state.quotes.fetching);

  let errorMessage: string | undefined = undefined;
  if (quotes.length === 0 && !fetching) {
    errorMessage = query.approved
      ? 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.'
      : 'Ingen sitater venter på godkjenning.';
  }

  const ordering = orderingOptions.find(
    (option) => option.value === query.ordering
  );

  const actionGrant = useAppSelector((state) => state.quotes.actionGrant);
  const emojis = useAppSelector((state) => selectEmojis(state));

  useEffect(() => {
    if (quoteId) {
      dispatch(fetchQuote(quoteId));
    } else {
      dispatch(
        fetchAll({
          query,
        })
      );
    }
    dispatch(fetchEmojis());
  }, [quoteId, query, dispatch]);

  if (!loggedIn) {
    return <LoginPage />;
  }

  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      <Helmet title="Overhørt" />
      {navigation('Overhørt', actionGrant)}

      {!isSingle && (
        <div className={styles.select}>
          <div>Sorter etter:</div>
          <Select
            name="sorting_selector"
            value={ordering}
            onChange={(option: Option) =>
              option && setQueryValue('ordering')(option.value)
            }
            isClearable={false}
            theme={selectTheme}
            styles={selectStyles}
            options={orderingOptions}
          />
        </div>
      )}

      {errorMessage || (
        <QuoteList
          actionGrant={actionGrant}
          quotes={quotes}
          loggedIn={loggedIn}
          emojis={emojis}
        />
      )}

      {showFetchMore && (
        <LoadingIndicator loading={fetching}>
          <Button
            onClick={() =>
              dispatch(
                fetchAll({
                  query,
                  next: true,
                })
              )
            }
          >
            Last inn flere
          </Button>
        </LoadingIndicator>
      )}
    </div>
  );
};

export default QuotePage;
