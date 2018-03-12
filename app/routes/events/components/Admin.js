// @flow

import React from 'react';
import { Link } from 'react-router';
import type { ID, Event, ActionGrant } from 'app/models';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './Admin.css';

type Props = {
  deleteEvent: (eventId: ID) => Promise<*>,
  event: Event,
  actionGrant: ActionGrant
};

const DeleteButton = ({
  deleteEvent,
  eventId
}: {
  deleteEvent: (eventId: ID) => Promise<*>,
  eventId: ID
}) => (
  <ConfirmModalWithParent
    title="Slett arrangement"
    message="Er du sikker på at du vil slette dette arrangementet?"
    onConfirm={() => deleteEvent(eventId)}
  >
    <span className={styles.deleteButton}>Slett</span>
  </ConfirmModalWithParent>
);

const Admin = ({ actionGrant, event, deleteEvent }: Props) => {
  const canEdit = actionGrant.includes('edit');
  const canDelete = actionGrant.includes('delete');
  return (
    <div style={{ marginTop: '10px' }}>
      {(canEdit || canDelete) && (
        <ul>
          <li>
            <strong>Admin</strong>
          </li>
          {canEdit && (
            <li>
              <Link to={`/events/${event.id}/administrate/attendees`}>
                Påmeldinger
              </Link>
            </li>
          )}
          <li>
            <AnnouncementInLine
              placeholder="Skriv en kunngjøring til alle påmeldte..."
              event={event.id}
            />
          </li>
          <li>
            <Link to={`/surveys/add/?event=${event.id}`}>
              Lag spørreundersøkelse
            </Link>
          </li>
          {canEdit && (
            <li>
              <Link to={`/events/${event.id}/edit`}>Rediger</Link>
            </li>
          )}
          {canDelete && (
            <li>
              <DeleteButton eventId={event.id} deleteEvent={deleteEvent} />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Admin;
