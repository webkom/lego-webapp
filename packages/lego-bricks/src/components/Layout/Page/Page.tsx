import { LinkButton } from '../../Button';
import { ButtonGroup } from '../../Button/ButtonGroup';
import { Icon } from '../../Icon';
import { Skeleton } from '../../Skeleton';
import Flex from '../Flex';
import { PageContainer, SidebarTrigger } from '../index';
import styles from './Page.module.css';
import type { SidebarOptions } from './PageContainer';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  card?: boolean;
  cover?: ReactNode;
  title?: ReactNode;
  back?: { href: string; label?: string };
  sidebar?: SidebarOptions;
  actionButtons?: ReactNode;
  skeleton?: boolean;
  children: ReactNode;
};

const Page = ({
  className,
  card = true,
  cover,
  title,
  back,
  sidebar,
  actionButtons,
  skeleton = false,
  children,
}: Props) => (
  <PageContainer
    card={card}
    cover={cover}
    sidebar={sidebar}
    className={className}
  >
    <Flex column className={styles.content}>
      {back && (
        <LinkButton flat href={back.href} className={styles.backButton}>
          <Icon name="arrow-back" size={19} />
          {back.label ?? 'Tilbake'}
        </LinkButton>
      )}
      <Flex
        wrap
        justifyContent="flex-end"
        gap={8}
        className={title ? styles.title : undefined}
      >
        {sidebar?.side === 'left' && <SidebarTrigger />}
        {skeleton ? (
          <Skeleton height={39} width="50%" />
        ) : (
          title && <h1>{title}</h1>
        )}
        <div className={styles.spacer} />
        <ButtonGroup>
          {actionButtons}
          {sidebar?.side === 'right' && <SidebarTrigger />}
        </ButtonGroup>
      </Flex>
      {children}
    </Flex>
  </PageContainer>
);

export default Page;
