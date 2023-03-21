import type { User } from 'app/models';
import CircularPicture from './CircularPicture';
import type { ComponentProps } from 'react';

type Props = Omit<
  {
    user: Pick<
      User,
      'profilePicture' | 'username' | 'profilePicturePlaceholder'
    >;
    size: number;
    className?: string;
  } & ComponentProps<typeof CircularPicture>,
  'placeholder' | 'src'
>;

const ProfilePicture = ({
  user,
  size = 100,
  className,
  style,
  ...props
}: Props) => (
  <CircularPicture
    alt={`${user.username}'s profile picture`}
    src={user.profilePicture}
    placeholder={user.profilePicturePlaceholder}
    size={size}
    className={className}
    style={style}
    {...props}
  />
);

export default ProfilePicture;
