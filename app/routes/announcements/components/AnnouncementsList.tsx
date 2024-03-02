import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/AnnouncementsActions';
import { Content, ContentMain } from 'app/components/Content';
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
    <LoadingIndicator loading={fetching}>
      <Content>
        <AnnouncementsCreate actionGrant={actionGrant} />

        {actionGrant.includes('list') && actionGrant.includes('delete') && (
          <ContentMain>
            <h1>Dine kunngjøringer</h1>
            <Flex column className={styles.list}>
              {announcements.map((a, i) => (
                <AnnouncementItem
                  key={i}
                  announcement={a}
                  actionGrant={actionGrant}
                />
              ))}
            </Flex>
          </ContentMain>
        )}
      </Content>
    </LoadingIndicator>
  );
};

export default AnnouncementsList;
