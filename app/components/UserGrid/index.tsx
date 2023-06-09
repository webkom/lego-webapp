import cx from 'classnames';
import { Link } from 'react-router-dom';
import { ProfilePicture } from 'app/components/Image';
import Tooltip from 'app/components/Tooltip';
import type { User } from 'app/models';
import styles from './UserGrid.css';

const UserGrid = ({
  users,
  size = 56,
  maxRows = 2,
  minRows = 0,
  padding = 3,
}: {
  users: User[];

  /* profile picture size */
  size?: number;
  maxRows?: number;
  minRows?: number;
  padding?: number;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${
        size + padding
      }px, 1fr))`,
      gridTemplateRows: users.length === 0 ? 0 : size + padding,
      overflow: 'hidden',
      minHeight: minRows * size + (minRows - 1) * padding + 3.3,
      maxHeight: maxRows * size + (maxRows - 1) * padding + 3.3,
    }}
  >
    {users.map((user) => (
      <RegisteredUserCell key={user.id} user={user} />
    ))}

    {/* Only 15 users are passed into the users prop */}
    {minRows > 0 &&
      Array.from({ length: 15 - users.length }, (_, index) => (
        <SkeletonUserCell key={index} />
      ))}
  </div>
);

const RegisteredUserCell = ({ user }: { user: User }) => (
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`}>
      <ProfilePicture
        alt={`${user.username}'s profile picture`}
        size={56}
        user={user}
        className={styles.cell}
      />
    </Link>
  </Tooltip>
);

const SkeletonUserCell = () => (
  <div className={cx(styles.skeletonCell, styles.cell)} />
);

export default UserGrid;
