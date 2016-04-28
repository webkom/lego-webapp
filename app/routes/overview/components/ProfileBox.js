import React from 'react';
import Icon from 'app/components/icon';

const ProfileBox = ({ user }) => {
  const avatarName = user ? user.username : 'login';
  const nameOrLogin = user ? `${user.firstName} ${user.lastName}` : 'Logg inn';
  return (
    <div className='Profile'>
      <img className='Profile__avatar' src={`http://api.adorable.io/avatars/70/${avatarName}.png`}></img>
      <div className='Profile__user'>
        <h3>{nameOrLogin}</h3>
        <Icon name='chevron-down' />
      </div>
    </div>
  );
};

export default ProfileBox;
