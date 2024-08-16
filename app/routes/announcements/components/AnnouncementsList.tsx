import { Flex, LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { fetchAllAnnouncements } from 'app/actions/AnnouncementsActions';
import { useApiThunk } from 'app/actions/createApiThunk/useApiThunk';
import EmptyState from 'app/components/EmptyState';
import { selectAnnouncements } from 'app/reducers/announcements';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import AnnouncementItem from './AnnouncementItem';
import AnnouncementsCreate from './AnnouncementsCreate';
import styles from './AnnouncementsList.module.css';

const AnnouncementsList = () => {
  const dispatch = useAppDispatch();
  const { entities } = useApiThunk(fetchAllAnnouncements, undefined);

  usePreparedEffect('fetchAllAnnouncements', () => dispatch(fetch), []);

  const announcements = useAppSelector((state) => selectAnnouncements(state));
  const actionGrant = useAppSelector(
    (state) => state.announcements.actionGrant,
  );

  if (fetching) {
    return <LoadingPage loading />;
  }

  const title = 'Kunngjøringer';

  return (
    <Page title={title}>
      <Helmet title={title} />
      <Flex column gap="var(--spacing-md)">
        {actionGrant.includes('create') && <AnnouncementsCreate />}

        {actionGrant.includes('list') && actionGrant.includes('delete') && (
          <div>
            <h2>Dine kunngjøringer</h2>
            {announcements.length === 0 ? (
              <EmptyState body="Du har ingen tidligere kunngjøringer" />
            ) : (
              <Flex column gap="var(--spacing-sm)" className={styles.list}>
                {announcements.map((a, i) => (
                  <AnnouncementItem
                    key={i}
                    announcement={a}
                    actionGrant={actionGrant}
                  />
                ))}
              </Flex>
            )}
          </div>
        )}
      </Flex>
    </Page>
  );
};

export default AnnouncementsList;
