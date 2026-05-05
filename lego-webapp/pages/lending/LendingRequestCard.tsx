import { Button, Card, Flex, Icon, Image } from '@webkom/lego-bricks';
import { Archive, MoveRight } from 'lucide-react';
import Time from '~/components/Time';
import LendingStatusTag from '~/pages/lending/LendingStatusTag';
import { TransformedLendingRequest } from '~/redux/models/LendingRequest';
import truncateString from '~/utils/truncateString';
import styles from './RequestInbox.module.css';
import type { MouseEvent } from 'react';

const LendingRequestCard = ({
  lendingRequest,
  isFromAdmin,
  onArchive,
}: {
  lendingRequest: TransformedLendingRequest;
  isFromAdmin?: boolean;
  onArchive?: (
    requestId: TransformedLendingRequest['id'],
    archived: boolean,
  ) => void;
}) => {
  if (!lendingRequest.lendableObject) {
    return null;
  }

  const preventCardNavigation = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Card className={styles.lendingRequestCard}>
      <Flex column width="100%" gap="var(--spacing-sm)">
        <a
          href={`/lending/${lendingRequest.lendableObject.id}/request/${lendingRequest.id} ${
            isFromAdmin ? '?fromAdmin=true' : ''
          }
        `}
        >
          <Flex width="100%">
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
          </Flex>
        </a>
        {!isFromAdmin && (
          <div onClick={preventCardNavigation}>
            <Button
              onPress={() =>
                onArchive?.(lendingRequest.id, !lendingRequest.archived)
              }
            >
              {lendingRequest.archived ? 'Fjern arkivering' : 'Arkiver'}
              <Icon iconNode={<Archive />} size={19} />
            </Button>
          </div>
        )}
      </Flex>
    </Card>
  );
};

export default LendingRequestCard;
