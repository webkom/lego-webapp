import { Button, Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import Table from 'app/components/Table';
import HTTPError from 'app/routes/errors/HTTPError';
import { RegistrationPill, getRegistrationInfo } from './RegistrationTables';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type Comment from 'app/store/models/Comment';
import type { AdministrateEvent } from 'app/store/models/Event';
import type { DetailedRegistration } from 'app/store/models/Registration';
import type { CurrentUser, DetailedUser } from 'app/store/models/User';

export type Props = {
  eventId: number;
  event: AdministrateEvent;
  comments: Comment[];
  pools: Array<ID>;
  loggedIn: boolean;
  currentUser: CurrentUser;
  error: Record<string, any>;
  loading: boolean;
  registered: Array<DetailedRegistration>;
  unregistered: Array<DetailedRegistration>;
  usersResult: Array<DetailedUser>;
  actionGrant: ActionGrant;
  onQueryChanged: (value: string) => any;
  searching: boolean;
};

export const canSeeAllergies = (
  currentUser?: CurrentUser,
  event?: AdministrateEvent
) => {
  if (!currentUser || !event) {
    return false;
  }
  return (
    currentUser.id === event.createdBy?.id ||
    currentUser.abakusGroups?.includes(event.responsibleGroup?.id as ID)
  );
};

const Allergies = (props: Props) => {
  if (props.loading) {
    return <LoadingIndicator loading />;
  }

  if (props.error) {
    return <div>{props.error.message}</div>;
  }

  const registeredAllergies = props.registered.filter((registration) => {
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

  const columns = props.event.feedbackRequired
    ? initialColumns.concat({
        title: 'Tilbakemelding',
        dataIndex: 'feedback',
        centered: false,
        render: (feedback) => <span>{feedback || '-'}</span>,
        sorter: (a, b) => a.feedback.localeCompare(b.feedback),
      })
    : initialColumns;

  const numOfAllergies = () => {
    return props.registered.filter(
      (registration) => registration.user.allergies?.length !== 0
    ).length;
  };
  return (
    <>
      {canSeeAllergies(props.currentUser, props.event) ? (
        <>
          <Flex column>
            {numOfAllergies() === 0 ? (
              <p>Ingen påmeldte med allergier</p>
            ) : (
              <Table
                hasMore={false}
                columns={columns}
                loading={props.loading}
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
                  'allergier_' + props.event.title.replaceAll(' ', '_') + '.txt'
                }
              >
                Last ned påmeldte til tekstfil
              </a>
            </Button>
          </Flex>
        </>
      ) : (
        <HTTPError statusCode={403} />
      )}
    </>
  );
};

export default Allergies;
