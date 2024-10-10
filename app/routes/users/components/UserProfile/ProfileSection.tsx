import { Card, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import styles from 'app/routes/users/components/UserProfile/UserProfile.css';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}

export const ProfileSection = ({ title, footer, children }: Props) => {
  return (
    <div>
      <h3>{title}</h3>
      <Card className={styles.infoCard}>
        <Flex column={true} gap="var(--spacing-md)">
          {children}
          {footer && <div className={styles.infoCardFooter}>{footer}</div>}
        </Flex>
      </Card>
    </div>
  );
};

export const InfoField = ({
  name,
  children,
}: {
  name: ReactNode;
  children: ReactNode;
}) => (
  <Flex column>
    <span className={styles.infoFieldName}>{name}</span>
    <div className={styles.infoFieldContent}>{children}</div>
  </Flex>
);

export const LinkInfoField = ({
  name,
  to,
  children,
}: {
  name: string;
  to: string;
  children: ReactNode;
}) => (
  <InfoField name={name}>
    <Link to={to}>{children}</Link>
  </InfoField>
);

export const EmailInfoField = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => (
  <LinkInfoField name={name} to={`mailto:${email}`}>
    {email}
  </LinkInfoField>
);
