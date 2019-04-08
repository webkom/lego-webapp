// @flow

import styles from './InterestGroup.css';
import React from 'react';
import InterestGroupComponent from './InterestGroup';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import { Link } from 'react-router-dom';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { ActionGrant, Group } from 'app/models';

export type Props = {
  actionGrant: ActionGrant,
  interestGroups: Array<Group>
};

const InterestGroupList = ({ actionGrant, interestGroups }: Props) => {
  const canCreate = actionGrant.includes('create');
  return (
    <Content>
      <div className={styles.section}>
        <div>
          <NavigationTab title="Interessegrupper">
            <NavigationLink to="/">
              <i className="fa fa-angle-left" /> Hjem
            </NavigationLink>
          </NavigationTab>
          <p>
            <Link to="/pages/generelt/39-praktisk-informasjon">Her</Link> finner
            du all praktisk informasjon knyttet til våre interessegrupper.
          </p>
          {canCreate && (
            <Link to="/interestgroups/create" className={styles.link}>
              <Button>Lag ny interessegruppe</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="groups">
        {interestGroups.map(group => (
          <InterestGroupComponent group={group} key={group.id} />
        ))}
      </div>
    </Content>
  );
};

export default InterestGroupList;
