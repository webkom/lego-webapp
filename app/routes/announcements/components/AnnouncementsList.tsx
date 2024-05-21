import { Flex, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/AnnouncementsActions';
import { selectAnnouncements } from 'app/reducers/announcements';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import AnnouncementItem from './AnnouncementItem';
import AnnouncementsCreate from './AnnouncementsCreate';
import styles from './AnnouncementsList.css';

const AnnouncementsList = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect('fetchAllAnnouncements', () => dispatch(fetchAll()), []);

  const announcements = useAppSelector((state) => selectAnnouncements(state));
  const fetching = useAppSelector((state) => state.announcements.fetching);
  const actionGrant = useAppSelector(
    (state) => state.announcements.actionGrant,
  );

  return (
    <Page title="Send kunngjøringer">
      <LoadingIndicator loading={fetching}>
        {actionGrant.includes('create') && <AnnouncementsCreate />}

        {actionGrant.includes('list') && actionGrant.includes('delete') && (
          <>
            <h2>Dine kunngjøringer</h2>
            {announcements.length === 0 ? (
              <span className="secondaryFontColor">
                Du har ingen tidligere kunngjøringer
              </span>
            ) : (
              <Flex column className={styles.list}>
                {announcements.map((a, i) => (
                  <AnnouncementItem
                    key={i}
                    announcement={a}
                    actionGrant={actionGrant}
                  />
                ))}
              </Flex>
            )}
          </>
        )}
      </LoadingIndicator>
    </Page>
  );
};

export default AnnouncementsList;
