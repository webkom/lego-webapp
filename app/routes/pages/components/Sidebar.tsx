import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import PageHierarchy from './PageHierarchy';
import styles from './Sidebar.css';
import type { HierarchySectionEntity } from './PageHierarchy';

type Props = {
  categorySelected: string;
  currentUrl: string;
  pageHierarchy: Array<HierarchySectionEntity>;
  isOpen: boolean;
  handleClose: () => void;
};

const Sidebar = ({
  categorySelected,
  currentUrl,
  pageHierarchy,
  isOpen,
  handleClose,
}: Props) => {
  return (
    <div className={cx(styles.sidebar, isOpen || styles.sidebarClosed)}>
      <button className={styles.sidebarCloseButton} onClick={handleClose}>
        <Icon name="close" size={30} />
      </button>
      <h2 className={styles.sidebarHeader}>Om Abakus</h2>
      <PageHierarchy
        pageHierarchy={pageHierarchy}
        currentUrl={currentUrl}
        currentCategory={categorySelected}
        handleCloseSidebar={handleClose}
      />
    </div>
  );
};

export default Sidebar;
