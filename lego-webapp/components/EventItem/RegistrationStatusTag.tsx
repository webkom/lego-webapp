import { Flex, Icon } from '@webkom/lego-bricks';
import { AlarmClock, CircleCheckBig, ClockFading } from 'lucide-react';
import moment from 'moment-timezone';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import { EventStatusType } from '~/redux/models/Event';
import { useIsLoggedIn } from '~/redux/slices/auth';
import utilities from '~/styles/utilities.module.css';
import type { FrontpageEvent, ListEvent } from '~/redux/models/Event';

type Props = {
  event: ListEvent | FrontpageEvent;
  isRegistrationOpen: boolean;
  isRegistrationSameYear: boolean;
};

const RegistrationStatusTag = ({
  event,
  isRegistrationOpen,
  isRegistrationSameYear,
}: Props) => {
  const loggedIn = useIsLoggedIn();
  const isPastTenseNeeded = moment().isAfter(moment(event.startTime));
  const wasIs = isPastTenseNeeded ? 'var' : 'er';

  const getRegistrationStatus = () => {
    if (
      event.eventStatusType === EventStatusType.OPEN ||
      event.eventStatusType === EventStatusType.INFINITE
    ) {
      return `Arrangementet ${wasIs} åpent for alle`;
    }

    if (event.isAdmitted) {
      return (
        <Flex alignItems="center" gap="var(--spacing-xs)">
          <Icon
            iconNode={<CircleCheckBig />}
            size={14}
            className={utilities.hiddenOnMobile}
          />
          Påmeldt
        </Flex>
      );
    }

    if (
      'userReg' in event &&
      event.userReg &&
      event.eventStatusType === EventStatusType.NORMAL
    ) {
      return (
        <Flex alignItems="center" gap="var(--spacing-xs)">
          <Icon
            iconNode={<ClockFading />}
            size={14}
            className={utilities.hiddenOnMobile}
          />
          Venteliste
        </Flex>
      );
    }

    if (event.eventStatusType === 'TBA')
      return `Påmelding ${isPastTenseNeeded ? 'ble aldri' : 'er ikke'} bestemt`;

    if (event.activationTime) {
      return (
        <Flex alignItems="center" gap="var(--spacing-xs)">
          <Icon
            iconNode={<AlarmClock />}
            size={14}
            className={utilities.hiddenOnMobile}
          />
          <span>
            Påmelding {isRegistrationOpen ? 'åpnet' : 'åpner'}{' '}
            <Time
              time={event.activationTime}
              format={isRegistrationSameYear ? 'D. MMM HH:mm' : 'll HH:mm'}
            />
          </span>
        </Flex>
      );
    }
    return 'Du kan ikke melde deg på';
  };

  const getTagColor = () => {
    if (event.isAdmitted) {
      return 'green';
    }

    if (
      'userReg' in event &&
      event.userReg &&
      event.eventStatusType === EventStatusType.NORMAL
    ) {
      return 'orange';
    }

    if (
      event.eventStatusType === EventStatusType.OPEN ||
      event.eventStatusType === EventStatusType.INFINITE
    ) {
      return 'red';
    }

    return isRegistrationOpen ? 'red' : 'gray';
  };

  if (!loggedIn) {
    return null;
  }

  return (
    <Tag
      fontSize="var(--font-size-sm)"
      tag={getRegistrationStatus()}
      color={getTagColor()}
    />
  );
};

export default RegistrationStatusTag;
