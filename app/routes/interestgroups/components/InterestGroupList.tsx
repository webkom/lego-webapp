import { Button, Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { GroupType } from 'app/models';
import { selectGroupsWithType } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import InterestGroupComponent from './InterestGroup';
import styles from './InterestGroup.css';

const InterestGroupList = () => {
  const actionGrant = useAppSelector((state) => state.groups.actionGrant);
  const interestGroups = useAppSelector((state) =>
    selectGroupsWithType(state, { groupType: GroupType.Interest })
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllInterestGroups',
    () => dispatch(fetchAllWithType(GroupType.Interest)),
    []
  );

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
      <NavigationTab title="Interessegrupper" />
      <Flex
        wrap
        gap={10}
        margin={'0 0 30px'}
        justifyContent="space-between"
        alignItems="center"
      >
        <p style={{ margin: 0 }}>
          <Link to="/pages/generelt/39-praktisk-informasjon">Her</Link> finner
          du all praktisk informasjon knyttet til våre interessegrupper.
        </p>
        {canCreate && (
          <Link to="/interest-groups/create">
            <Button>Lag ny interessegruppe</Button>
          </Link>
        )}
      </Flex>

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
    </Content>
  );
};

export default InterestGroupList;
