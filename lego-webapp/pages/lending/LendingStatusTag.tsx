import {
  CircleAlert,
  CircleCheckBig,
  CircleDashed,
  CircleX,
} from 'lucide-react';
import { ReactNode } from 'react';
import { Tag } from '~/components/Tags';
import { TagColors } from '~/components/Tags/Tag';
import { LendingRequestStatus } from '~/redux/models/LendingRequest';
import styles from './RequestInbox.module.css';

export const statusMap: Record<
  LendingRequestStatus,
  {
    name: string;
    label: string;
    buttonText: string;
    timelineText: string;
    icon: ReactNode;
    color: TagColors;
  }
> = {
  [LendingRequestStatus.Created]: {
    name: 'Ny forespørsel',
    label: 'Ny forespørsel',
    buttonText: 'Opprett forespørsel',
    timelineText: 'opprettet forespørsel',
    icon: <CircleDashed className={styles.rotate} />,
    color: 'blue',
  },
  [LendingRequestStatus.Unapproved]: {
    name: 'Venter på godkjenning',
    label: 'Venter på godkjenning',
    buttonText: 'Fjern godkjenning',
    timelineText: 'fjernet godkjenning',
    icon: <CircleDashed className={styles.rotate} />,
    color: 'orange',
  },
  [LendingRequestStatus.Approved]: {
    name: 'Godkjent',
    label: 'Godkjent',
    buttonText: 'Godkjenn',
    timelineText: 'godkjente forespørsel',
    icon: <CircleCheckBig />,
    color: 'green',
  },
  [LendingRequestStatus.Denied]: {
    name: 'Avslått',
    label: 'Avslått',
    buttonText: 'Avslå',
    timelineText: 'avslo forespørsel',
    icon: <CircleX />,
    color: 'red',
  },
  [LendingRequestStatus.Cancelled]: {
    name: 'Kansellert',
    label: 'Kansellert',
    buttonText: 'Kanseller forespørsel',
    timelineText: 'kansellerte forespørsel',
    icon: <CircleX />,
    color: 'gray',
  },
  [LendingRequestStatus.ChangesResolved]: {
    name: 'Endringer løst',
    label: 'Venter på godkjenning',
    buttonText: 'Løs endringer',
    timelineText: 'løste endringer',
    icon: <CircleDashed className={styles.rotate} />,
    color: 'orange',
  },
  [LendingRequestStatus.ChangesRequested]: {
    name: 'Endringer forespurt',
    label: 'Endringer forespurt',
    buttonText: 'Forespør endringer',
    timelineText: 'forespurte endringer',
    icon: <CircleAlert />,
    color: 'orange',
  },
};

interface LendingStatusTagProps {
  lendingRequestStatus: LendingRequestStatus;
}

const LendingStatusTag = ({ lendingRequestStatus }: LendingStatusTagProps) => {
  if (!statusMap[lendingRequestStatus]) {
    return lendingRequestStatus;
  }
  return (
    <Tag
      iconNode={statusMap[lendingRequestStatus].icon}
      iconSize={18}
      color={statusMap[lendingRequestStatus].color}
      tag={statusMap[lendingRequestStatus].label}
      className={styles.statusTag}
      gap="var(--spacing-sm)"
    />
  );
};

export default LendingStatusTag;
