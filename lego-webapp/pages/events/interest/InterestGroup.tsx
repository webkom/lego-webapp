import { Flex, Image } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './InterestGroup.module.css';
import type { Group } from 'app/models';

type Props = {
  group: Group;
  active: boolean;
};

const InterestGroupComponent = ({ group, active }: Props) => {
  return (
    <a
      href={`/interest-groups/${group.id}`}
      className={cx(styles.listItem, !active && styles.inactiveListItem)}
    >
      <Image
        className={active ? styles.logoMedium : styles.logoSmall}
        src={group.logo || '/icon-192x192.png'}
        onError={({ currentTarget }) => {
          currentTarget.src = '/icon-192x192.png';
          currentTarget.onerror = null;
        }}
        alt={`${group.name} sin logo`}
      />
      <Flex column>
        <h2 className={styles.listItemName}>{group.name}</h2>
        {active && (
          <Flex column gap="var(--spacing-sm)" className="secondaryFontColor">
            <span>{group.description}</span>
            <span>{group.numberOfUsers} medlemmer</span>
          </Flex>
        )}
      </Flex>
    </a>
  );
};

export default InterestGroupComponent;
