/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import Icon from 'app/components/Icon/index';
import ImageUpload from 'app/components/Upload/index';
import styles from './Editor.css';
import { findDOMNode } from 'slate-react';
import cx from 'classnames';

export type Props = {
  state: object,
  isPublic?: boolean,
  insertBlock: properties => void,
  setBlockData: (key, data) => void,
  uploadFile: () => Promise
};

export type SideMenuButtonProps = {
  icon: string,
  active: boolean,
  onClick: properties => void
};

const SideMenuButton = ({ onClick, active, icon }: SideMenuButtonProps) => (
  <span
    className={cx(
      styles.sideMenuButton,
      styles.activeSideMenuButtons && active
    )}
    onMouseDown={e => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
  >
    <Icon name={icon} />
  </span>
);

export default class SideMenu extends Component {
  state = {
    open: false,
    openUpload: false
  };
  props: Props;

  container = undefined;

  componentDidUpdate = () => {
    this.updatePosition();
  };

  componentDidMount = () => {
    this.updatePosition();
  };

  updatePosition = () => {
    const { state } = this.props;
    if (!this.container) return;

    const visible =
      state.isCollapsed &&
      state.startBlock.type === 'paragraph' &&
      state.startText.text === '' &&
      !state.isBlurred;
    if (!visible) {
      this.container.style.display = 'none';
      if (this.state.open) {
        this.setState({
          open: false
        });
      }
      return;
    }
    this.container.style.display = 'initial';

    const rect = findDOMNode(state.startText).getBoundingClientRect();
    this.container.style.top = `${rect.top + window.scrollY}px`;
  };

  insertSeparator = () => {
    // insert separator
    this.setState({
      open: false
    });
  };

  insertImage = (image, src) => {
    /*
    const { uploadFile, setBlockData, isPublic } = this.props;
    this.props.insertBlock({
      type: Blocks.Image,
      isVoid: true,
      data: {
        setBlockData,
        blockLayout: 'full',
        uploadFile,
        isPublic,
        image,
        src
      }
    });
    */
  };

  toggleImage = () => {
    this.setState({ ...this.state, openUpload: !this.state.openUpload });
  };

  toggle = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <div
        className={styles.sideMenu}
        ref={c => {
          this.container = c;
        }}
      >
        <div
          className={cx(
            this.state.open ? styles.activeToggleSideMenuButton : '',
            styles.toggleSideMenuButton
          )}
        >
          <Icon onMouseDown={this.toggle} name="add" />
        </div>

        {this.state.open && (
          <div className={styles.sideMenuButtons}>
            <SideMenuButton icon="remove" onClick={this.insertSeparator} />
            <SideMenuButton icon="image" onClick={this.toggleImage} />
          </div>
        )}

        {this.state.openUpload && (
          <ImageUpload
            inModal
            onClose={this.toggleImage}
            onSubmit={this.insertImage}
          />
        )}
      </div>
    );
  }
}
