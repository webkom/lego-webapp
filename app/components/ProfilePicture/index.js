// @flow

import React from 'react';

type Props = {
  username: string,
  size: number,
  style?: Object
};

function ProfilePicture({ username, size = 100, style, ...props }: Props) {
  return (
    <img
      src={`http://api.adorable.io/avatars/${username}.png`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        ...style
      }}
      {...props}
    />
  );
}

export default ProfilePicture;
