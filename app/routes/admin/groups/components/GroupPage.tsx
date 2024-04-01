import loadable from '@loadable/component';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import {
  Outlet,
  type RouteObject,
  useLocation,
  useParams,
} from 'react-router-dom';
import { fetchAll, fetchGroup } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { selectGroupById, selectAllGroups } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './GroupPage.css';
import type { DetailedGroup, PublicGroup } from 'app/store/models/Group';
import type { Optional } from 'utility-types';

const GroupForm = loadable(() => import('./GroupForm'));
const GroupMembers = loadable(() => import('./GroupMembers'));
const GroupPermissions = loadable(() => import('./GroupPermissions'));
const GroupTree = loadable(() => import('./GroupTree'));

const NavigationLinks = ({ groupId }: { groupId: string }) => {
  const baseUrl = `/admin/groups/${groupId}`;
  return (
    <>
      <NavigationLink to={`${baseUrl}/settings`}>Rediger</NavigationLink>
      <NavigationLink to={`${baseUrl}/members?descendants=false`}>
        Medlemmer
      </NavigationLink>
      <NavigationLink to={`${baseUrl}/members?descendants=true`}>
        Implisitte medlemmer
      </NavigationLink>
      <NavigationLink to={`${baseUrl}/permissions`}>Rettigheter</NavigationLink>
    </>
  );
};

const SelectGroup = () => (
  <h2
    style={{
      textAlign: 'center',
    }}
  >
    ← Vennligst velg en gruppe fra menyen
  </h2>
);

const GroupPageNavigation = ({
  groupId,
}: {
  groupId: string | null | undefined;
}) => {
  return (
    <NavigationTab title="Grupper">
      {groupId && <NavigationLinks groupId={groupId} />}
    </NavigationTab>
  );
};

export type GroupPageParams = {
  groupId: string;
};
const GroupPage = () => {
  const { groupId } = useParams<Optional<GroupPageParams>>(); // optional because of the /admin/groups route with no groupId
  const group = useAppSelector((state) =>
    selectGroupById<DetailedGroup>(state, groupId),
  );
  const groups = useAppSelector(selectAllGroups<PublicGroup>);

  const location = useLocation();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllGroups',
    () =>
      Promise.allSettled([
        dispatch(fetchAll()),
        groupId && dispatch(fetchGroup(groupId)),
      ]),
    [groupId],
  );

  return (
    <Content>
      <Helmet title={group ? group.name : 'Grupper'} />
      <GroupPageNavigation groupId={groupId} />
      <div className={styles.groupPage}>
        <section className={styles.sidebar}>
          <GroupTree
            groups={groups}
            pathname={location.pathname + location.search}
          />
        </section>

        <section className={styles.main}>
          {group && (
            <header>
              <h2>{group.name}</h2>
              <span>{group.description || ''}</span>
            </header>
          )}

          <Outlet />
        </section>
      </div>
    </Content>
  );
};

const groupPageRoute: RouteObject[] = [
  {
    path: '*',
    Component: GroupPage,
    children: [
      { path: 'settings', Component: GroupForm },
      { path: 'members', Component: GroupMembers },
      { path: 'permissions', Component: GroupPermissions },
      { path: '*', Component: SelectGroup },
    ],
  },
];

export default groupPageRoute;
