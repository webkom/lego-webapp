// @flow

import styles from './InterestGroup.css';
import { Helmet } from 'react-helmet';
import InterestGroupComponent from './InterestGroup';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import { Link } from 'react-router-dom';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { ActionGrant, Group } from 'app/models';

export type Props = {
  actionGrant: ActionGrant,
  interestGroups: Array<Group>,
};

const InterestGroupList = ({ actionGrant, interestGroups }: Props) => {
  const canCreate = actionGrant.includes('create');
  return (
    <Content>
      <Helmet title="Interessegrupper" />
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
        {/* Sorts interest groups in alphabetical order. Sorting using localeCompare will fail to sort ÆØÅ correctly. Use spread operator to do sorting not in-place*/}
        {[...interestGroups]
          .sort((obj1, obj2) => obj1.name.localeCompare(obj2.name))
          .map((group) => (
            <InterestGroupComponent group={group} key={group.id} />
          ))}
      </div>
    </Content>
  );
};

export default InterestGroupList;
