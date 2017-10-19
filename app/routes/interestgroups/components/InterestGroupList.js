import styles from './InterestGroup.css';
import React from 'react';
import InterestGroup from './InterestGroup';
import Button from 'app/components/Button';
import { Link } from 'react-router';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

export type Props = {
  interestGroups: Array
};

const InterestGroupList = (props: Props) => {
  const groups = props.interestGroups.map((group, key) => (
    <InterestGroup group={group} key={key} />
  ));
  const showCreate = props.loggedIn;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div>
          <NavigationTab title="Interessegrupper">
            <NavigationLink to={`/`}>Hjem</NavigationLink>
          </NavigationTab>
          <p>
            <strong>Her</strong> finner du all praktisk informasjon knyttet til
            våre interessegrupper.
          </p>
          {showCreate && (
            <Link to={'/interestgroups/create'} className={styles.link}>
              <Button>Lag ny interessegruppe</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="groups">{groups}</div>
    </div>
  );
};

export default InterestGroupList;
