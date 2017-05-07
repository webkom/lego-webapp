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
      <div>
        {actionGrant.length > 0 &&
          <ul>
            <li><strong>Admin</strong></li>
            {actionGrant.includes('update') &&
              <li>
                <Link
                  to={`/events/${event.id}/administrate`}
                  style={{ color: 'white' }}
                >
                  Påmeldinger
                </Link>
              </li>}
            {actionGrant.includes('update') &&
              <li>
                <Link
                  to={`/events/${event.id}/edit`}
                  style={{ color: 'white' }}
                >
                  Rediger
                </Link>
              </li>}
            {actionGrant.includes('destroy') &&
              <li>
                <a
                  onClick={() => this.handleDelete(event.id)}
                  style={{ color: 'white' }}
                >
                  {this.state.verifyDelete ? 'Er du sikker?' : 'Slett'}
                </a>
              </li>}
          </ul>}
      </div>
    );
  }
}
