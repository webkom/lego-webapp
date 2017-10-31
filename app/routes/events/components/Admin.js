// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import type { ID, Event, ActionGrant } from 'app/models';
import AnnouncementInLine from 'app/components/AnnouncementInLine';

type Props = {
  deleteEvent: (eventId: ID) => mixed,
  event: Event,
  actionGrant: ActionGrant
};

type State = {
  verifyDelete: boolean
};

export default class Admin extends Component<Props, State> {
  state = {
    verifyDelete: false
  };

  handleDelete = (eventId: number) => {
    if (this.state.verifyDelete) {
      this.props.deleteEvent(eventId);
    }
    this.setState({
      verifyDelete: true
    });
  };

  render() {
    const { actionGrant, event } = this.props;
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
                <Link to={`/events/${event.id}/administrate`}>Påmeldinger</Link>
              </li>
            )}
            <li>
              <AnnouncementInLine
                placeholder="Skriv en kunngjøring til alle påmeldte..."
                event={event.id}
              />
            </li>
            {canEdit && (
              <li>
                <Link to={`/events/${event.id}/edit`}>Rediger</Link>
              </li>
            )}
            {canDelete && (
              <li>
                <a onClick={() => this.handleDelete(event.id)}>
                  {this.state.verifyDelete ? 'Er du sikker?' : 'Slett'}
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    );
  }
}
