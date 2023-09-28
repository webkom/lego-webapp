import { Button, Flex } from '@webkom/lego-bricks';
import qs from 'qs';
import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom-v5-compat';
import { push } from 'redux-first-history';
import { fetch } from 'app/actions/EmailListActions';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { selectEmailLists } from 'app/reducers/emailLists';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const EmailLists = () => {
  const location = useLocation();
  const search = location.search;
  const { filters: qsFilters } = qs.parse(search.slice(1));
  const filters = JSON.parse(typeof qsFilters === 'string' ? qsFilters : '{}');
  const { name, email, requireInternalAddress } = filters;
  const query = useMemo(() => {
    return {
      name,
      email,
      requireInternalAddress,
    };
  }, [name, email, requireInternalAddress]);
  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/email-lists/',
      entity: 'emailLists',
      query,
    })(state)
  );
  const emailLists = useAppSelector((state) =>
    selectEmailLists(state, { pagination })
  );
  const fetching = useAppSelector((state) => state.emailLists.fetching);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetch({
        query,
      })
    );
  }, [dispatch, query]);

  const columns = [
    {
      title: 'Navn',
      dataIndex: 'name',
      search: true,
      inlineFiltering: false,
      render: (name: string, emailList) => (
        <Link to={`/admin/email/lists/${emailList.id}`}>{name}</Link>
      ),
    },
    {
      title: 'E-post',
      dataIndex: 'email',
      search: true,
      inlineFiltering: false,
      render: (email: string) => <span>{`${email}@abakus.no`}</span>,
    },
    {
      title: 'Kun for brukere med @abakus e-post',
      dataIndex: 'requireInternalAddress',
      filter: [
        {
          value: 'true',
          label: 'Kun for @abakus.no',
        },
        {
          value: 'false',
          label: 'Alle adresser',
        },
      ],
      inlineFiltering: false,
      render: (internalOnly) =>
        internalOnly ? (
          <Tag tag="Kun for @abakus.no" color="cyan" />
        ) : (
          <Tag tag="Alle typer adresser" color="yellow" />
        ),
    },
  ];

  return (
    <div>
      <p>
        Lister brukes for permanente lister som skal mottas av definerte brukere
        eller grupper. Lister kan ikke slettes, men mottakere kan endres. Delen
        av adressen som kommer før @abakus.no er unik og kan ikke brukes andre
        steder på abakus.no. Lister er åpne og alle kan sende e-post til disse.
        Ønsker brukere å sende e-post fra en @abakus.no adresse må de få
        opprettet en personlig adresse under Brukere.
      </p>
      <Flex
        justifyContent="space-between"
        style={{
          marginBottom: '10px',
        }}
      >
        <h3>Aktive e-postlister</h3>
        <Link to="/admin/email/lists/new">
          <Button>Ny e-postliste</Button>
        </Link>
      </Flex>
      <Table
        columns={columns}
        onLoad={() => {
          dispatch(
            fetch({
              next: true,
              query: query,
            })
          );
        }}
        filters={filters}
        onChange={(filters) => {
          dispatch(
            push({
              search: qs.stringify({
                filters: JSON.stringify(filters),
              }),
            })
          );
        }}
        hasMore={pagination.hasMore}
        loading={fetching}
        data={emailLists}
      />
    </div>
  );
};

export default EmailLists;
