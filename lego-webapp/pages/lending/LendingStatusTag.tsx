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
import styles from './LendableObjectList.module.css';

export const statusMap: Record<
  LendingRequestStatus,
  {
    tag: string;
    buttonText: string;
    doneText?: string;
    icon: ReactNode;
    color: TagColors;
  }
> = {
  [LendingRequestStatus.Unapproved]: {
    tag: 'Venter på godkjenning',
    buttonText: 'Fjern godkjenning',
    doneText: 'fjernet godkjenning',
    icon: <CircleDashed className={styles.rotate} />,
    color: 'orange',
  },
  [LendingRequestStatus.Approved]: {
    tag: 'Godkjent',
    buttonText: 'Godkjenn',
    doneText: 'godkjente forespørselen',
    icon: <CircleCheckBig />,
    color: 'green',
  },
  [LendingRequestStatus.Denied]: {
    tag: 'Avslått',
    buttonText: 'Avslå',
    doneText: 'avslo forespørselen',
    icon: <CircleX />,
    color: 'red',
  },
  [LendingRequestStatus.Cancelled]: {
    tag: 'Kansellert',
    buttonText: 'Kanseller forespørsel',
    doneText: 'kansellerte forespørselen',
    icon: <CircleX />,
    color: 'red',
  },
  [LendingRequestStatus.ChangesRequested]: {
    tag: 'Endringer forespurt',
    buttonText: 'Forespør endringer',
    doneText: 'forespurte endringer',
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
      iconSize={22}
      color={statusMap[lendingRequestStatus].color}
      tag={statusMap[lendingRequestStatus].tag}
      className={styles.statusTag}
      gap="var(--spacing-md)"
    />
  );
};

export default LendingStatusTag;
