import { Flex, Icon, LinkButton, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash-es';
import { FileDown } from 'lucide-react';
import EmptyState from '~/components/EmptyState';
import Table from '~/components/Table';
import HTTPError from '~/components/errors/HTTPError';
import { fetchAllergies } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import {
  selectEventById,
  selectRegistrationGroups,
} from '~/redux/slices/events';
import { useParams } from '~/utils/useParams';
import {
  RegistrationPill,
  getRegistrationInfo,
} from '../attendees/RegistrationTables';
import type { AdministrateEvent } from '~/redux/models/Event';
import type {
  AdministrateAllergiesUser,
  AdministrateUserWithGrade,
  CurrentUser,
} from '~/redux/models/User';

export const canSeeAllergies = (
  currentUser?: CurrentUser,
  event?: AdministrateEvent,
): boolean => {
  if (!currentUser || !event || isEmpty(event)) {
    return false;
  }
  const responsibleGroup = event.responsibleGroup?.id;
  const responsibleUsers = event?.responsibleUsers.map((user) => user.id);
  return (
    currentUser.id === event.createdBy?.id ||
    (!!responsibleGroup &&
      currentUser.abakusGroups?.includes(responsibleGroup)) ||
    responsibleUsers.includes(currentUser.id)
  );
};

const Allergies = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) =>
    eventId ? selectEventById<AdministrateEvent>(state, eventId) : undefined,
  );
  const { registered } = useAppSelector((state) =>
    selectRegistrationGroups(state, {
      eventId,
    }),
  );

  type RegistrationWithAllergies = (typeof registered)[number] & {
    user: AdministrateUserWithGrade & AdministrateAllergiesUser;
  };
  const registeredAllergies = registered.filter(
    (registration) =>
      'allergies' in registration.user && registration.user.allergies,
  ) as RegistrationWithAllergies[];
  const fetching = useAppSelector((state) => state.events.fetching);
  const currentUser = useCurrentUser();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllergies',
    () => eventId && dispatch(fetchAllergies(eventId)),
    [eventId],
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
        getRegistrationInfo(registration).status !== 'Venteliste',
    )
    .map(
      (registration) =>
        'allergies' in registration.user && registration.user.allergies,
    )
    .join('\n');

  const allergiesTXT = URL.createObjectURL(
    new Blob([data], {
      type: 'text/plain',
    }),
  );

  const initialColumns = [
    {
      title: 'Bruker',
      dataIndex: 'user',
      search: true,
      centered: false,
      render: (user: RegistrationWithAllergies['user']) => (
        <a href={`/users/${user.username}`}>{user.fullName}</a>
      ),
      filterMapping: (user: RegistrationWithAllergies['user']) => user.fullName,
    },
    {
      title: 'Status',
      dataIndex: 'pool',
      render: (_, registration: RegistrationWithAllergies) => {
        const registrationInfo = getRegistrationInfo(registration);
        return (
          <RegistrationPill
            status={registrationInfo.status}
            reason={registrationInfo.reason}
            className={registrationInfo.className}
          />
        );
      },
      sorter: (a: RegistrationWithAllergies, b: RegistrationWithAllergies) => {
        if (a.pool && !b.pool) return -1;
        if (!a.pool && b.pool) return 1;
        return 0;
      },
    },
    {
      title: 'Matallergier / preferanser',
      dataIndex: 'user.allergies',
      centered: false,
      render: (allergies: RegistrationWithAllergies['user']['allergies']) => (
        <span>{allergies}</span>
      ),
      sorter: (a: RegistrationWithAllergies, b: RegistrationWithAllergies) =>
        a.user.allergies.localeCompare(b.user.allergies),
    },
  ];

  const columns = event.feedbackRequired
    ? initialColumns.concat({
        title: 'Tilbakemelding',
        dataIndex: 'feedback',
        centered: false,
        render: (feedback: RegistrationWithAllergies['feedback']) =>
          feedback ? <span>{feedback}</span> : <EmptyState body="-" />,
        sorter: (a: RegistrationWithAllergies, b: RegistrationWithAllergies) =>
          a.feedback.localeCompare(b.feedback),
      })
    : initialColumns;

  return (
    <>
      <Flex column gap="var(--spacing-md)">
        <LinkButton
          href={allergiesTXT}
          download={'allergier_' + event.title.replaceAll(' ', '_') + '.txt'}
        >
          <Icon iconNode={<FileDown />} size={19} />
          Last ned allergier som tekstfil
        </LinkButton>

        {registeredAllergies.length === 0 && !fetching ? (
          <EmptyState body="Ingen påmeldte med allergier" />
        ) : (
          <Table
            hasMore={false}
            columns={columns}
            loading={fetching}
            data={registeredAllergies}
          />
        )}
      </Flex>
    </>
  );
};

export default Allergies;
