// @flow

import styles from './InterestGroup.css';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router-dom';
import type { Group } from 'app/models';

// TODO: rather handle this in the backend
const SAMPLE_LOGO = 'https://i.imgur.com/Is9VKjb.jpg';

type Props = {
  group: Group,
};

const InterestGroupComponent = ({ group }: Props) => {
  return (
    <Flex className={styles.listItem}>
      <Flex column className={styles.listItemContent} style={{ flex: '1' }}>
        <Link to={`/interestgroups/${group.id}`} className={styles.link}>
          <h2>{group.name}</h2>
        </Link>
        <div>{group.description}</div>
        <div>{group.numberOfUsers} medlemmer</div>
      </Flex>
      <Flex justifyContent="center" column>
        <Image className={styles.logoSmall} src={group.logo || SAMPLE_LOGO} />
      </Flex>
    </Flex>
  );
};

export default InterestGroupComponent;
