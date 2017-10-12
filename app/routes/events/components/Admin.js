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
    return (
      <div style={{ marginTop: '10px' }}>
        {actionGrant.length > 0 && (
          <ul>
            <li>
              <strong>Admin</strong>
            </li>
            {actionGrant.includes('edit') && (
              <li>
                <Link
                  to={`/events/${event.id}/administrate`}
                  style={{ color: 'inherit' }}
                >
                  Påmeldinger
                </Link>
              </li>
            )}
            {actionGrant.includes('edit') && (
              <li>
                <Link
                  to={`/events/${event.id}/edit`}
                  style={{ color: 'inherit' }}
                >
                  Rediger
                </Link>
              </li>
            )}
            {actionGrant.includes('delete') && (
              <li>
                <a
                  onClick={() => this.handleDelete(event.id)}
                  style={{ color: 'inherit' }}
                >
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
