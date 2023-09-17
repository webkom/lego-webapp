import { Button, LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
import qs from 'qs';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom-v5-compat';
import Select from 'react-select';
import { fetchEmojis } from 'app/actions/EmojiActions';
import { fetchAll, fetchQuote } from 'app/actions/QuoteActions';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import { LoginPage } from 'app/components/LoginForm';
import { selectEmojis } from 'app/reducers/emojis';
import { selectQuoteById, selectQuotes } from 'app/reducers/quotes';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { navigation } from '../utils';
import QuoteList from './QuoteList';
import styles from './Quotes.css';

const qsParamsParser = (search) => ({
  approved:
    qs.parse(search, {
      ignoreQueryPrefix: true,
    }).approved || 'true',
  ordering: qs.parse(search, {
    ignoreQueryPrefix: true,
  }).ordering,
});

type Option = {
  label: string;
  value: string;
};

const filterRegDateOptions: Array<Option> = [
  {
    label: 'nyeste',
    value: '',
  },
  {
    label: 'flest reaksjoner',
    value: '?ordering=-reaction_count',
  },
];

type Props = {
  loggedIn: boolean;
};

const QuotePage = ({ loggedIn }: Props) => {
  const dispatch = useAppDispatch();

  const { quoteId } = useParams();

  const location = useLocation();
  const query = qsParamsParser(location.search);

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/quotes/`,
      query: query,
      entity: 'quotes',
    })(state)
  );
  const showFetchMore = pagination.hasMore;

  const quotes = useAppSelector((state) => {
    if (quoteId) {
      return [selectQuoteById(state, quoteId)];
    }

    return selectQuotes(state, { pagination });
  });

  const fetching = useAppSelector((state) => state.quotes.fetching);

  let errorMessage = undefined;
  if (quotes.length === 0 && !fetching) {
    errorMessage =
      query.approved === 'false'
        ? 'Ingen sitater venter på godkjenning.'
        : 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.';
  }

  const actionGrant = useAppSelector((state) => state.quotes.actionGrant);
  const emojis = useAppSelector((state) => selectEmojis(state));
  const fetchingEmojis = useAppSelector((state) => state.emojis.fetching);

  useEffect(() => {
    if (quoteId) {
      dispatch(fetchQuote(quoteId));
    } else {
      dispatch(
        fetchAll({
          query: qsParamsParser(location.search),
        })
      );
    }
    dispatch(fetchEmojis());
  }, [quoteId, location.search, dispatch]);

  const history = useHistory();

  const [ordering, setOrdering] = useState<Option>(
    query.ordering === '-reaction_count'
      ? filterRegDateOptions[1]
      : filterRegDateOptions[0]
  );

  const handleChange = (event) => {
    setOrdering(event);
  };

  useEffect(() => {
    // Update url with the new filtering/ordering params while ignoring the default values
    const searchObject = qs.parse(ordering.value, { ignoreQueryPrefix: true });
    if (query.approved === 'false') searchObject['approved'] = query.approved;
    const searchString = qs.stringify(searchObject, { addQueryPrefix: true });
    history.replace({
      search: searchString,
    });
  }, [history, ordering, query.approved]);

  if (!loggedIn) {
    return LoginPage;
  }

  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      <Helmet title="Overhørt" />
      {navigation('Overhørt', actionGrant)}

      <div className={styles.select}>
        <div>Sorter etter:</div>
        <Select
          name="sorting_selector"
          value={ordering}
          onChange={handleChange}
          isClearable={false}
          theme={selectTheme}
          styles={selectStyles}
          options={filterRegDateOptions}
        />
      </div>

      {errorMessage || (
        <QuoteList
          actionGrant={actionGrant}
          quotes={quotes}
          loggedIn={loggedIn}
          emojis={emojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
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
