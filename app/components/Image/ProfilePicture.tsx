import CircularPicture from './CircularPicture';
import type { UnknownUser } from 'app/store/models/User';
import type { ComponentProps } from 'react';

type Props = {
  user: Pick<
    UnknownUser,
    'profilePicture' | 'username' | 'profilePicturePlaceholder'
  >;
  size: number;
  className?: string;
  alt?: string;
} & Omit<ComponentProps<typeof CircularPicture>, 'src' | 'alt'>;

const ProfilePicture = ({
  user,
  size = 100,
  className,
  alt = `${user.username}'s profile picture`,
  style,
  ...props
}: Props) => (
  <CircularPicture
    alt={alt}
    src={user.profilePicture}
    placeholder={user.profilePicturePlaceholder}
    size={size}
    className={className}
    style={style}
    {...props}
  />
);

export default ProfilePicture;
