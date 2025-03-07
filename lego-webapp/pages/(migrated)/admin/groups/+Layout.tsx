import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { Optional } from 'utility-types';
import { usePageContext } from 'vike-react/usePageContext';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';
import GroupTree from '~/pages/(migrated)/admin/groups/GroupTree';
import { fetchAll, fetchGroup } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectGroupById, selectAllGroups } from '~/redux/slices/groups';
import { useParams } from '~/utils/useParams';
import type { DetailedGroup, PublicGroup } from '~/redux/models/Group';

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

const GroupPage = ({ children }: PropsWithChildren) => {
  const { groupId } = useParams<Optional<GroupPageParams>>(); // optional because of the /admin/groups route with no groupId
  const group = useAppSelector((state) =>
    selectGroupById<DetailedGroup>(state, groupId),
  );
  const groups = useAppSelector(selectAllGroups<PublicGroup>);

  const pageContext = usePageContext();

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
            pathname={pageContext.urlParsed.pathname}
          />
        ),
      }}
      tabs={groupId && <NavigationTabs groupId={groupId} />}
    >
      <Helmet title={group ? group.name : 'Grupper'} />
      {children}
    </Page>
  );
};

export default GroupPage;
