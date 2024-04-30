import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import {
  LendingRequest,
  LendingRequestStatus,
} from 'app/store/models/LendingRequest';
import styles from './RequestItem.css';

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
  request: LendingRequest;
  isAdmin?: boolean;
};

export const RequestItem = ({ request, isAdmin }: RequestItemProps) => {
  let url = `/lending/request/${request.id}`;
  if (isAdmin) {
    url += '/admin';
  }
  return (
    <Link to={url} className={styles.requestItem} key={request.id}>
      <Flex column>
        <h2 className={styles.requestTitle}>{request.lendableObject?.title}</h2>
        <Flex gap="var(--spacing-sm)">
          <p>{request.author?.fullName}</p>
          <p>
            {moment(request.startDate).format('DD.MM.YYYY')} -{' '}
            {moment(request.endDate).format('DD.MM.YYYY')}
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
