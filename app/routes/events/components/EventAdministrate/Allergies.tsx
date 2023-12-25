import { Button, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Link, useParams } from 'react-router-dom';
import { fetchAllergies } from 'app/actions/EventActions';
import Table from 'app/components/Table';
import { getRegistrationGroups, selectEventById } from 'app/reducers/events';
import { useUserContext } from 'app/routes/app/AppRoute';
import HTTPError from 'app/routes/errors/HTTPError';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { RegistrationPill, getRegistrationInfo } from './RegistrationTables';
import type { ID } from 'app/store/models';
import type { AdministrateEvent } from 'app/store/models/Event';
import type { CurrentUser } from 'app/store/models/User';

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

const Allergies = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) => selectEventById(state, { eventId }));
  const { registered } = useAppSelector((state) =>
    getRegistrationGroups(state, {
      eventId,
    })
  );
  const registeredAllergies = registered.filter((registration) => {
    return registration?.user.allergies;
  });
  const fetching = useAppSelector((state) => state.events.fetching);
  const { currentUser } = useUserContext();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllergies',
    () => eventId && dispatch(fetchAllergies(eventId)),
    [eventId]
  );

  if (!event?.id) {
    return <LoadingIndicator loading={fetching} />;
  }

  if (!canSeeAllergies(currentUser, event)) {
    return <HTTPError statusCode={403} />;
  }

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

  return (
    <>
      <Flex column>
        {registeredAllergies.length === 0 && !fetching ? (
          <p className="secondaryFontColor">Ingen påmeldte med allergier</p>
        ) : (
          <Table
            hasMore={false}
            columns={columns}
            loading={fetching}
            data={registeredAllergies}
          />
        )}
      </Flex>
      <br></br>
      <Flex justifyContent="space-between">
        <a
          href={allergiesTXT}
          download={'allergier_' + event.title.replaceAll(' ', '_') + '.txt'}
        >
          <Button>
            <Icon name="download-outline" /> Last ned allergier som tekstfil
          </Button>
        </a>
      </Flex>
    </>
  );
};

export default Allergies;
