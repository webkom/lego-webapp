import { Button, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import Table from 'app/components/Table';
import Tag from 'app/components/Tags/Tag';
import { GroupType } from 'app/models';
import { emailUsersDefaultQuery } from 'app/routes/admin/email/EmailUsersRoute';
import useQuery from 'app/utils/useQuery';
import type { Group } from 'app/models';
import type { History } from 'history';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  emailUsers: Array<Record<string, any>>;
  fetch: (arg0: {
    query?: Record<string, any>;
    next?: boolean;
  }) => Promise<any>;
  query: Record<string, any>;
  push: History['push'];
  committees: Group[];
  grades: Group[];
};
const EmailUsers = (props: Props) => {
  const { query, setQuery } = useQuery(emailUsersDefaultQuery);

  const columns = [
    {
      title: 'Navn',
      dataIndex: 'user.fullName',
      filterIndex: 'userFullname',
      search: true,
      inlineFiltering: false,
      render: (_, emailUser) => (
        <Link to={`/admin/email/users/${emailUser.id}`}>
          {emailUser.user.fullName}
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
      title: 'Komite',
      dataIndex: 'userCommittee',
      inlineFiltering: false,
      filterMessage: '- for å få brukere uten komite',
      filter: props.committees
        .map((committee) => ({
          label: committee.name,
          value: committee.name,
        }))
        .concat({
          label: 'Ikke abakom',
          value: '-',
        }),
      render: (_, emailUser) => {
        const output = emailUser.user.abakusGroups
          .filter((abakusGroup) => abakusGroup.type === GroupType.Committee)
          .map((committee) => (
            <Link
              key={committee.id}
              to={`/admin/groups/${committee.id}/members`}
            >
              {committee.name}{' '}
            </Link>
          ));
        if (!output.length) return <i> Ikke Abakom </i>;
        return output;
      },
    },
    {
      title: 'Klasse',
      dataIndex: 'userGrade',
      filter: props.grades
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
        const output = emailUser.user.abakusGroups
          .filter((abakusGroup) => abakusGroup.type === GroupType.Grade)
          .map((grade) => (
            <Link key={grade.id} to={`/admin/groups/${grade.id}/members`}>
              {grade.name}{' '}
            </Link>
          ));
        if (!output.length) return <i> Ikke student </i>;
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
        <Link to="/admin/email/users/new">
          <Button>Ny bruker</Button>
        </Link>
      </Flex>
      <Table
        infiniteScroll
        columns={columns}
        onLoad={() => {
          props.fetch({
            next: true,
            query,
          });
        }}
        filters={query}
        onChange={setQuery}
        hasMore={props.hasMore}
        loading={props.fetching}
        data={props.emailUsers}
      />
    </div>
  );
};

export default EmailUsers;
