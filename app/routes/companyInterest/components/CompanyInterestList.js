import styles from './CompanyInterest.css';
import React from 'react';
import CompanyInterest from './CompanyInterest';
import Button from 'app/components/Button';
import { Link } from 'react-router';

export type Props = {
  CompanyInterestList: Array
};

const CompanyInterestList = (props: Props) => {
  const groups = props.CompanyInterestList.map((group, key) => (
    <CompanyInterest group={group} key={key} />
  ));
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div>
          <h1>Bedriftsinteresser</h1>
          <p>
            <strong>Her</strong>
            {' '}
            finner du all praktisk informasjon knyttet til
            bedriftsinteresser.
          </p>
        </div>
        <Link
          to={'/companyInterest/createCompanyInterest'}
          className={styles.link}
        >
          <Button>Opprett ny bedriftsinteresse</Button>
        </Link>
      </div>
      <div className="groups">
        {groups}
      </div>
    </div>
  );
};

export default CompanyInterestList;
