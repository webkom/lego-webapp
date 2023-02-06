import { Content, ContentMain } from 'app/components/Content';
import Flex from 'app/components/Layout/Flex';
import type {
  ActionGrant,
  Announcement,
  CreateAnnouncement,
  ID,
} from 'app/models';
import AnnouncementItem from './AnnouncementItem';
import AnnouncementsCreate from './AnnouncementsCreate';
import styles from './AnnouncementsList.css';

type Props = {
  announcement: Announcement;
  announcements: Array<Announcement>;
  actionGrant: ActionGrant;
  sendAnnouncement: (arg0: ID) => Promise<any>;
  createAnnouncement: (arg0: CreateAnnouncement) => Promise<any>;
  deleteAnnouncement: (arg0: ID) => Promise<any>;
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
