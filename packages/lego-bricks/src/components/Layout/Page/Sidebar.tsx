import cx from 'classnames';
import { FilterX, X } from 'lucide-react';
import { createContext, useContext } from 'react';
import { useLocation, useNavigate } from '../../../LocationContext';
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

export const Sidebar = ({ title, close, className, children }: Props) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const clearQueryParams = () => {
    navigate(pathname, undefined);
  };

  return (
    <Flex className={cx(styles.sidebar, className)} column>
      {close && (
        <Icon iconNode={<X />} className={styles.close} onPress={close} />
      )}
      {title && (
        <Flex
          wrap
          alignItems="center"
          gap="var(--spacing-sm)"
          className={styles.title}
        >
          <h2>{title}</h2>
          {title === 'Filter' && (
            <Icon
              iconNode={<FilterX />}
              onPress={clearQueryParams}
              disabled={!search}
              size={20}
            />
          )}
        </Flex>
      )}
      {children}
    </Flex>
  );
};

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
