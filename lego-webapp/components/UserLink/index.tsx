import { Flex } from '@webkom/lego-bricks';
import { ProfilePicture } from '../Image';
import type { UnknownUser } from '~/redux/models/User';

type UserLinkProps = {
  user: Pick<
    UnknownUser,
    'profilePicture' | 'username' | 'profilePicturePlaceholder' | 'fullName'
  >;
};

const UserLink = ({ user }: UserLinkProps) => {
  return (
    <Flex wrap alignItems="center" gap="var(--spacing-sm)">
      <ProfilePicture size={24} user={user} />
      <a href={`/users/${user.username}`}>{user.fullName}</a>
    </Flex>
  );
};

export default UserLink;
