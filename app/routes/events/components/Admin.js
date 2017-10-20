import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Admin extends Component {
  state = {
    verifyDelete: false
  };

  handleDelete = (eventId: string) => {
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
