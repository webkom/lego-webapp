import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteEvent } from 'app/actions/EventActions';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import { useAppDispatch } from 'app/store/hooks';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type { AuthUserDetailedEvent } from 'app/store/models/Event';

type ButtonProps = {
  eventId: ID;
  title: string;
};

const DeleteButton = ({ eventId, title }: ButtonProps) => {
  const [eventName, setEventName] = useState('');
  const [show, setShow] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  let deleteEventButton;

  if (eventName === title) {
    deleteEventButton = (
      <ConfirmModal
        title="Slett arrangement"
        message="Er du sikker på at du vil slette dette arrangementet?"
        onConfirm={() =>
          dispatch(deleteEvent(eventId)).then(() => {
            navigate('/events');
          })
        }
      >
        {({ openConfirmModal }) => (
          <Button onClick={openConfirmModal} danger>
            <Icon name="trash" size={19} />
            Slett
          </Button>
        )}
      </ConfirmModal>
    );
  }

  return (
    <div>
      {show === false && (
        <Button danger onClick={() => setShow(true)}>
          <Icon name="trash" size={19} />
          Slett arrangement
        </Button>
      )}
      {show && (
        <>
          <span>Skriv inn navnet på arrangementet du vil slette:</span>
          <input
            type="text"
            id="slettArrangement"
            placeholder="Arrangementnavn"
            onChange={(e) => setEventName(e.target.value)}
          />{' '}
          <br />
          {deleteEventButton}
        </>
      )}
    </div>
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
      moment.duration(moment(event.startTime).diff(moment.now())).get('days')
    ) < 1;

  return (
    <Flex column gap={7}>
      {(canEdit || canDelete) && (
        <>
          <h3>Admin</h3>

          {showRegisterButton && (
            <Link to={`/events/${event.id}/administrate/abacard`}>
              <Button success>
                <Icon name="id-card" size={19} />
                Registrer oppmøte
              </Button>
            </Link>
          )}

          {canEdit && (
            <Link to={`/events/${event.id}/administrate/attendees`}>
              <Button>
                <Icon name="people-outline" size={19} />
                Se påmeldinger
              </Button>
            </Link>
          )}

          {canEdit && (
            <Link to={`/events/${event.slug}/edit`}>
              <Button>
                <Icon name="create-outline" size={19} />
                Rediger
              </Button>
            </Link>
          )}

          <AnnouncementInLine event={event} />

          {event.survey ? (
            <Link to={`/surveys/${event.survey}`}>
              <Button>
                <Icon name="clipboard-outline" size={19} />
                Gå til spørreundersøkelse
              </Button>
            </Link>
          ) : (
            <Link to={`/surveys/add/?event=${event.id}`}>
              <Button>
                <Icon name="clipboard-outline" size={19} />
                Lag spørreundersøkelse
              </Button>
            </Link>
          )}

          <Link
            to={{
              pathname: `/events/create`,
              state: {
                id: event.id,
              },
            }}
          >
            <Button>
              <Icon name="copy-outline" size={19} />
              Lag kopi av arrangement
            </Button>
          </Link>

          {canDelete && <DeleteButton eventId={event.id} title={event.title} />}
        </>
      )}
    </Flex>
  );
};

export default Admin;
