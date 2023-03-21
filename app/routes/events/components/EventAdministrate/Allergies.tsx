import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Table from 'app/components/Table';
import type {
  Event,
  EventPool,
  ActionGrant,
  User,
  ID,
  EventRegistration,
  EventRegistrationPaymentStatus,
  EventRegistrationPresence,
} from 'app/models';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import { RegistrationPill, getRegistrationInfo } from './RegistrationTables';

export type Props = {
  eventId: number;
  event: Event;
  comments: Comment[];
  pools: Array<EventPool>;
  loggedIn: boolean;
  currentUser: CurrentUser;
  error: Record<string, any>;
  loading: boolean;
  registered: Array<EventRegistration>;
  unregistered: Array<EventRegistration>;
  usersResult: Array<User>;
  actionGrant: ActionGrant;
  onQueryChanged: (value: string) => any;
  searching: boolean;
};

const Allergies = ({ eventId, event, error, loading, registered }: Props) => {
  if (loading) {
    return <LoadingIndicator loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const columns = [
    {
      title: 'Bruker',
      dataIndex: 'user',
      search: true,
      centered: false,
      render: (user) => (
        <Link to={`/users/${user.username}`}>{user.fullName}</Link>
      ),
      filterMapping: (user) => user.fullName,
    },
    {
      title: 'Status',
      dataIndex: 'pool',
      render: (pool, registration) => {
        const registrationInfo = getRegistrationInfo(registration);
        return (
          <RegistrationPill
            status={registrationInfo.status}
            reason={registrationInfo.reason}
            className={registrationInfo.className}
          />
        );
      },
      sorter: (a, b) => {
        if (a.pool && !b.pool) return -1;
        if (!a.pool && b.pool) return 1;
        return 0;
      },
    },
    {
      title: 'Matallergier / Preferanser',
      dataIndex: 'user.allergies',
      centered: false,
      render: (allergies) => <span>{allergies}</span>,
      sorter: (a, b) => a.user.allergies.localeCompare(b.user.allergies),
    },
  ];
  const numOfAllergies = () => {
    return registered.filter(
      (registration) => registration.user.allergies.length != 0
    ).length;
  };
  return (
    <div>
      <Flex column>
        {numOfAllergies() == 0 ? (
          <li>Ingen påmeldte med allergier</li>
        ) : (
          <Table
            hasMore={false}
            columns={columns}
            loading={loading}
            data={registered.filter((registration) => {
              return registration.user.allergies;
            })}
          />
        )}
      </Flex>
    </div>
  );
};

export default Allergies;
