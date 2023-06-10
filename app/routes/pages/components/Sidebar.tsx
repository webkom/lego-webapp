import cx from 'classnames';
import { Component } from 'react';
import Icon from 'app/components/Icon';
import PageHierarchy from './PageHierarchy';
import styles from './Sidebar.module.css';
import type { HierarchySectionEntity } from './PageHierarchy';

type State = {
  isOpen: boolean;
};
type Props = {
  categorySelected: string;
  currentUrl: string;
  pageHierarchy: Array<HierarchySectionEntity>;
  isOpen: boolean;
  handleClose: () => void;
};

class Sidebar extends Component<Props, State> {
  render() {
    const {
      categorySelected,
      currentUrl,
      pageHierarchy,
      isOpen,
      handleClose,
    }: Props = this.props;
    // const pictureLabel = 'Hemmelig bilde';
    return (
      <div
        className={isOpen ? styles.sidebarWrapper : undefined}
        onClick={handleClose}
      >
        <div
          className={cx(styles.side, isOpen && styles.isOpen)}
          onClick={(event) => {
            // Just werkz
            event.stopPropagation();
          }}
        >
          <aside className={styles.sidebar}>
            <div className={styles.sidebarTop}>
              <button className={styles.sidebarCloseBtn} onClick={handleClose}>
                <Icon name="close" size={50} />
              </button>
              <h2 className={styles.sidebarHeader}>Om Abakus</h2>
            </div>

            <div className={styles.sidebarBottom}>
              <PageHierarchy
                pageHierarchy={pageHierarchy}
                currentUrl={currentUrl}
                currentCategory={categorySelected}
                handleCloseSidebar={handleClose}
              />
            </div>
          </aside>
        </div>
      </div>
    );
  }
}

export default Sidebar;
