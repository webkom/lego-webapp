import { Flex, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import ABAKUS_ICON from 'app/assets/icon-192x192.png';
import styles from './InterestGroup.module.css';
import type { Group } from 'app/models';

type Props = {
  group: Group;
  active: boolean;
};

const InterestGroupComponent = ({ group, active }: Props) => {
  return (
    <Link
      to={`/interest-groups/${group.id}`}
      className={cx(styles.listItem, !active && styles.inactiveListItem)}
    >
      <Flex column>
        <h2 className={styles.listItemName}>{group.name}</h2>
        {active && (
          <div className={styles.listItemContent}>
            <div>{group.description}</div>
            <div style={{ marginTop: '10px' }}>
              {group.numberOfUsers} medlemmer
            </div>
          </div>
        )}
      </Flex>
      <Image
        className={active ? styles.logoMedium : styles.logoSmall}
        src={group.logo || ABAKUS_ICON}
        onError={({ currentTarget }) => {
          currentTarget.src = ABAKUS_ICON;
          currentTarget.onerror = null;
        }}
        alt={`${group.name} sin logo`}
      />
    </Link>
  );
};

export default InterestGroupComponent;
