import cx from 'classnames';
import Flex from '../Flex';
import styles from './PageContainer.module.css';
import { Sidebar, SidebarContext } from './Sidebar';
import type { ReactNode } from 'react';

export type SidebarOptions = {
  title?: string;
  side: 'left' | 'right';
  icon: string;
  content: ReactNode;
};

type Props = {
  className?: string;
  card?: boolean;
  cover?: ReactNode;
  sidebar?: SidebarOptions;
  children: ReactNode;
};

const PageContainer = ({
  className,
  card = true,
  cover,
  sidebar,
  children,
}: Props) => {
  const sidebarComponent =
    sidebar &&
    ((props: { close?: () => void }) => (
      <Sidebar title={sidebar.title} close={props.close}>
        {sidebar.content}
      </Sidebar>
    ));

  return (
    <Flex className={cx(styles.container, card && styles.card, className)}>
      {sidebarComponent && (
        <div style={{ gridArea: sidebar.side }} className={styles.sidebar}>
          {sidebarComponent({})}
        </div>
      )}
      <div style={{ gridArea: 'cover' }}>{cover}</div>
      <div className={styles.main}>
        <SidebarContext.Provider
          value={
            sidebarComponent && {
              side: sidebar.side,
              icon: sidebar.icon,
              render: sidebarComponent,
            }
          }
        >
          {children}
        </SidebarContext.Provider>
      </div>
    </Flex>
  );
};

export default PageContainer;
