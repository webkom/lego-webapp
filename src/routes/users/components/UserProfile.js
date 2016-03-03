import React, { Component, PropTypes } from 'react';
import { capitalize } from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import { Link } from 'react-router';

const fieldTranslations = {
  username: 'brukernavn',
  email: 'epost'
};

export default class UserProfile extends Component {
  static propTypes = {
    user: PropTypes.object,
    isMe: PropTypes.bool.isRequired
  };

  renderFields() {
    const { user } = this.props;
    const fields = Object.keys(fieldTranslations).filter(field => user[field]);
    const tags = fields.map(field => {
      const translation = capitalize(fieldTranslations[field]);
      return (
        <li key={field}>
          <strong>{translation}:</strong> {user[field]}
        </li>
      );
    });

    return (
      <ul>
        {tags}
      </ul>
    );
  }

  renderProfile() {
    const { user, isMe } = this.props;

    return (
      <section className='u-container'>
        <h2>{user.fullName}</h2>
        <img src={`http://api.adorable.io/avatars/${user.username}.png`}></img>
        <br/>
        {isMe ? <Link to='/users/me/settings'>Settings</Link> : ''}

        <div>
          {this.renderFields()}
        </div>
      </section>
    );
  }

  render() {
    return (
      <LoadingIndicator loading={!this.props.user}>
        {this.props.user && this.renderProfile()}
      </LoadingIndicator>
    );
  }
}
