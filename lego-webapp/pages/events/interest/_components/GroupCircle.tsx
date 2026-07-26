import cx from 'classnames';
import { CircularPicture } from '~/components/Image';
import { groupGradient, groupMonogram } from '~/pages/events/interest/utils';
import styles from './EventAgenda.module.css';
import type { PublicGroup } from '~/redux/models/Group';

type Props = {
  group?: PublicGroup;
};

const GroupCircle = ({ group }: Props) => {
  if (group?.logo) {
    return (
      <CircularPicture
        src={group.logo}
        placeholder={group.logoPlaceholder ?? undefined}
        alt={`${group.name} sin logo`}
        size={44}
        className={styles.eventLogo}
      />
    );
  }

  return (
    <span
      className={cx(styles.eventMonogram, group && groupGradient)}
      aria-hidden
    >
      {group && groupMonogram(group)}
    </span>
  );
};

export default GroupCircle;
