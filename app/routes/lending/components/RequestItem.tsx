import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './RequestItem.css';

export enum LendingRequestStatus {
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

type RequestItemProps = {
  key: number;
  request: any;
  isAdmin?: boolean;
};

export const RequestItem = ({ key, request, isAdmin }: RequestItemProps) => {
  return (
    <Link to={`/lending/request/${request.id}${isAdmin && "/admin"}`} className={styles.requestItem} key={key}>
      <Flex column>
        <h2 className={styles.requestTitle}>{request.lendableObject.title}</h2>
        <Flex gap={10}>
            <p>{request.user}</p>
            <p>
                {request.startTime.format('DD.MM.YYYY HH:mm')} -{' '}
                {request.endTime.format('DD.MM.YYYY HH:mm')}
            </p>
        </Flex>
      </Flex>

      {request.status === LendingRequestStatus.APPROVED ? (
        <ApprovedFlag />
      ) : request.status === LendingRequestStatus.DENIED ? (
        <DeniedFlag />
      ) : (
        <PendingFlag />
      )}
    </Link>
  );
};

export default RequestItem;