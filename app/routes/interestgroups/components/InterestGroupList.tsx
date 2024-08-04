import { LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { GroupType } from 'app/models';
import { selectGroupsByType } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import InterestGroupComponent from './InterestGroup';
import styles from './InterestGroup.css';

const InterestGroupList = () => {
  const actionGrant = useAppSelector((state) => state.groups.actionGrant);
  const interestGroups = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Interest),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllInterestGroups',
    () => dispatch(fetchAllWithType(GroupType.Interest)),
    [],
  );

  // Sorts interest groups in alphabetical order. Sorting using localeCompare will fail to sort ÆØÅ correctly.
  // Use spread operator to do sorting not in-place
  const activeGroups = [...interestGroups]
    .filter((a) => a.active)
    .sort((obj1, obj2) => obj1.name.localeCompare(obj2.name));
  const notActiveGroups = [...interestGroups]
    .filter((a) => !a.active)
    .sort((obj1, obj2) => obj1.name.localeCompare(obj2.name));

  return (
    <Page
      title="Interessegrupper"
      actionButtons={
        actionGrant.includes('create') && (
          <LinkButton href="/interest-groups/create">
            Lag ny interessegruppe
          </LinkButton>
        )
      }
    >
      <Helmet title="Interessegrupper" />
      <p>
        <Link to="/pages/generelt/39-praktisk-informasjon">Her</Link> finner du
        all praktisk informasjon knyttet til våre interessegrupper.
      </p>

      {activeGroups.map((group) => (
        <InterestGroupComponent group={group} key={group.id} active={true} />
      ))}

      <div className={styles.inactiveHeader}>
        <h2>Ikke-aktive interessegrupper</h2>
        <p>
          Send gjerne e-post til{' '}
          <a href="mailTo:interessegrupper@abakus.no">
            interessegrupper@abakus.no
          </a>{' '}
          hvis du ønsker å åpne en av disse igjen!
        </p>
      </div>

      {notActiveGroups.map((group) => (
        <InterestGroupComponent group={group} key={group.id} active={false} />
      ))}
    </Page>
  );
};

export default InterestGroupList;
