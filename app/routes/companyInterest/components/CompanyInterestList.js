import styles from './InterestGroup.css';
import React from 'react';
import InterestGroup from './InterestGroup';
import Button from 'app/components/Button';
import { Link } from 'react-router';

export type Props = {
  CompayInterestList: Array
};

const InterestGroupList = (props: Props) => {
  const groups = props.CompayInterestList.map((group, key) => (
    <CompanyInterest group={group} key={key} />
  ));
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div>
          <h1>Interessegrupper</h1>
          <p>
            <strong>Her</strong>
            {' '}
            finner du all praktisk informasjon knyttet til
            interesserte bedrifter.
          </p>
        </div>
        <Link to={'/interestgroups/create'} className={styles.link}>
          <Button>Opprett ny bedriftsinteresse</Button>
        </Link>
      </div>
      <div className="groups">
        {groups}
      </div>
    </div>
  );
};

export default InterestGroupList;
