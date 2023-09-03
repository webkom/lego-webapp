import { Flex } from '@webkom/lego-bricks';
import { Content, ContentMain } from 'app/components/Content';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type {
  DetailedAnnouncement,
  ListAnnouncement,
} from 'app/store/models/Announcement';
import AnnouncementItem from './AnnouncementItem';
import AnnouncementsCreate from './AnnouncementsCreate';
import styles from './AnnouncementsList.css';

type Props = {
  announcements: Array<ListAnnouncement>;
  actionGrant: ActionGrant;
  sendAnnouncement: (id: ID) => Promise<unknown>;
  createAnnouncement: (
    announcement: DetailedAnnouncement & { send: boolean }
  ) => Promise<unknown>;
  deleteAnnouncement: (id: ID) => Promise<unknown>;
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
  invalid: string;
  pristine: string;
  submitting: string;
};

const AnnouncementsList = ({
  createAnnouncement,
  sendAnnouncement,
  deleteAnnouncement,
  announcements,
  actionGrant,
  handleSubmit,
  invalid,
  pristine,
  submitting,
}: Props) => {
  return (
    <Content>
      <AnnouncementsCreate
        createAnnouncement={createAnnouncement}
        actionGrant={actionGrant}
      />
      {actionGrant.includes('list') && actionGrant.includes('delete') && (
        <ContentMain>
          <h1> Dine kunngjøringer </h1>
          <Flex column className={styles.list}>
            {announcements.map((a, i) => (
              <AnnouncementItem
                key={i}
                announcement={a}
                sendAnnouncement={sendAnnouncement}
                deleteAnnouncement={deleteAnnouncement}
                actionGrant={actionGrant}
              />
            ))}
          </Flex>
        </ContentMain>
      )}
    </Content>
  );
};

export default AnnouncementsList;
