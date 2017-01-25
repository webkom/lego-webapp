/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import Icon from 'app/components/Icon';
import styles from './Toolbar.css';
import { findDOMNode } from 'slate';


export type Props = {
  editorState: object,
  insertBlock: (properties) => void
};

export default class Toolbar extends Component {
  state = {
    open: false
  }
  props: Props;

  container = undefined;

  componentDidUpdate = () => {
    const { editorState } = this.props;
    if (!this.container) return;

    const visible = editorState.isCollapsed &&
                    editorState.startBlock.type === 'paragraph' &&
                    editorState.startText.text === '' &&
                    !editorState.isBlurred;
    if (!visible) {
      this.container.style.display = 'none';
      return;
    }
    this.container.style.display = 'initial';
    const rect = findDOMNode(editorState.startText).getBoundingClientRect();
    this.container.style.top = `${rect.top + window.scrollY}px`;
  }

  clickMinus = (e) => {
    console.log('click');
    e.preventDefault();
    e.stopPropagation();
    this.props.insertBlock({
      type: 'hr',
      isVoid: true,
      data: {}
    });
  }

  render() {
    return (
      <div className={styles.toolbar} style={{ top: '500px', left: '100px' }} ref={(c) => { this.container = c; }}>
        <Icon
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ open: !this.state.open });
          }}
          name='plus'
          className={this.state.open ? styles.activeButton : ''}
        />

        {this.state.open && <div className={styles.toolbarButtons}>
          <span
            className={styles.toolbarButton}
            onMouseDown={this.clickMinus}
          >
            <Icon name='minus' />
          </span>
          <span
            className={styles.toolbarButton}
            onMouseDown={(e) => {
              e.preventDefault();
              console.log('click image');
            }}
          >
            <Icon name='picture-o' />
          </span>
        </div>}

      </div>
    );
  }
}
