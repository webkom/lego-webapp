import React, { Component, PropTypes } from 'react';
import LoadingIndicator from './ui/LoadingIndicator';
import { Link } from 'react-router';

const Group = ({ group }) => (
  <section className='content event-page'>
    <h2>{group.name}</h2>
    <p>{group.description}</p>
    <h4>Permissions:</h4>
    <ul>
      {group.permissions && group.permissions.length ?
        group.permissions.map((p, i) => <li key={i}>{p}</li>) :
        <div>Powerless</div>
      }
    </ul>
    <h4>Users:</h4>
    <ul>
      {group.users && group.users.length ?
        group.users.map(username => <li key={username}> <Link to={`/users/${username}`}> {username} </Link> </li>) :
        <div>No users</div>
      }
    </ul>
  </section>
);

export default class EventPage extends Component {
  static propTypes = {
    group: PropTypes.object
  }

  render() {
    const { group } = this.props;
    return (
      <section>
        <LoadingIndicator loading={!group}>
          <div>
            {group && <Group {...this.props} />}
          </div>
        </LoadingIndicator>
      </section>
    );
  }
}
