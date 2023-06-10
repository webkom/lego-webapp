import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import type { Group } from 'app/models';
import styles from './InterestGroup.module.css';
// TODO: rather handle this in the backend
const SAMPLE_LOGO = 'https://i.imgur.com/Is9VKjb.jpg';
type Props = {
  group: Group;
  active: boolean;
};

const InterestGroupComponent = ({ group, active }: Props) => {
  return (
    <Flex className={styles.listItem}>
      <Flex
        column
        className={styles.listItemContent}
        style={{
          flex: '1',
        }}
      >
        <Link to={`/interest-groups/${group.id}`} className={styles.link}>
          <h2
            style={
              !active
                ? {
                    color: 'grey',
                  }
                : {}
            }
          >
            {group.name}
          </h2>
        </Link>
        {active && (
          <>
            <div>{group.description}</div>
            <div>{group.numberOfUsers} medlemmer</div>
          </>
        )}
      </Flex>
      <Flex justifyContent="center" column>
        <Image
          className={active ? styles.logoMedium : styles.logoSmall}
          src={group.logo || SAMPLE_LOGO}
        />
      </Flex>
    </Flex>
  );
};

export default InterestGroupComponent;
