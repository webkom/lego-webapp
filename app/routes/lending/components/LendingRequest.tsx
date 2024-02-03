import { Button, Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import styles from './LendingRequest.css';

export enum status {
  PENDING,
  APPROVED,
  DENIED,
}

const ApprovedFlag = () => {
  return (
    <div className={cx(styles.statusPill, styles.approved)}>
      <Icon name={'checkmark-circle-outline'} size={30} />
      Godkjent!
    </div>
  );
};

const PendingFlag = () => {
  return (
    <div className={cx(styles.statusPill, styles.pending)}>
      <Icon name={'time-outline'} size={30} />
      Venter på svar
    </div>
  );
};

const DeniedFlag = () => {
  return (
    <div className={cx(styles.statusPill, styles.denied)}>
      <Icon name={'close-circle-outline'} size={30} />
      Avslått
    </div>
  );
};

type LendingRequestProps = {
  request: any;
  isAdmin?: boolean;
};

export const LendingRequest = ({
  request,
  isAdmin = false,
}: LendingRequestProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      shadow
      isHoverable
      key={request.id}
      className={styles.request}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Flex column>
        <h3>{request.lendableObject.title}</h3>
        {isOpen && (
          <>
            <p>{request.message}</p>
            <p>
              {request.startTime.format('DD.MM.YYYY HH:mm')} -{' '}
              {request.endTime.format('DD.MM.YYYY HH:mm')}
            </p>
            {request.status === status.PENDING && (
              <Button danger>Trekk forespørsel</Button>
            )}
          </>
        )}
      </Flex>
      <Flex alignItems="center" gap={10}>
        {request.status === status.APPROVED ? (
          <ApprovedFlag />
        ) : request.status === status.DENIED ? (
          <DeniedFlag />
        ) : isAdmin ? (
          <Flex alignItems="center" gap={5}>
            <Button success>Godkjenn</Button>
            <Button dark>Avslå</Button>
          </Flex>
        ) : (
          <PendingFlag />
        )}
      </Flex>
    </Card>
  );
};

export default LendingRequest;
