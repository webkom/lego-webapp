// @flow

import React from 'react';
import Image from 'app/components/Image';

type Props = {
  user: number,
  size: number,
  style?: Object
};

function ProfilePicture({ user, size = 100, style, ...props }: Props) {
  let imageSrc = user.picture;
  if (!imageSrc) {
    const userNumber = (user.id - 1) % 10;
    imageSrc = `https://api.randomuser.me/portraits/lego/${userNumber}.jpg`;
  }

  return (
    <Image
      src={imageSrc}
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
