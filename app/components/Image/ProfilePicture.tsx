import type { UserEntity } from 'app/reducers/users';
import CircularPicture from './CircularPicture';

type Props = {
  user: UserEntity;
  alt: string;
  size: number;
  style?: Record<string, string>;
};

const ProfilePicture = ({ alt, user, size = 100, style, ...props }: Props) => (
  <CircularPicture
    alt={alt}
    src={user.profilePicture}
    placeholder={user.profilePicturePlaceholder}
    size={size}
    style={style}
    {...props}
  />
);

export default ProfilePicture;
