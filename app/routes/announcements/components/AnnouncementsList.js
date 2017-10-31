// @flow

import React from 'react';
import Helmet from 'react-helmet';
import styles from './AnnouncementsList.css';
import Flex from 'app/components/Layout/Flex';
import AnnouncementItem from './AnnouncementItem';
import AnnouncementsCreate from './AnnouncementsCreate';
import { Content } from 'app/components/Layout';

type Props = {
  announcement: Object,
  announcements: Array</*TODO: Announcement */ any>,
  actionGrant: /* TODO: ActionGrant */ any,
  sendAnnouncement: () => void,
  createAnnouncement: (announcement: any) => void,
  deleteAnnouncement: () => void,
  handleSubmit: /*SubmitHandler<>*/ any => void,
  invalid: string,
  pristine: string,
  submitting: string
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
  submitting
}: Props) => {
  return (
    <Content>
      <Helmet title="Kunngjøringer" />
      <AnnouncementsCreate
        createAnnouncement={createAnnouncement}
        actionGrant={actionGrant}
      />
      {actionGrant.includes('list') &&
        actionGrant.includes('delete') && (
          <Flex column>
            <h1 className={styles.header}> Mine kunngjøringer </h1>
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
          </Flex>
        )}
    </Content>
  );
};

export default AnnouncementsList;
