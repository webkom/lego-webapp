import styles from './CompanyInterest.css';
import React from 'react';
import Image from 'app/components/Image';
import { Link } from 'react-router';

const CompanyInterest = ({ group }) => (
  <div className={styles.companyInterest}>
    <Link to={`/companyInterest/${group.id}`} className={styles.link}>
      <h2 className={styles.heading}>{group.name}</h2>
    </Link>
    <div className={styles.content}>
      <div className={styles.paragraph}>
        <p>{group.contactPerson}</p>
        <p>{group.mail}</p>
      </div>
      <Link to={`/CompanyInterest/${group.id}`}>
        <Image
          className={styles.interestPic}
          src={'https://i.redd.it/dz8mwvl4dgdy.jpg'}
        />
      </Link>
    </div>
  </div>
);

export default CompanyInterest;
