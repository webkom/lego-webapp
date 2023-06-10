import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import type { ActionGrant, Group } from 'app/models';
import InterestGroupComponent from './InterestGroup';
import styles from './InterestGroup.module.css';

export type Props = {
  actionGrant: ActionGrant;
  interestGroups: Array<Group>;
};

const InterestGroupList = ({ actionGrant, interestGroups }: Props) => {
  const canCreate = actionGrant.includes('create');
  // Sorts interest groups in alphabetical order. Sorting using localeCompare will fail to sort ÆØÅ correctly.
  // Use spread operator to do sorting not in-place
  const activeGroups = [...interestGroups]
    .filter((a) => a.active)
    .sort((obj1, obj2) => obj1.name.localeCompare(obj2.name));
  const notActiveGroups = [...interestGroups]
    .filter((a) => !a.active)
    .sort((obj1, obj2) => obj1.name.localeCompare(obj2.name));
  return (
    <Content>
      <Helmet title="Interessegrupper" />
      <div className={styles.section}>
        <NavigationTab title="Interessegrupper" />
        <p>
          <Link to="/pages/generelt/39-praktisk-informasjon">Her</Link> finner
          du all praktisk informasjon knyttet til våre interessegrupper.
        </p>
        {canCreate && (
          <Link to="/interest-groups/create" className={styles.link}>
            <Button>Lag ny interessegruppe</Button>
          </Link>
        )}
      </div>
      <div className="groups">
        {activeGroups.map((g) => (
          <InterestGroupComponent group={g} key={g.id} active={true} />
        ))}
        <h2> Ikke aktive interessegrupper </h2>
        <p>
          Send gjerne e-post til
          <a href="mailTo:interessegrupper@abakus.no"> oss </a> hvis du ønsker å
          åpne en av disse igjen!
        </p>
        {notActiveGroups.map((g) => (
          <InterestGroupComponent group={g} key={g.id} active={false} />
        ))}
      </div>
    </Content>
  );
};

export default InterestGroupList;
