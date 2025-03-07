import { LinkButton, Page, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Info, HandCoins, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { GroupType } from 'app/models';
import { ContentMain } from '~/components/Content';
import { fetchAllWithType } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectGroupsByType } from '~/redux/slices/groups';
import InterestGroupComponent from './InterestGroup';
import styles from './InterestGroup.module.css';
import type { ReactNode } from 'react';

const NavigationItem = (props: {
  iconNode: ReactNode;
  to: string;
  children: ReactNode;
}) => {
  return (
    <Flex
      component="a"
      href={props.to}
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
          <LinkButton href="/interest-groups/new">
            Lag ny interessegruppe
          </LinkButton>
        )
      }
    >
      <Helmet title="Interessegrupper" />

      <ContentMain>
        <Flex gap="var(--spacing-xl)" wrap>
          <NavigationItem to="/interest-groups/info" iconNode={<Info />}>
            Praktisk informasjon
            <br /> om interessegrupper
          </NavigationItem>
          <NavigationItem
            to="/interest-groups/money-application"
            iconNode={<HandCoins />}
          >
            Send inn en
            <br />
            pengesøknad
          </NavigationItem>
          <NavigationItem
            to="/interest-groups/create-application"
            iconNode={<Plus />}
          >
            Søk om å opprette en <br />
            interessegruppe
          </NavigationItem>
        </Flex>

        <div>
          <h2>Aktive interessegrupper</h2>
          <Flex column gap="var(--spacing-sm)">
            {activeGroups.map((group) => (
              <InterestGroupComponent
                group={group}
                key={group.id}
                active={true}
              />
            ))}
          </Flex>
        </div>

        <div>
          <h2>Ikke-aktive interessegrupper</h2>
          <p className="secondaryFontColor">
            Send gjerne e-post til{' '}
            <a href="mailTo:interessegrupper@abakus.no">
              interessegrupper@abakus.no
            </a>{' '}
            hvis du ønsker å åpne en av disse igjen!
          </p>
          <Flex column gap="var(--spacing-sm)">
            {notActiveGroups.map((group) => (
              <InterestGroupComponent
                group={group}
                key={group.id}
                active={false}
              />
            ))}
          </Flex>
        </div>
      </ContentMain>
    </Page>
  );
};

export default InterestGroupList;
