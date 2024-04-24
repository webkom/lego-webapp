import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchAllAnnouncements } from 'app/actions/AnnouncementsActions';
import { useApiThunk } from 'app/actions/createApiThunk/useApiThunk';
import { Content } from 'app/components/Content';
import { selectAnnouncements } from 'app/reducers/announcements';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import AnnouncementItem from './AnnouncementItem';
import AnnouncementsCreate from './AnnouncementsCreate';
import styles from './AnnouncementsList.css';

const AnnouncementsList = () => {
  const dispatch = useAppDispatch();
  const { fetch, fetching, entities } = useApiThunk(
    fetchAllAnnouncements,
    undefined,
  );

  usePreparedEffect('fetchAllAnnouncements', () => dispatch(fetch), []);

  const announcements = useAppSelector((state) => selectAnnouncements(state));
  const actionGrant = useAppSelector(
    (state) => state.announcements.actionGrant,
  );

  return (
    <Content>
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
    </Content>
  );
};

export default AnnouncementsList;
