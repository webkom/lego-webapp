import {
  FilterSection,
  filterSidebar,
  Flex,
  HeroPage,
  Icon,
  LinkButton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ArrowLeft, FolderOpen, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import EmptyState from '~/components/EmptyState';
import { SelectInput } from '~/components/Form';
import Paginator from '~/components/Paginator';
import RandomQuote from '~/components/RandomQuote';
import QuoteList from '~/pages/quotes/QuoteList';
import { fetchEmojis } from '~/redux/actions/EmojiActions';
import {
  fetchAll,
  fetchQuote,
  fetchRandomQuote,
} from '~/redux/actions/QuoteActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import {
  selectQuoteById,
  selectQuotes,
  selectRandomQuote,
} from '~/redux/slices/quotes';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import useQuery from '~/utils/useQuery';
import styles from './Quotes.module.css';

type Option = {
  label: string;
  value: string;
};

const orderingOptions: Array<Option> = [
  {
    label: 'Nyeste',
    value: '-created_at',
  },
  {
    label: 'Flest reaksjoner',
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
  const isOverview = approved && !isSingle;

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/quotes/`,
      query: query,
      entity: EntityType.Quotes,
    })(state),
  );

  const quotes = useAppSelector((state) => {
    if (quoteId) {
      const quote = selectQuoteById(state, quoteId);
      return quote ? [quote] : [];
    }
    return selectQuotes(state, { pagination });
  });
  const fetching = useAppSelector((state) => state.quotes.fetching);
  const actionGrant = useAppSelector((state) => state.quotes.actionGrant);
  const shouldFetchRandomQuote =
    useAppSelector(selectRandomQuote) === undefined;

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

  usePreparedEffect(
    'fetchQuotePageRandomQuote',
    () => isOverview && shouldFetchRandomQuote && dispatch(fetchRandomQuote()),
    [isOverview, shouldFetchRandomQuote],
  );

  let sectionTitle = 'Alle sitater';
  if (isSingle) sectionTitle = 'Sitat';
  else if (!approved) sectionTitle = 'Venter på godkjenning';

  return (
    <HeroPage
      title={approved ? 'Overhørt' : 'Ikke-godkjente sitater'}
      actions={
        isOverview ? (
          <>
            <LinkButton dark href="/quotes/new">
              <Icon iconNode={<Plus />} size={20} />
              Legg til sitat
            </LinkButton>
            {actionGrant.includes('approve') && (
              <LinkButton ghost href="/quotes?approved=false">
                Godkjenn sitater
              </LinkButton>
            )}
          </>
        ) : (
          <LinkButton ghost href="/quotes">
            <Icon iconNode={<ArrowLeft />} size={20} />
            Alle sitater
          </LinkButton>
        )
      }
      aside={
        isOverview && (
          <Flex column gap="var(--spacing-sm)">
            <h3 className={styles.asideHeading}>Tilfeldig sitat</h3>
            <RandomQuote />
          </Flex>
        )
      }
    >
      <Helmet title="Overhørt" />
      <HeroPage.Section
        title={sectionTitle}
        sidebar={
          isOverview
            ? filterSidebar({
                children: (
                  <FilterSection title="Sorter etter">
                    <SelectInput
                      name="sorting_selector"
                      value={ordering}
                      onChange={(nextValue) => {
                        const option = nextValue as Option | null;
                        if (option) setQueryValue('ordering')(option.value);
                      }}
                      isClearable={false}
                      options={orderingOptions}
                    />
                  </FilterSection>
                ),
              })
            : undefined
        }
      >
        {errorMessage ? (
          <EmptyState iconNode={<FolderOpen />} body={errorMessage} />
        ) : (
          <Paginator
            hasMore={!isSingle && pagination.hasMore}
            fetching={pagination.fetching}
            fetchNext={() => {
              dispatch(
                fetchAll({
                  query,
                  next: true,
                }),
              );
            }}
          >
            <QuoteList actionGrant={actionGrant} quotes={quotes} />
          </Paginator>
        )}
      </HeroPage.Section>
    </HeroPage>
  );
};

export default guardLogin(QuotePage);
