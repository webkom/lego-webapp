import { Button, Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  deleteAnnouncement,
  sendAnnouncement,
} from 'app/actions/AnnouncementsActions';
import Time from 'app/components/Time';
import { useAppDispatch } from 'app/store/hooks';
import styles from './AnnouncementsList.css';
import type { ActionGrant } from 'app/models';
import type { DetailedAnnouncement } from 'app/store/models/Announcement';

type Props = {
  announcement: DetailedAnnouncement;
  actionGrant: ActionGrant;
};

const AnnouncementItem = ({ announcement, actionGrant }: Props) => {
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <Flex className={styles.item}>
      <Flex column>
        <Flex className={styles.date}>
          {announcement.sent ? (
            <Time time={announcement.sent} format="ll HH:mm" />
          ) : (
            'Ikke sendt'
          )}
        </Flex>
        <Flex className={styles.msg}>{announcement.message}</Flex>
        {announcement.fromGroup && (
          <Flex wrap>
            {'Sendt fra: '}
            <Link
              className={styles.recipients}
              to={`/admin/groups/${announcement.fromGroup.id}/`}
            >
              {announcement.fromGroup.name}
            </Link>
          </Flex>
        )}
        <Flex column>
          <span className={styles.recHeader}>Mottakere:</span>
          <Flex wrap>
            {announcement.events.length > 0 && 'Arrangementer: '}
            {announcement.events.map((event, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/events/${event.slug}/`}
              >
                {event.title}
              </Link>
            ))}
          </Flex>
          <Flex wrap>
            {announcement.meetings.length > 0 && 'Møter: '}
            {announcement.meetings.map((meeting, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/meetings/${meeting.id}/`}
              >
                {meeting.title}
              </Link>
            ))}
          </Flex>
          <Flex wrap>
            {announcement.groups.length > 0 && 'Grupper: '}
            {announcement.groups.map((group, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/admin/groups/${group.id}/`}
              >
                {group.name}
              </Link>
            ))}
          </Flex>
          <Flex wrap>
            {announcement.users.length > 0 && 'Brukere: '}
            {announcement.users.map((user, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/users/${user.username}/`}
              >
                {user.fullName}
              </Link>
            ))}
          </Flex>
        </Flex>
      </Flex>
      {!announcement.sent && (
        <Flex className={styles.wrapperSendButton}>
          {actionGrant.includes('delete') && (
            <Button
              danger
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                await dispatch(deleteAnnouncement(announcement.id));
                setDeleting(false);
              }}
            >
              Slett
            </Button>
          )}
          {actionGrant.includes('send') && (
            <Button
              disabled={sending}
              onClick={async () => {
                setSending(true);
                await dispatch(sendAnnouncement(announcement.id));
                setSending(false);
              }}
            >
              Send
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default AnnouncementItem;
