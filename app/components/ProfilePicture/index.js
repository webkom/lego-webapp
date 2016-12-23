// @flow

import React from 'react';
import Image from 'app/components/Image';

type Props = {
  user: number,
  size: number,
  style?: Object
};

function ProfilePicture({ user, size = 100, style, ...props }: Props) {
  const userNumber = (user - 1) % 10;
  return (
    <Image
      src={`https://api.randomuser.me/portraits/lego/${userNumber}.jpg`}
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
