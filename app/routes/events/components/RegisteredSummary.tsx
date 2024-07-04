import { Flex, Skeleton } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import Tooltip from 'app/components/Tooltip';
import styles from './Registrations.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicUser } from 'app/store/models/User';

export type SummaryRegistration = {
  id: EntityId;
  user: PublicUser;
};

type RegistrationProps = {
  registration: SummaryRegistration;
  currentRegistration?: SummaryRegistration | null | undefined;
};

const Registration = ({
  registration,
  currentRegistration,
}: RegistrationProps) => (
  <Tooltip content={registration.user.fullName}>
    <Link
      to={`/users/${registration.user.username}`}
      style={{
        color: 'inherit',
      }}
    >
      {registration.id === (currentRegistration && currentRegistration.id)
        ? 'Du'
        : registration.user.firstName.split(' ')[0]}
    </Link>
  </Tooltip>
);

const renderNameList = (registrations) => {
  const registrationsList = registrations.slice(0, 14);
  return (
    <Flex column>
      {registrationsList.map((reg) => (
        <Flex key={reg.id}>{reg.user.fullName}</Flex>
      ))}
      {registrations.length > 10 && (
        <Flex>{`og ${registrations.length - 12} andre`}</Flex>
      )}
    </Flex>
  );
};

type RegistrationListProps = {
  registrations: SummaryRegistration[];
  onClick: () => void;
};

const RegistrationList = ({
  registrations,
  onClick,
}: RegistrationListProps) => (
  <Tooltip
    content={renderNameList(registrations)}
    className={styles.registrationList}
    onClick={onClick}
  >
    {`${registrations.length} ${
      registrations.length === 1 ? 'annen' : 'andre'
    }`}
  </Tooltip>
);

type RegisteredSummaryProps = {
  registrations?: SummaryRegistration[];
  currentRegistration?: SummaryRegistration | null | undefined;
  openModalTab?: (tabIndex: number) => void;
  skeleton?: boolean;
};

const RegisteredSentence = ({
  registrations,
  openModalTab,
  currentRegistration,
}: RegisteredSummaryProps) => {
  if (!registrations) {
    return null;
  }

  let sentence;

  switch (registrations.length) {
    case 0:
      sentence = 'Ingen';
      break;

    case 1:
      sentence = (
        <Registration
          currentRegistration={currentRegistration}
          registration={registrations[0]}
        />
      );
      break;

    case 2:
      sentence = (
        <Flex>
          <Registration
            currentRegistration={currentRegistration}
            registration={registrations[0]}
          />
          {' og '}
          <Registration registration={registrations[1]} />
        </Flex>
      );
      break;

    default:
      // For more than 2 registrations we add a clickable `more` link:
      sentence = (
        <Flex>
          <Registration
            currentRegistration={currentRegistration}
            registration={registrations[0]}
          />
          {', '}
          <Registration registration={registrations[1]} />
          {' og '}
          <RegistrationList
            registrations={registrations.slice(2)}
            onClick={() => openModalTab && openModalTab(0)}
          />
        </Flex>
      );
  }

  return <>{sentence} er påmeldt</>;
};

const RegisteredSummary = ({ skeleton, ...props }: RegisteredSummaryProps) => {
  return (
    <Flex className={styles.summary}>
      {skeleton && !props.registrations ? (
        <Skeleton width="80%" />
      ) : (
        <RegisteredSentence {...props} />
      )}
    </Flex>
  );
};

export default RegisteredSummary;
