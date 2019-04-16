import React from 'react';
import CircularPicture from './CircularPicture';

interface Props {
  user: any;
  size: number;
  style?: Object;
}

function ProfilePicture({ user, size = 100, style, ...props }: Props) {
  return (
    <CircularPicture
      src={user.profilePicture}
      size={size}
      style={style}
      {...props}
    />
  );
}

export default ProfilePicture;
