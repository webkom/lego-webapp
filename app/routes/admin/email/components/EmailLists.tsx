import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Flex, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetch } from 'app/actions/EmailListActions';
import { LegoTable } from 'app/components/LegoTable';
import {
  columnFiltersToSearchParams,
  searchParamsToColumnFilters,
} from 'app/components/LegoTable/utils';
import Tag from 'app/components/Tags/Tag';
import { selectEmailLists } from 'app/reducers/emailLists';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import useQuery from 'app/utils/useQuery';
import type { DetailedEmailList } from 'app/store/models/EmailList';

const emailListsDefaultQuery = {
  name: '',
  email: '',
  requireInternalAddress: '' as '' | 'true' | 'false',
};

const columnHelper = createColumnHelper<DetailedEmailList>();

const EmailLists = () => {
  const { query, setQuery } = useQuery(emailListsDefaultQuery);

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/email-lists/',
      entity: EntityType.EmailLists,
      query,
    })(state),
  );

  const emailLists = useAppSelector((state) =>
    selectEmailLists<DetailedEmailList>(state, { pagination }),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEmailLists',
    () =>
      dispatch(
        fetch({
          query,
        }),
      ),
    [query],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <span>Navn</span>,
        cell: ({ getValue, row }) => (
          <Link to={`/admin/email/lists/${row.original.id}`}>{getValue()}</Link>
        ),
        meta: {
          filter: { variant: 'search' },
        },
      }),
      columnHelper.accessor('email', {
        header: () => <span>E-post</span>,
        cell: ({ getValue }) => <span>{`${getValue()}@abakus.no`}</span>,
        meta: {
          filter: { variant: 'search' },
        },
      }),
      columnHelper.accessor('requireInternalAddress', {
        header: () => <span>Kun for brukere med @abakus e-post</span>,
        cell: ({ getValue }) =>
          getValue() ? (
            <Tag tag="Kun for @abakus.no" color="cyan" />
          ) : (
            <Tag tag="Alle typer adresser" color="yellow" />
          ),
        meta: {
          filter: {
            variant: 'select',
            options: [
              {
                value: 'true',
                label: 'Kun for @abakus.no',
              },
              {
                value: 'false',
                label: 'Alle typer adresser',
              },
            ],
          },
        },
      }),
    ],
    [],
  );

  const columnFilters = searchParamsToColumnFilters(query);

  const table = useReactTable({
    columns,
    data: emailLists,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: (updaterOrValue) =>
      setQuery(columnFiltersToSearchParams(updaterOrValue, columnFilters)),
    enableSorting: false,
  });

  return (
    <div>
      <p>
        Lister brukes for permanente lister som skal mottas av definerte brukere
        eller grupper. Lister kan ikke slettes, men mottakere kan endres. Delen
        av adressen som kommer før @abakus.no er unik og kan ikke brukes andre
        steder på abakus.no. Lister er åpne og alle kan sende e-post til disse.
        Ønsker brukere å sende e-post fra en @abakus.no-adresse må de få
        opprettet en personlig adresse under Brukere.
      </p>
      <Flex
        justifyContent="space-between"
        style={{
          marginBottom: 'var(--spacing-sm)',
        }}
      >
        <h3>Aktive e-postlister</h3>
        <LinkButton href="/admin/email/lists/new">Ny e-postliste</LinkButton>
      </Flex>
      <LegoTable
        table={table}
        loading={pagination.fetching}
        hasMore={pagination.hasMore}
        onLoad={() => {
          dispatch(fetch({ next: true, query }));
        }}
      />
    </div>
  );
};

export default EmailLists;
