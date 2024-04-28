import { Flex, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Link } from 'react-router-dom';
import { fetch } from 'app/actions/EmailUserActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { GroupType } from 'app/models';
import { selectTransformedEmailUsers } from 'app/reducers/emailUsers';
import { selectGroupsByType } from 'app/reducers/groups';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import type { ColumnProps } from 'app/components/Table';

const emailUsersDefaultQuery = {
  enabled: '' as '' | 'true' | 'false',
  userGrade: '',
  userGroups: '',
  email: '',
  userFullname: '',
};

const relevantGroupTypes = [
  GroupType.Committee,
  GroupType.Board,
  GroupType.Ordained,
  GroupType.SubGroup,
];

const EmailUsers = () => {
  const { query, setQuery } = useQuery(emailUsersDefaultQuery);

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: '/email-users/',
      entity: 'emailUsers',
      query,
    })(state),
  );
  const emailUsers = useAppSelector((state) =>
    selectTransformedEmailUsers(state, { pagination }),
  );

  const relevantGroups = useAppSelector((state) =>
    selectGroupsByType(state, relevantGroupTypes),
  );

  const grades = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Grade),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEmailUsers',
    () =>
      Promise.allSettled([
        dispatch(fetchAllWithType([...relevantGroupTypes, GroupType.Grade])),
        dispatch(fetch({ query })),
      ]),
    [query],
  );

  const columns: ColumnProps<(typeof emailUsers)[number]>[] = [
    {
      title: 'Navn',
      dataIndex: 'user.fullName',
      filterIndex: 'userFullname',
      search: true,
      inlineFiltering: false,
      render: (_, emailUser) => (
        <Link to={`/admin/email/users/${emailUser.id}`}>
          {emailUser.user?.fullName}
        </Link>
      ),
    },
    {
      title: 'Intern e-post',
      dataIndex: 'internalEmail',
      filterIndex: 'email',
      search: true,
      inlineFiltering: false,
      render: (internalEmail: string, emailUser) => (
        <Link to={`/admin/email/users/${emailUser.id}`}>
          <span>{`${internalEmail}@abakus.no`}</span>
        </Link>
      ),
    },
    {
      title: 'Grupper',
      dataIndex: 'userGroups',
      inlineFiltering: false,
      filterMessage: '- for å få brukere uten gruppetilhørighet',
      filter: relevantGroups
        .sort((group1, group2) => group1.name.localeCompare(group2.name))
        .map((abakusGroup) => ({
          label: abakusGroup.name,
          value: abakusGroup.name,
        }))
        .concat({
          label: 'Ingen gruppetilhørighet',
          value: '-',
        }),
      render: (_, emailUser) => {
        const output = emailUser.user?.abakusGroups
          .filter((abakusGroup) =>
            relevantGroupTypes.includes(abakusGroup.type),
          )
          .map((abakusGroup) => (
            <Link
              key={abakusGroup.id}
              to={`/admin/groups/${abakusGroup.id}/members`}
            >
              {abakusGroup.name}{' '}
            </Link>
          ));
        if (!output?.length) return <i>Ingen gruppetilhørighet</i>;
        return output;
      },
    },
    {
      title: 'Klasse',
      dataIndex: 'userGrade',
      filter: grades
        .map((grade) => ({
          label: grade.name,
          value: grade.name,
        }))
        .concat({
          label: 'Ikke student',
          value: '-',
        }),
      inlineFiltering: false,
      filterMessage: '- for å få brukere uten klasse',
      render: (_, emailUser) => {
        const output = emailUser.user?.abakusGroups
          .filter((abakusGroup) => abakusGroup.type === GroupType.Grade)
          .map((grade) => (
            <Link key={grade.id} to={`/admin/groups/${grade.id}/members`}>
              {grade.name}{' '}
            </Link>
          ));
        if (!output?.length) return <i> Ikke student </i>;
        return output;
      },
    },
    {
      title: 'Status',
      dataIndex: 'internalEmailEnabled',
      filterIndex: 'enabled',
      inlineFiltering: false,
      filter: [
        {
          label: 'Aktiv',
          value: 'true',
        },
        {
          label: 'Inaktiv',
          value: 'false',
        },
      ],
      render: (enabled) =>
        enabled ? (
          <Tag tag="Aktiv" color="green" />
        ) : (
          <Tag tag="Inaktiv" color="gray" />
        ),
    },
  ];

  return (
    <div>
      <p>
        Brukere som har behov for det kan få sin egen private @abakus.no
        adresse. Denne skal være på formatet{' '}
        <b>
          fornavn.etternavn@abakus.no. Adressen kan ikke endres senere, så vær
          sikker på at adressen som settes er riktig.
        </b>{' '}
        Alle brukere med en aktivert adresse vil motta sin e-post fra Abakus på
        denne. Adressen kan deaktiveres når brukeren ikke lengre er aktiv i
        Abakus, men adressen vil ikke bli tilgjengelig for andre brukere.
      </p>
      <Flex
        justifyContent="space-between"
        style={{
          marginBottom: '10px',
        }}
      >
        <h3>Aktive/Inaktive e-postkontoer</h3>
        <LinkButton href="/admin/email/users/new">Ny bruker</LinkButton>
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
        data={emailUsers}
      />
    </div>
  );
};

export default EmailUsers;
