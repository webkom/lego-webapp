import { LinkButton, Page, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Info, HandCoins, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { GroupType } from 'app/models';
import { selectGroupsByType } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import InterestGroupComponent from './InterestGroup';
import styles from './InterestGroup.module.css';

const NavigationItem = (props: {
  iconNode: React.ElementType;
  to: string;
  children: React.ElementType;
}) => {
  return (
    <Flex
      component={Link}
      to={props.to}
      alignItems="center"
      gap="var(--spacing-md)"
      padding="var(--spacing-md)"
      className={styles.navigationItem}
    >
      <Icon iconNode={props.iconNode} />
      {props.children}
    </Flex>
  );
};

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

      <Flex gap="var(--spacing-xl)" wrap className={styles.navigationWrapper}>
        <NavigationItem to="/interestgroups/info" iconNode={<Info />}>
          Praktisk informasjon
          <br /> om interessegrupper
        </NavigationItem>
        <NavigationItem
          to="/interestgroups/money-application"
          iconNode={<HandCoins />}
        >
          Send inn en
          <br />
          pengesøknad
        </NavigationItem>
        <NavigationItem
          to="/interestgroups/create-application"
          iconNode={<Plus />}
        >
          Søk om å opprette en <br />
          interessegruppe
        </NavigationItem>
      </Flex>

      <h2>Aktive interessegrupper</h2>

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
