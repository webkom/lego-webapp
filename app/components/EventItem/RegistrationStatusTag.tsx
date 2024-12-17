import { Flex, Icon } from '@webkom/lego-bricks';
import { AlarmClock } from 'lucide-react';
import moment from 'moment-timezone';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import { useIsLoggedIn } from 'app/reducers/auth';
import { EventStatusType } from 'app/store/models/Event';
import utilities from 'app/styles/utilities.css';
import type { ListEvent } from 'app/store/models/Event';

type Props = {
  event: ListEvent;
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
      return `Du ${wasIs} påmeldt`;
    }

    if (event.userReg && event.eventStatusType === EventStatusType.NORMAL) {
      return `Du ${wasIs} på venteliste`;
    }

    if (!!event.activationTime) {
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

    return `Påmelding ${isPastTenseNeeded ? 'ble aldri' : 'er ikke'} bestemt`;
  };

  const getTagColor = () => {
    if (event.isAdmitted) {
      return 'green';
    }

    if (event.userReg && event.eventStatusType === EventStatusType.NORMAL) {
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

  return <Tag tag={getRegistrationStatus()} color={getTagColor()} />;
};

export default RegistrationStatusTag;
