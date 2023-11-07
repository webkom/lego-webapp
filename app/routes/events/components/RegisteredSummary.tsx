import { Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import Tooltip from 'app/components/Tooltip';
import styles from './Registrations.css';
import type { EventRegistration } from 'app/models';

type RegistrationProps = {
  registration: EventRegistration;
  currentRegistration?: EventRegistration | null | undefined;
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
  registrations: Array<EventRegistration>;
  onClick: () => any;
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
  registrations: Array<EventRegistration>;
  currentRegistration?: EventRegistration | null | undefined;
  toggleModal?: (arg0: number) => void;
};

const RegisteredSentence = ({
  registrations,
  toggleModal,
  currentRegistration,
}: RegisteredSummaryProps) => {
  switch (registrations.length) {
    case 0:
      return 'Ingen';

    case 1:
      return (
        <Registration
          currentRegistration={currentRegistration}
          registration={registrations[0]}
        />
      );

    case 2:
      return (
        <Flex>
          <Registration
            currentRegistration={currentRegistration}
            registration={registrations[0]}
          />
          {' og '}
          <Registration registration={registrations[1]} />
        </Flex>
      );

    default:
      // For more than 2 registrations we add a clickable `more` link:
      return (
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
            onClick={() => toggleModal && toggleModal(0)}
          />
        </Flex>
      );
  }
};

const RegisteredSummary = (props: RegisteredSummaryProps) => {
  return (
    <Flex className={styles.summary}>
      <RegisteredSentence {...props} /> er påmeldt
    </Flex>
  );
};

export default RegisteredSummary;
