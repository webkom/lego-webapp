import styles from './InterestGroup.css';
import React from 'react';
import Image from 'app/components/Image';
import { Link } from 'react-router';

const InterestGroup = ({ group }) =>
  <div className={styles.interestGroup}>
    <Link to={`/interestgroups/${group.id}`} className={styles.link}>
      <h2 className={styles.heading}>
        {group.name}
      </h2>
    </Link>
    <div className={styles.content}>
      <div className={styles.paragraph}>
        <p>
          {group.description}
        </p>
        <p className={styles.bold}>
          Antall medlemmer i {group.name}: {group.numberOfUsers}
        </p>
      </div>
      <Link to={`/interestgroups/${group.id}`}>
        <Image
          className={styles.interestPic}
          src={'https://i.redd.it/dz8mwvl4dgdy.jpg'}
        />
      </Link>
    </div>
  </div>;

export default InterestGroup;
