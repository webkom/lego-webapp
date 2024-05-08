import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LinkButton,
} from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEvent } from 'app/actions/EventActions';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import { TextInput } from 'app/components/Form';
import { useAppDispatch } from 'app/store/hooks';
import styles from './Admin.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { AuthUserDetailedEvent } from 'app/store/models/Event';

type ButtonProps = {
  eventId: EntityId;
  title: string;
};

const DeleteButton = ({ eventId, title }: ButtonProps) => {
  const [eventName, setEventName] = useState('');
  const [show, setShow] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <>
      {!show ? (
        <Button danger onPress={() => setShow(true)}>
          <Icon name="trash" size={19} />
          Slett arrangement
        </Button>
      ) : (
        <>
          <label htmlFor="delete-event">
            Skriv inn navnet på arrangementet du vil slette
          </label>
          <TextInput
            id="delete-event"
            type="text"
            prefix="warning"
            placeholder="Arrangementnavn"
            onChange={(e) => setEventName(e.target.value)}
          />

          {eventName === title && (
            <ConfirmModal
              title="Slett arrangement"
              message="Er du helt sikker på at du vil slette dette arrangementet?"
              onConfirm={() =>
                dispatch(deleteEvent(eventId)).then(() => {
                  navigate('/events');
                })
              }
            >
              {({ openConfirmModal }) => (
                <Button onPress={openConfirmModal} danger>
                  <Icon name="trash" size={19} />
                  Slett
                </Button>
              )}
            </ConfirmModal>
          )}
        </>
      )}
    </>
  );
};

type Props = {
  event: AuthUserDetailedEvent;
  actionGrant: ActionGrant;
};

const Admin = ({ actionGrant, event }: Props) => {
  const canEdit = actionGrant.includes('edit');
  const canDelete = actionGrant.includes('delete');
  const showRegisterButton =
    Math.abs(
      moment.duration(moment(event.startTime).diff(moment.now())).get('days'),
    ) < 1;

  return (
    <Flex column gap="0.5rem" className={styles.admin}>
      {(canEdit || canDelete) && (
        <>
          <h3>Admin</h3>

          {showRegisterButton && (
            <LinkButton
              success
              href={`/events/${event.id}/administrate/abacard`}
            >
              <Icon name="id-card" size={19} />
              Registrer oppmøte
            </LinkButton>
          )}

          {canEdit && (
            <LinkButton href={`/events/${event.id}/administrate/attendees`}>
              <Icon name="people-outline" size={19} />
              Se påmeldinger
            </LinkButton>
          )}

          {canEdit && (
            <LinkButton href={`/events/${event.slug}/edit`}>
              <Icon name="create-outline" size={19} />
              Rediger
            </LinkButton>
          )}

          <AnnouncementInLine event={event} />

          {event.survey ? (
            <LinkButton href={`/surveys/${event.survey}`}>
              <Icon name="clipboard-outline" size={19} />
              Gå til spørreundersøkelse
            </LinkButton>
          ) : (
            <LinkButton href={`/surveys/add/?event=${event.id}`}>
              <Icon name="clipboard-outline" size={19} />
              Lag spørreundersøkelse
            </LinkButton>
          )}

          <LinkButton href="/events/create" state={{ id: event.id }}>
            <Icon name="copy-outline" size={19} />
            Lag kopi av arrangement
          </LinkButton>

          {canDelete && <DeleteButton eventId={event.id} title={event.title} />}
        </>
      )}
    </Flex>
  );
};

export default Admin;
