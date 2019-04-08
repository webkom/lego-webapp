// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import type { ID, Event, ActionGrant } from 'app/models';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './Admin.css';

type Props = {
  deleteEvent: (eventId: ID) => Promise<*>,
  event: Event,
  actionGrant: ActionGrant
};

type ButtonProps = {
  deleteEvent: (eventId: ID) => Promise<*>,
  eventId: number,
  title: string
};

type State = {
  arrName: string,
  show: boolean
};

class DeleteButton extends React.Component<ButtonProps, State> {
  state = {
    arrName: '',
    show: false
  };
  render() {
    const { deleteEvent, eventId, title } = this.props;
    let deleteEventButton;

    if (this.state.arrName === title) {
      deleteEventButton = (
        <ConfirmModalWithParent
          title="Slett arrangement"
          message="Er du sikker på at du vil slette dette arrangementet?"
          onConfirm={() => deleteEvent(eventId)}
        >
          <span className={styles.deleteButton}>Slett</span>
        </ConfirmModalWithParent>
      );
    }

    return (
      <div>
        {this.state.show === false && (
          <span
            className={styles.deleteButton}
            onClick={() => this.setState({ show: true })}
          >
            Slett
          </span>
        )}
        {this.state.show && (
          <>
            <span> Skriv inn navnet på arrangementet du vil slette: </span>
            <input
              type="text"
              id="slettArrangement"
              placeholder="Arrangementnavn"
              onChange={e => this.setState({ arrName: e.target.value })}
            />{' '}
            <br />
            {deleteEventButton}
          </>
        )}
      </div>
    );
  }
}

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
            {event.survey ? (
              <Link to={`/surveys/${event.survey}`}>
                Gå til spørreundersøkelse
              </Link>
            ) : (
              <Link to={`/surveys/add/?event=${event.id}`}>
                Lag spørreundersøkelse
              </Link>
            )}
          </li>
          <li>
            <Link
              to={{
                pathname: `/events/create`,
                query: { id: event.id }
              }}
            >
              Lag kopi av arrangement
            </Link>
          </li>
          {canEdit && (
            <li>
              <Link to={`/events/${event.id}/edit`}>Rediger</Link>
            </li>
          )}
          {canDelete && (
            <li>
              <DeleteButton
                eventId={event.id}
                title={event.title}
                deleteEvent={deleteEvent}
              />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Admin;
