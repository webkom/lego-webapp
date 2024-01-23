import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import styles from './InterestGroup.css';
import type { Group } from 'app/models';
// TODO: rather handle this in the backend
const SAMPLE_LOGO = 'https://i.imgur.com/Is9VKjb.jpg';

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
        src={group.logo || SAMPLE_LOGO}
        alt={active ? `${group.name} logo` : 'logo'}
      />
    </Link>
  );
};

export default InterestGroupComponent;
