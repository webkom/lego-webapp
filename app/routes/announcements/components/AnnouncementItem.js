// @flow

import React from 'react';
import styles from './AnnouncementsList.css';
import Flex from 'app/components/Layout/Flex';
import Button from 'app/components/Button';
import { Link } from 'react-router';
import Time from 'app/components/Time';

type Props = {
  announcement: Object,
  sendAnnouncement: () => void,
  deleteAnnouncement: () => void,
  actionGrant: Array<string>
};

const AnnouncementItem = ({
  announcement,
  sendAnnouncement,
  deleteAnnouncement,
  actionGrant
}: Props) => {
  return (
    <Flex padding="10px 0" justifyContent="space-between">
      <Flex column>
        <Flex className={styles.date}>
          {announcement.sent ? (
            <Time time={announcement.sent} format="ll HH:mm" />
          ) : (
            'Ikke sendt'
          )}
        </Flex>
        <Flex className={styles.msg}>{announcement.message}</Flex>
        <Flex column>
          <span className={styles.recHeader}>Mottakere:</span>
          <Flex wrap>
            {announcement.events.length > 0 && 'Arrangementer: '}
            {announcement.events.map((event, i) => (
              <Link
                key={i}
                className={styles.recipients}
                to={`/events/${event.id}/`}
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
                to={`/groups/${group.id}/`}
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
      {!announcement.sent &&
        actionGrant.includes('send') && (
          <Flex className={styles.wrapperSendButton}>
            <Button
              className={styles.sendButton}
              onClick={() => deleteAnnouncement(announcement.id)}
            >
              Slett
            </Button>
            <Button
              className={styles.sendButton}
              onClick={() => sendAnnouncement(announcement.id)}
            >
              Send
            </Button>
          </Flex>
        )}
    </Flex>
  );
};

export default AnnouncementItem;
