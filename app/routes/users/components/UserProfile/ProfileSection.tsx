import { Card } from '@webkom/lego-bricks';
import styles from 'app/routes/users/components/UserProfile/UserProfile.css';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export const ProfileSection = ({ title, children }: Props) => {
  return (
    <div>
      <h3>{title}</h3>
      <Card className={styles.infoCard}>{children}</Card>
    </div>
  );
};
