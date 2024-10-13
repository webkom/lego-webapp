import cx from 'classnames';
import { X } from 'lucide-react';
import { createContext, useContext } from 'react';
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import Flex from '../Flex';
import styles from './Sidebar.module.css';
import { SideModal } from './utils/SideModal';
import type { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  close?: () => void;
  className?: string;
  children: ReactNode;
};

export const Sidebar = ({ title, close, className, children }: Props) => (
  <Flex className={cx(styles.sidebar, className)} column>
    {close && (
      <Icon iconNode={<X />} className={styles.close} onPress={close} />
    )}
    {title && <h2 className={styles.title}>{title}</h2>}
    {children}
  </Flex>
);

type ContextContent = {
  side: 'right' | 'left';
  icon: string;
  render: (props: { close: () => void }) => ReactNode;
};

export const SidebarContext = createContext<ContextContent | undefined>(
  undefined,
);

export const SidebarTrigger = () => {
  const sidebarContext = useContext(SidebarContext);
  return (
    sidebarContext && (
      <SideModal
        side={sidebarContext.side}
        trigger={
          <Button className={cx(styles.sidebarTrigger, styles.mobileOnly)}>
            <Icon name={sidebarContext.icon} size={22} />
          </Button>
        }
      >
        {sidebarContext.render}
      </SideModal>
    )
  );
};
