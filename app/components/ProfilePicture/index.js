// @flow

import React from 'react';
import Image from 'app/components/Image';

type Props = {
  user: number,
  size: number,
  style?: Object
};

function ProfilePicture({ user, size = 100, style, ...props }: Props) {
  return (
    <Image
      src={user.picture}
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
