import { Button, ButtonGroup, Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import Time from '~/components/Time';
import {
  deleteAnnouncement,
  sendAnnouncement,
} from '~/redux/actions/AnnouncementsActions';
import { useAppDispatch } from '~/redux/hooks';
import { statusesText } from '~/redux/slices/meetingInvitations';
import styles from './AnnouncementsList.module.css';
import type { ActionGrant } from 'app/models';
import type { DetailedAnnouncement } from '~/redux/models/Announcement';

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
      <Flex column gap="var(--spacing-sm)">
        <Flex className={styles.date}>
          {announcement.sent ? (
            <Time time={announcement.sent} format="ll HH:mm" />
          ) : (
            'Ikke sendt'
          )}
        </Flex>
        <Flex>{announcement.message}</Flex>
        {announcement.fromGroup && (
          <Flex wrap>
            {'Sendt fra: '}
            <a
              className={styles.recipients}
              href={`/admin/groups/${announcement.fromGroup.id}/`}
            >
              {announcement.fromGroup.name}
            </a>
          </Flex>
        )}
        <Flex column>
          <b>Mottakere</b>
          <Flex alignItems="center" gap="var(--spacing-sm)" wrap>
            {announcement.events.length > 0 && (
              <span>
                Arrangementer
                {announcement.excludeWaitingList
                  ? ' (ekskludert venteliste): '
                  : ': '}
              </span>
            )}
            {announcement.events.map((event, i) => (
              <a
                key={i}
                className={styles.recipients}
                href={`/events/${event.slug}/`}
              >
                {event.title}
              </a>
            ))}
          </Flex>
          <Flex alignItems="center" gap="var(--spacing-sm)" wrap>
            {announcement.meetings.length > 0 && (
              <span>
                Møter
                {announcement.meetingInvitationStatus
                  ? ` (${statusesText[
                      announcement.meetingInvitationStatus
                    ].toLowerCase()}) :`
                  : ': '}
              </span>
            )}
            {announcement.meetings.map((meeting, i) => (
              <a
                key={i}
                className={styles.recipients}
                href={`/meetings/${meeting.id}/`}
              >
                {meeting.title}
              </a>
            ))}
          </Flex>
          <Flex alignItems="center" wrap>
            {announcement.groups.length > 0 && 'Grupper: '}
            {announcement.groups.map((group, i) => (
              <a
                key={i}
                className={styles.recipients}
                href={`/admin/groups/${group.id}/`}
              >
                {group.name}
              </a>
            ))}
          </Flex>
          <Flex alignItems="center" wrap>
            {announcement.users.length > 0 && 'Brukere: '}
            {announcement.users.map((user, i) => (
              <a
                key={i}
                className={styles.recipients}
                href={`/users/${user.username}/`}
              >
                {user.fullName}
              </a>
            ))}
          </Flex>
        </Flex>
      </Flex>
      {!announcement.sent && (
        <ButtonGroup className={styles.wrapperSendButton}>
          {actionGrant.includes('delete') && (
            <Button
              danger
              disabled={deleting}
              onPress={async () => {
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
              secondary
              disabled={sending}
              onPress={async () => {
                setSending(true);
                await dispatch(sendAnnouncement(announcement.id));
                setSending(false);
              }}
            >
              Send
            </Button>
          )}
        </ButtonGroup>
      )}
    </Flex>
  );
};

export default AnnouncementItem;
