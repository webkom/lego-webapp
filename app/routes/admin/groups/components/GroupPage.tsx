import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation, useParams } from 'react-router';
import { fetchAll, fetchGroup } from 'app/actions/GroupActions';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { selectGroupById, selectAllGroups } from 'app/reducers/groups';
import GroupTree from 'app/routes/admin/groups/components/GroupTree';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { DetailedGroup, PublicGroup } from 'app/store/models/Group';
import type { Optional } from 'utility-types';

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

export default GroupPage;
