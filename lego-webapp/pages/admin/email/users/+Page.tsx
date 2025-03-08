import { Card, Flex, LinkButton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { GroupType } from 'app/models';
import { ContentMain } from '~/components/Content';
import EmptyState from '~/components/EmptyState';
import Table from '~/components/Table';
import Tag from '~/components/Tags/Tag';
import { fetch } from '~/redux/actions/EmailUserActions';
import { fetchAllWithType } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectTransformedEmailUsers } from '~/redux/slices/emailUsers';
import { selectGroupsByType } from '~/redux/slices/groups';
import { selectPaginationNext } from '~/redux/slices/selectors';
import useQuery from '~/utils/useQuery';
import type { ColumnProps } from '~/components/Table';

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
      entity: EntityType.EmailUsers,
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
        <a href={`/users/${emailUser.user?.username}`}>
          {emailUser.user?.fullName}
        </a>
      ),
    },
    {
      title: 'Intern e-post',
      dataIndex: 'internalEmail',
      filterIndex: 'email',
      search: true,
      inlineFiltering: false,
      render: (internalEmail: string, emailUser) => (
        <a href={`/admin/email/users/${emailUser.id}`}>
          <span>{`${internalEmail}@abakus.no`}</span>
        </a>
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
            <a
              key={abakusGroup.id}
              href={`/admin/groups/${abakusGroup.id}/members`}
            >
              {abakusGroup.name}{' '}
            </a>
          ));
        if (!output?.length)
          return <EmptyState body="Ingen gruppetilhørighet" />;
        return output;
      },
    },
    {
      title: 'Klasse',
      dataIndex: 'userGrade',
      filter: grades
        .sort((grade1, grade2) => grade1.name.localeCompare(grade2.name))
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
            <a key={grade.id} href={`/admin/groups/${grade.id}/members`}>
              {grade.name}{' '}
            </a>
          ));
        if (!output?.length)
          return <span className="secondaryFontColor">Ikke student</span>;
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
    <ContentMain>
      <Card severity="info">
        Brukere som har behov for det kan få sin egen private @abakus.no
        adresse.
        <br />
        Alle brukere med en aktivert adresse vil motta sin e-post fra Abakus på
        denne.
        <br />
        Adressen skal deaktiveres når brukeren ikke lengre har et aktivt verv i
        Abakus, men adressen vil ikke bli tilgjengelig for andre brukere.
      </Card>
      <Flex column gap="var(--spacing-sm)">
        <Flex alignItems="center" justifyContent="space-between">
          <h3>E-postkontoer</h3>
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
      </Flex>
    </ContentMain>
  );
};

export default EmailUsers;
