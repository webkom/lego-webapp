// @flow

import { type User } from 'app/models';
import CircularPicture from './CircularPicture';

type Props = {
  user: User,
  alt: string,
  size: number,
  style?: Object,
};

const ProfilePicture = ({ alt, user, size = 100, style, ...props }: Props) => (
  <CircularPicture
    alt={alt}
    src={user.profilePicture}
    placeholder={user.profilePicturePlaceholder}
    size={size}
    style={style}
    {...(props: Object)}
  />
);

export default ProfilePicture;
