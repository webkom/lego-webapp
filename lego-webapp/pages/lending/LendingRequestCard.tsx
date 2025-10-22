import { Card, Flex, Icon, Image } from '@webkom/lego-bricks';
import { MoveRight } from 'lucide-react';
import Time from '~/components/Time';
import LendingStatusTag from '~/pages/lending/LendingStatusTag';
import { TransformedLendingRequest } from '~/redux/models/LendingRequest';
import truncateString from '~/utils/truncateString';
import styles from './RequestInbox.module.css';

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
        <Flex width="100%">
          <Flex>
            <Flex column gap="var(--spacing-sm)">
              <Flex column gap="var(--spacing-xs)">
                <h4>
                  {truncateString(lendingRequest.lendableObject.title, 30)}
                </h4>
                <Flex gap="var(--spacing-sm)">
                  <Time time={lendingRequest.startDate} format="DD. MMM" />
                  <Icon iconNode={<MoveRight />} size={19} />
                  <Time time={lendingRequest.endDate} format="DD. MMM" />
                </Flex>
              </Flex>
              <div className={styles.tagContainer}>
                <LendingStatusTag
                  lendingRequestStatus={lendingRequest.status}
                />
              </div>
            </Flex>
          </Flex>
        </Flex>
        <Image
          className={styles.lendingRequestImage}
          height={80}
          width={80}
          src={lendingRequest.lendableObject.image || '/icon-192x192.png'}
          alt={lendingRequest.lendableObject.title}
        />
      </Card>
    </a>
  );
};

export default LendingRequestCard;
