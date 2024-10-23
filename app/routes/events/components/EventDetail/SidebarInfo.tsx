import { Flex, Skeleton } from '@webkom/lego-bricks';
import {
  BriefcaseBusiness,
  Clock,
  Coins,
  Languages,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MazemapButton } from 'app/components/MazemapEmbed/MazemapButton';
import TextWithIcon from 'app/components/TextWithIcon';
import { FromToTime } from 'app/components/Time';
import styles from 'app/routes/events/components/EventDetail/EventDetail.module.css';
import type { DetailedEvent } from 'app/store/models/Event';

interface Props {
  event?: DetailedEvent;
}

export const SidebarInfo = ({ event }: Props) => {
  return !event ? (
    <Flex column gap="var(--spacing-sm)">
      <Skeleton array={3} className={styles.sidebarInfo} />
    </Flex>
  ) : (
    <Flex column gap="var(--spacing-sm)">
      {event.company && (
        <TextWithIcon
          iconNode={<BriefcaseBusiness />}
          size={20}
          content={
            <Link to={`/companies/${event.company.id}`}>
              {event.company.name}
            </Link>
          }
          className={styles.sidebarInfo}
        />
      )}

      <TextWithIcon
        iconNode={<Clock />}
        size={20}
        content={<FromToTime from={event.startTime} to={event.endTime} />}
        className={styles.sidebarInfo}
      />

      {event.isForeignLanguage !== null && event.isForeignLanguage && (
        <TextWithIcon
          iconNode={<Languages />}
          size={20}
          content="English"
          className={styles.sidebarInfo}
        />
      )}

      {event.isPriced && (
        <TextWithIcon
          iconNode={<Coins />}
          size={20}
          content={event.priceMember / 100 + ',-'}
          className={styles.sidebarInfo}
        />
      )}

      <TextWithIcon
        iconNode={<MapPin />}
        size={20}
        content={event.location}
        className={styles.sidebarInfo}
      />

      {event.mazemapPoi && <MazemapButton mazemapPoi={event.mazemapPoi} />}
    </Flex>
  );
};
