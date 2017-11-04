//@flow

import * as React from 'react';
import { EditorState } from 'draft-js';
import { CSSTransitionGroup } from 'react-transition-group';
import { getSelectedBlockNode } from '../util';

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
      // console.log('no sel');
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

  openToolbar = () => {
    this.setState(
      {
        isOpen: !this.state.isOpen
      },
      this.props.focus
    );
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

  // TODO add sidebuttons line 153
  render() {
    const { visible, style, isOpen } = this.state;
    const { getEditorState, setEditorState } = this.props;
    if (!visible) {
      return null;
    }

    return (
      <div className="md-side-toolbar" style={style}>
        <button
          onClick={this.openToolbar}
          className={`md-sb-button md-add-button${isOpen
            ? ' md-open-button'
            : ''}`}
          type="button"
        >
          <svg viewBox="0 0 8 8" height="14" width="14">
            <path d="M3 0v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z" />
          </svg>
        </button>
        {isOpen ? (
          <CSSTransitionGroup
            transitionName="md-example"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={100}
            transitionAppearTimeout={100}
            transitionAppear
          >
            {[].map(button => {
              const Button = button.component;
              const extraProps = button.props ? button.props : {};
              return (
                <Button
                  key={button.title}
                  {...extraProps}
                  getEditorState={getEditorState}
                  setEditorState={setEditorState}
                  close={this.openToolbar}
                />
              );
            })}
          </CSSTransitionGroup>
        ) : null}
      </div>
    );
  }
}
