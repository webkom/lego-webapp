import {
  Button,
  ButtonGroup,
  ConfirmModal,
  Icon,
  LinkButton,
} from '@webkom/lego-bricks';
import {
  Copy,
  UserCog,
  FilePieChart,
  Pencil,
  Trash2,
  Contact,
} from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import AnnouncementInLine from '~/components/AnnouncementInLine';
import { TextInput } from '~/components/Form';
import { deleteEvent } from '~/redux/actions/EventActions';
import { useAppDispatch } from '~/redux/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { CompleteEvent } from '~/redux/models/Event';

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
          <Icon iconNode={<Trash2 />} size={19} />
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
                  <Icon iconNode={<Trash2 />} size={19} />
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
  event: Pick<CompleteEvent, 'id' | 'slug' | 'title' | 'startTime' | 'survey'>;
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
    (canEdit || canDelete) && (
      <div>
        <h3>Admin</h3>

        <ButtonGroup vertical>
          {showRegisterButton && (
            <LinkButton
              success
              href={`/events/${event.id}/administrate/abacard`}
            >
              <Icon iconNode={<Contact />} size={19} />
              Registrer oppmøte
            </LinkButton>
          )}

          {canEdit && (
            <LinkButton href={`/events/${event.id}/administrate/attendees`}>
              <Icon iconNode={<UserCog />} size={19} />
              Administrer
            </LinkButton>
          )}

          {canEdit && (
            <LinkButton href={`/events/${event.slug}/edit`}>
              <Icon iconNode={<Pencil />} size={19} />
              Rediger
            </LinkButton>
          )}

          <AnnouncementInLine event={event} />

          {event.survey ? (
            <LinkButton href={`/surveys/${event.survey}`}>
              <Icon iconNode={<FilePieChart />} size={19} />
              Gå til spørreundersøkelse
            </LinkButton>
          ) : (
            <LinkButton href={`/surveys/add/?event=${event.id}`}>
              <Icon iconNode={<FilePieChart />} size={19} />
              Lag spørreundersøkelse
            </LinkButton>
          )}

          <LinkButton href="/events/create" state={{ id: event.id }}>
            <Icon iconNode={<Copy />} size={19} />
            Lag kopi av arrangement
          </LinkButton>

          {canDelete && <DeleteButton eventId={event.id} title={event.title} />}
        </ButtonGroup>
      </div>
    )
  );
};

export default Admin;
