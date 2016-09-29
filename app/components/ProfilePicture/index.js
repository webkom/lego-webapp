// @flow

import React from 'react';

type Props = {
  user: number,
  size: number,
  style?: Object
};

function ProfilePicture({ user, size = 100, style, ...props }: Props) {
  return (
    <img
      src={`http://api.randomuser.me/portraits/men/${user}.jpg`}
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
