import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { fetchAll, fetchGroup } from 'app/actions/GroupActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { selectGroupById, selectAllGroups } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import GroupForm from './GroupForm';
import GroupMembers from './GroupMembers';
import styles from './GroupPage.css';
import GroupPermissions from './GroupPermissions';
import GroupTree from './GroupTree';

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

const GroupPage = () => {
  const { groupId } = useParams<{ groupId?: string }>();
  const group = useAppSelector((state) => selectGroupById(state, groupId!));
  const groups = useAppSelector(selectAllGroups);

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

          <Routes>
            <Route path="settings" element={<GroupForm />} />
            <Route path="members" element={<GroupMembers />} />
            <Route path="permissions" element={<GroupPermissions />} />
            <Route path="*" element={<SelectGroup />} />
          </Routes>
        </section>
      </div>
    </Content>
  );
};

export default GroupPage;
