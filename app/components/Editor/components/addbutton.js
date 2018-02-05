//@flow

import * as React from 'react';
import cx from 'classnames';
import Sides from './sides';
import { EditorState } from 'draft-js';
import { CSSTransition } from 'react-transition-group';
import { getSelectedBlockNode } from '../util';
import styles from './AddButton.css';

type Props = {
  editorState: EditorState,
  getEditorState: () => EditorState,
  setEditorState: EditorState => void,
  focus: () => void
};

type State = {
  style: Object,
  visible: boolean,
  isOpen: boolean
};

export default class AddButton extends React.Component<Props, State> {
  state: State = {
    style: {},
    visible: false,
    isOpen: false
  };

  node = null;
  blockKey = '';
  blockType = '';
  blockLength = -1;

  // To show + button only when text length == 0
  componentWillReceiveProps(newProps: Props) {
    const { editorState } = newProps;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (
      !selectionState.isCollapsed() ||
      selectionState.anchorKey !== selectionState.focusKey ||
      contentState
        .getBlockForKey(selectionState.getAnchorKey())
        .getType()
        .indexOf('atomic') >= 0
    ) {
      this.hideBlock();
      return;
    }
    const block = contentState.getBlockForKey(selectionState.anchorKey);
    const bkey = block.getKey();
    if (block.getLength() > 0) {
      this.hideBlock();
      return;
    }
    if (block.getType() !== this.blockType) {
      this.blockType = block.getType();
      if (block.getLength() === 0) {
        setTimeout(this.findNode, 0);
      }
      this.blockKey = bkey;
      return;
    }
    if (this.blockKey === bkey) {
      // console.log('block exists');
      if (block.getLength() > 0) {
        this.hideBlock();
      } else {
        this.setState({
          visible: true
        });
      }
      return;
    }
    this.blockKey = bkey;
    if (block.getLength() > 0) {
      // console.log('no len');
      this.hideBlock();
      return;
    }
    setTimeout(this.findNode, 0);
  }

  hideBlock = () => {
    if (this.state.visible) {
      this.setState({
        visible: false,
        isOpen: false
      });
    }
  };

  open = (e: ?SyntheticMouseEvent<*>) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.setState({ isOpen: !this.state.isOpen }, this.props.focus);
  };

  findNode = () => {
    const node = getSelectedBlockNode(window);
    if (node === this.node) {
      return;
    }

    if (!node) {
      this.setState({
        visible: false,
        isOpen: false
      });
      return;
    }
    this.node = node;
    this.setState({
      visible: true,
      style: {
        top: node.offsetTop - 3
      }
    });
  };

  render() {
    const { visible, style, isOpen } = this.state;
    const { getEditorState, setEditorState } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <div className={styles.addButton} style={style}>
        <button
          onMouseDown={this.open}
          className={cx(styles.addButtonButton, isOpen && styles.isOpen)}
          type="button"
        >
          <i className="fa fa-plus" />
        </button>
        <CSSTransition
          timeout={300}
          in={isOpen}
          classNames={{
            appear: styles.transitionAppear,
            appearActive: styles.transitionAppearActive,
            enter: styles.transitionEnter,
            enterActive: styles.transitionEnterActive,
            exit: styles.transitionExit,
            exitActive: styles.transitionExitActive
          }}
        >
          <div className={cx(styles.addButtonButtons, isOpen && styles.isOpen)}>
            {Sides.map(({ Component, props = {}, title }) => (
              <Component
                key={title}
                {...props}
                getEditorState={getEditorState}
                setEditorState={setEditorState}
                close={this.open}
              />
            ))}
          </div>
        </CSSTransition>
      </div>
    );
  }
}
