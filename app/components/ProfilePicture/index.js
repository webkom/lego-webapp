// @flow

import React from 'react';

type Props = {
  username: string,
  size: number
};

function ProfilePicture({ username, size = 100 }: Props) {
  return (
    <img
      src={`http://api.adorable.io/avatars/${username}.png`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2
      }}
    />
  );
}

export default ProfilePicture;
