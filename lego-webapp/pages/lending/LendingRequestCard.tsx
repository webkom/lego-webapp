import { Card, Flex, Icon, Image } from '@webkom/lego-bricks';
import { MoveRight } from 'lucide-react';
import Time from '~/components/Time';
import LendingStatusTag from '~/pages/lending/LendingStatusTag';
import { TransformedLendingRequest } from '~/redux/models/LendingRequest';
import styles from './LendableObjectList.module.css';

const LendingRequestCard = ({
  lendingRequest,
  isFromAdmin,
}: {
  lendingRequest: TransformedLendingRequest;
  isFromAdmin?: boolean;
}) => {
  return (
    <a
      href={`/lending/${lendingRequest.lendableObject.id}/request/${lendingRequest.id} ${
        isFromAdmin ? '?fromAdmin=true' : ''
      }
        `}
    >
      <Card isHoverable hideOverflow className={styles.lendingRequestCard}>
        <Image
          className={styles.lendingRequestImage}
          height={80}
          width={80}
          src={lendingRequest.lendableObject.image || '/icon-192x192.png'}
          alt={`
      }${lendingRequest.lendableObject.title}`}
        />
        <Flex justifyContent="space-between" width="100%">
          <Flex column gap="var(--spacing-sm)">
            <h4>{lendingRequest.lendableObject.title}</h4>
            <Flex alignItems="center" gap={8}>
              <Time time={lendingRequest.startDate} format="DD. MMM" />
              <Icon iconNode={<MoveRight />} size={19} />
              <Time time={lendingRequest.endDate} format="DD. MMM" />
            </Flex>
          </Flex>
          <LendingStatusTag lendingRequestStatus={lendingRequest.status} />
        </Flex>
      </Card>
    </a>
  );
};

export default LendingRequestCard;
