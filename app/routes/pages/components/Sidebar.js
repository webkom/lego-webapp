/* eslint-disable react/no-danger */
// @flow

import React, { Component } from 'react';
import styles from './Sidebar.css';
import PageHierarchy from './PageHierarchy';
import cx from 'classnames';

import type { HierarchySectionEntity } from './PageHierarchy';

import Icon from 'app/components/Icon';

type State = {
  isOpen: boolean,
};

type Props = {
  categorySelected: string,
  currentUrl: string,
  pageHierarchy: Array<HierarchySectionEntity>,
  isOpen: boolean,
  handleClose: any,
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
                <Icon size={50} name="close" />
              </button>
              <h3 className={styles.sidebarHeader}>Om Abakus</h3>
              <h4 className={styles.sidebarSubtitle}>
                {categorySelected ? categorySelected : 'Generelt'}
              </h4>
              {/* <div className={styles.sidebarPicture}>
                <h4 className={styles.pictureHeader}> {"Abakus' Fortid"}</h4>
                <a href="https://abakus.no/">
                  <img
                    alt={pictureLabel}
                    className={styles.oldImg}
                    src="https://thumbor.abakus.no/"
                  />
                  <span className={styles.pictureInfo}>{pictureLabel}</span>
                </a>
              </div> */}
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
