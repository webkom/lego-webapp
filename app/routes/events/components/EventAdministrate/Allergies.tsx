import { Button, Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import Table from 'app/components/Table';
import type {
  EventAdministrate,
  EventPool,
  ActionGrant,
  User,
  EventRegistration,
} from 'app/models';
import HTTPError from 'app/routes/errors/HTTPError';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import { RegistrationPill, getRegistrationInfo } from './RegistrationTables';

export type Props = {
  eventId: number;
  event: EventAdministrate;
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

const Allergies = ({
  event,
  error,
  loading,
  registered,
  currentUser,
}: Props) => {
  if (loading) {
    return <LoadingIndicator loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const registeredAllergies = registered.filter((registration) => {
    return registration?.user.allergies;
  });

  const data = registeredAllergies
    .filter(
      (registration) =>
        getRegistrationInfo(registration).status !== 'Venteliste'
    )
    .map((registration) => registration.user.allergies)
    .join('\n');

  const allergiesTXT = URL.createObjectURL(
    new Blob([data], {
      type: 'text/plain',
    })
  );

  const initialColumns = [
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

  const columns = event.feedbackRequired
    ? initialColumns.concat({
        title: 'Tilbakemelding',
        dataIndex: 'feedback',
        centered: false,
        render: (feedback) => <span>{feedback || '-'}</span>,
        sorter: (a, b) => a.feedback.localeCompare(b.feedback),
      })
    : initialColumns;

  const numOfAllergies = () => {
    return registered.filter(
      (registration) => registration.user.allergies?.length !== 0
    ).length;
  };
  return (
    <>
      {currentUser.id === event.createdBy ? (
        <>
          <Flex column>
            {numOfAllergies() === 0 ? (
              <p>Ingen påmeldte med allergier</p>
            ) : (
              <Table
                hasMore={false}
                columns={columns}
                loading={loading}
                data={registeredAllergies}
              />
            )}
          </Flex>
          <br></br>
          <Flex justifyContent="space-between">
            <Button>
              <a
                href={allergiesTXT}
                download={
                  'allergier_' + event.title.replaceAll(' ', '_') + '.txt'
                }
              >
                Last ned påmeldte til tekst fil
              </a>
            </Button>
          </Flex>
        </>
      ) : (
        <HTTPError statusCode={403} location={location} />
      )}
    </>
  );
};

export default Allergies;
