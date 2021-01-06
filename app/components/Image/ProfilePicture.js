// @flow

import CircularPicture from './CircularPicture';

type Props = {
  user: any,
  alt: string,
  size: number,
  style?: Object,
};

const ProfilePicture = ({ alt, user, size = 100, style, ...props }: Props) => (
  <CircularPicture
    alt={alt}
    src={user.profilePicture}
    size={size}
    style={style}
    {...(props: Object)}
  />
);

export default ProfilePicture;
