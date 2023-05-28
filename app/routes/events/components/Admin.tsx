import { Button } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import type { ID, Event, ActionGrant } from 'app/models';

type Props = {
  deleteEvent: (eventId: ID) => Promise<any>;
  event: Event;
  actionGrant: ActionGrant;
};
type ButtonProps = {
  deleteEvent: (eventId: ID) => Promise<any>;
  eventId: number;
  title: string;
};
type State = {
  arrName: string;
  show: boolean;
};

class DeleteButton extends Component<ButtonProps, State> {
  state = {
    arrName: '',
    show: false,
  };

  render() {
    const { deleteEvent, eventId, title } = this.props;
    let deleteEventButton;

    if (this.state.arrName === title) {
      deleteEventButton = (
        <ConfirmModal
          title="Slett arrangement"
          message="Er du sikker på at du vil slette dette arrangementet?"
          onConfirm={() => deleteEvent(eventId)}
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
        {this.state.show === false && (
          <Button
            danger
            onClick={() =>
              this.setState({
                show: true,
              })
            }
          >
            <Icon name="trash" size={19} />
            Slett arrangement
          </Button>
        )}
        {this.state.show && (
          <>
            <span> Skriv inn navnet på arrangementet du vil slette: </span>
            <input
              type="text"
              id="slettArrangement"
              placeholder="Arrangementnavn"
              onChange={(e) =>
                this.setState({
                  arrName: e.target.value,
                })
              }
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
            <Link to={`/events/${event.id}/edit`}>
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

          {canDelete && (
            <DeleteButton
              eventId={event.id}
              title={event.title}
              deleteEvent={deleteEvent}
            />
          )}
        </>
      )}
    </Flex>
  );
};

export default Admin;
