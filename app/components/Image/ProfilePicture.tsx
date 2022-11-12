import type { UserEntity } from 'app/reducers/users';
import CircularPicture from './CircularPicture';
import type { ComponentProps } from 'react';

type Props = Omit<
  {
    user: UserEntity;
    size: number;
  } & ComponentProps<typeof CircularPicture>,
  'placeholder' | 'src' | 'alt'
>;

const ProfilePicture = ({ user, size = 100, style, ...props }: Props) => (
  <CircularPicture
    alt={`${user.username} profile picture`}
    src={user.profilePicture}
    placeholder={user.profilePicturePlaceholder}
    size={size}
    style={style}
    {...props}
  />
);

export default ProfilePicture;
