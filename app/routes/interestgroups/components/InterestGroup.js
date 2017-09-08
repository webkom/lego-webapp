import styles from './InterestGroup.css';
import React from 'react';
import Image from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';

const InterestGroup = ({ group }) =>
  <Flex className={styles.listItem}>
    <Flex column className={styles.listItemContent} style={{ flex: '1' }}>
      <Link to={`/interestgroups/${group.id}`} className={styles.link}>
        <h2>
          {group.name}
        </h2>
      </Link>
      <div>
        {group.description}
      </div>
      <div>
        {group.memberships.length} medlemmer
      </div>
    </Flex>
    <Image
      className={styles.logoSmall}
      src={
        group.logo ||
        'https://vignette1.wikia.nocookie.net/prettylittleliars/images/6/68/-zYsvq3G_400x400.jpeg/revision/latest?cb=20150121220317'
      }
    />
  </Flex>;

export default InterestGroup;
