import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import { ButtonGroup } from '../../Button/ButtonGroup';
import { Icon } from '../../Icon';
import { Skeleton } from '../../Skeleton';
import { TabContainer } from '../../Tabs/TabContainer';
import Flex from '../Flex';
import { PageContainer, SidebarTrigger } from '../index';
import styles from './Page.module.css';
import type { SidebarOptions } from './PageContainer';
import type { ReactNode } from 'react';

type Props = {
  classNames?: {
    container?: string;
    content?: string;
    description?: string;
    tabContainer?: string;
  };
  card?: boolean;
  cover?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  back?: { href: string; label?: string };
  sidebar?: SidebarOptions;
  actionButtons?: ReactNode;
  tabs?: ReactNode;
  dividerColor?: string;
  skeleton?: boolean;
  children: ReactNode;
};

const Page = ({
  classNames,
  card = true,
  cover,
  title,
  description,
  back,
  sidebar,
  actionButtons,
  tabs,
  dividerColor,
  skeleton = false,
  children,
}: Props) => (
  <PageContainer
    card={card}
    cover={cover}
    sidebar={sidebar}
    className={classNames?.container}
  >
    <Flex column className={cx(styles.content, classNames?.content)}>
      {back && (
        <NavLink to={back.href} className={styles.back}>
          <Icon name="arrow-back" size={18} className={styles.backIcon} />
          <span className={styles.backLabel}>{back.label ?? 'Tilbake'}</span>
        </NavLink>
      )}
      <Flex
        wrap
        gap="var(--spacing-sm)"
        className={title ? styles.title : undefined}
      >
        {sidebar?.side === 'left' && <SidebarTrigger />}
        {skeleton && !title ? (
          <Skeleton height={39} width="50%" />
        ) : (
          title && <h1>{title}</h1>
        )}
        <ButtonGroup className={styles.buttonGroup}>
          {actionButtons}
          {sidebar?.side === 'right' && <SidebarTrigger />}
        </ButtonGroup>
      </Flex>
      <div className={cx(styles.description, classNames?.description)}>
        {description}
      </div>
      <TabContainer
        lineColor={dividerColor}
        className={classNames?.tabContainer}
      >
        {tabs}
      </TabContainer>
      {children}
    </Flex>
  </PageContainer>
);

export default Page;
