import {
  Button,
  FilterSection,
  filterSidebar,
  LinkButton,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { FolderOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { fetchEmojis } from 'app/actions/EmojiActions';
import { fetchAll, fetchQuote } from 'app/actions/QuoteActions';
import EmptyState from 'app/components/EmptyState';
import { SelectInput } from 'app/components/Form';
import { selectQuoteById, selectQuotes } from 'app/reducers/quotes';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import useQuery from 'app/utils/useQuery';
import QuoteList from './QuoteList';

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
  const { quoteId } = useParams();
  const isSingle = !!quoteId;

  const { query, setQueryValue } = useQuery(defaultQuotesQuery);
  const approved = query.approved === 'true';

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/quotes/`,
      query: query,
      entity: 'quotes',
    })(state),
  );
  const showFetchMore = !isSingle && pagination.hasMore;

  const quotes = useAppSelector((state) => {
    if (quoteId) {
      const quote = selectQuoteById(state, quoteId);
      return quote ? [quote] : [];
    }
    return selectQuotes(state, { pagination });
  });
  const fetching = useAppSelector((state) => state.quotes.fetching);
  const actionGrant = useAppSelector((state) => state.quotes.actionGrant);

  let errorMessage: string | undefined = undefined;
  if (quotes.length === 0 && !fetching) {
    errorMessage = approved
      ? 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.'
      : 'Ingen sitater venter på godkjenning';
  }

  const ordering = orderingOptions.find(
    (option) => option.value === query.ordering,
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchQuotePage',
    () =>
      Promise.allSettled([
        quoteId ? dispatch(fetchQuote(quoteId)) : dispatch(fetchAll({ query })),
        dispatch(fetchEmojis()),
      ]),
    [quoteId, query],
  );

  return (
    <Page
      title={approved ? 'Overhørt' : 'Ikke-godkjente sitater'}
      back={!approved || isSingle ? { href: '/quotes' } : undefined}
      sidebar={
        approved
          ? filterSidebar({
              children: (
                <FilterSection title="Sorter etter">
                  <SelectInput
                    name="sorting_selector"
                    value={ordering}
                    onChange={(option: Option) =>
                      option && setQueryValue('ordering')(option.value)
                    }
                    isClearable={false}
                    options={orderingOptions}
                  />
                </FilterSection>
              ),
            })
          : undefined
      }
      actionButtons={
        approved && [
          actionGrant.includes('approve') && (
            <LinkButton key="approve" href="/quotes?approved=false">
              Godkjenn sitater
            </LinkButton>
          ),
          <LinkButton key="add" href="/quotes/add">
            Legg til sitat
          </LinkButton>,
        ]
      }
    >
      <Helmet title="Overhørt" />

      {errorMessage ? (
        <EmptyState iconNode={<FolderOpen />} body={errorMessage} />
      ) : (
        <QuoteList actionGrant={actionGrant} quotes={quotes} />
      )}

      <LoadingIndicator loading={fetching}>
        {showFetchMore && (
          <Button
            onPress={() =>
              dispatch(
                fetchAll({
                  query,
                  next: true,
                }),
              )
            }
          >
            Last inn flere
          </Button>
        )}
      </LoadingIndicator>
    </Page>
  );
};

export default guardLogin(QuotePage);
