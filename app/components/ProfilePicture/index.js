// @flow

import React from 'react';
import Image from 'app/components/Image';

type Props = {
  user: any,
  size: number,
  style?: Object
};

export function CircularPicture({ src, size = 100, style, ...props }) {
  return (
    <Image
      src={src}
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
