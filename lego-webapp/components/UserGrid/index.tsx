import { Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router';
import { ProfilePicture } from '~/components/Image';
import Tooltip from '~/components/Tooltip';
import styles from './UserGrid.module.css';
import type { PublicUser } from '~/redux/models/User';

const UserGrid = ({
  users,
  size = 56,
  maxRows = 2,
  minRows = 0,
  padding = 3,
  skeleton = false,
}: {
  users?: PublicUser[];
  size?: number /* profile picture size */;
  maxRows?: number;
  minRows?: number;
  padding?: number;
  skeleton?: boolean;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${
        size + padding
      }px, 1fr))`,
      gridTemplateRows: users?.length === 0 ? 0 : size + padding,
      overflow: 'hidden',
      minHeight: minRows * size + (minRows - 1) * padding + 3.3,
      maxHeight: maxRows * size + (maxRows - 1) * padding + 3.3,
    }}
  >
    {users?.map((user) => <RegisteredUserCell key={user.id} user={user} />)}

    {minRows > 0 && (
      <Skeleton
        array={
          /* Only 15 users are passed into the users prop */
          15 - (users?.length || 0)
        }
        flicker={skeleton}
        className={cx(styles.skeletonCell, styles.cell)}
      />
    )}
  </div>
);

const RegisteredUserCell = ({ user }: { user: PublicUser }) => (
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture size={56} user={user} className={styles.cell} />
    </Link>
  </Tooltip>
);

export default UserGrid;
