import loadable from '@loadable/component';
import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import {
  Outlet,
  type RouteObject,
  useLocation,
  useParams,
} from 'react-router-dom';
import { fetchAll, fetchGroup } from 'app/actions/GroupActions';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { selectGroupById, selectAllGroups } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { DetailedGroup, PublicGroup } from 'app/store/models/Group';
import type { Optional } from 'utility-types';

const GroupForm = loadable(() => import('./GroupForm'));
const GroupMembers = loadable(() => import('./GroupMembers'));
const GroupPermissions = loadable(() => import('./GroupPermissions'));
const GroupTree = loadable(() => import('./GroupTree'));

const NavigationTabs = ({ groupId }: { groupId: string }) => {
  const baseUrl = `/admin/groups/${groupId}`;
  return (
    <>
      <NavigationTab href={`${baseUrl}/settings`}>Rediger</NavigationTab>
      <NavigationTab
        matchQuery={{ descendants: ['false', undefined] }}
        href={`${baseUrl}/members?descendants=false`}
      >
        Medlemmer
      </NavigationTab>
      <NavigationTab
        matchQuery={{ descendants: 'true' }}
        href={`${baseUrl}/members?descendants=true`}
      >
        Implisitte medlemmer
      </NavigationTab>
      <NavigationTab href={`${baseUrl}/permissions`}>Rettigheter</NavigationTab>
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
    <Page
      title={group ? group.name : 'Administer grupper'}
      description={group?.description}
      sidebar={{
        title: 'Grupper',
        side: 'left',
        icon: 'menu',
        content: (
          <GroupTree
            groups={groups}
            pathname={location.pathname + location.search}
          />
        ),
      }}
      tabs={groupId && <NavigationTabs groupId={groupId} />}
    >
      <Helmet title={group ? group.name : 'Grupper'} />
      <Outlet />
    </Page>
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
