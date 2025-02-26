import { Card, Flex, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router';
import { ContentMain } from '~/components/Content';
import Table from '~/components/Table';
import Tag from '~/components/Tags/Tag';
import { fetch } from '~/redux/actions/EmailListActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectEmailLists } from '~/redux/slices/emailLists';
import { selectPaginationNext } from '~/redux/slices/selectors';
import useQuery from '~/utils/useQuery';

const emailListsDefaultQuery = {
  name: '',
  email: '',
  requireInternalAddress: '' as '' | 'true' | 'false',
};

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
    selectEmailLists(state, { pagination }),
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
          label: 'Alle typer adresser',
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
    <ContentMain>
      <Card severity="info">
        Lister brukes for permanente lister som skal mottas av definerte brukere
        eller grupper. Lister kan ikke slettes, men mottakere kan endres. Delen
        av adressen som kommer før @abakus.no er unik og kan ikke brukes andre
        steder på abakus.no. Lister er åpne og alle kan sende e-post til disse.
        Ønsker brukere å sende e-post fra en @abakus.no-adresse må de få
        opprettet en personlig adresse under Brukere.
      </Card>
      <Flex column gap="var(--spacing-sm)">
        <Flex alignItems="center" justifyContent="space-between">
          <h3>Aktive e-postlister</h3>
          <LinkButton href="/admin/email/lists/new">Ny e-postliste</LinkButton>
        </Flex>
        <Table
          columns={columns}
          onLoad={() => {
            dispatch(
              fetch({
                next: true,
                query: query,
              }),
            );
          }}
          filters={query}
          onChange={setQuery}
          hasMore={pagination.hasMore}
          loading={pagination.fetching}
          data={emailLists}
        />
      </Flex>
    </ContentMain>
  );
};

export default EmailLists;
