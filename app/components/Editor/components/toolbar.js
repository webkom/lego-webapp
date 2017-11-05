// @flow

import * as React from 'react';
import { createPortal, findDOMNode } from 'react-dom';
import { EditorState } from 'draft-js';
import { find } from 'lodash';
import cx from 'classnames';
import ToolbarButton from './ToolbarButton';
import { getSelection, getSelectionRect } from '../util/index';
import { getCurrentBlock } from '../model/index';
import {
  Entity,
  HYPERLINK,
  BLOCK_BUTTONS,
  INLINE_BUTTONS
} from '../util/constants';
import styles from './Toolbar.css';

type Props = {
  editorRoot: HTMLElement,
  editorState: EditorState,
  editorEnabled: boolean,
  simpleEditor: boolean,
  focus: () => void,
  setLink: string => void,
  toggleBlockType: string => void,
  toggleInlineStyle: string => void
};

type State = {
  showURLInput: boolean,
  urlInputValue: string
};
export default class Toolbar extends React.Component<Props, State> {
  urlinput: HTMLInputElement;
  toolbar: HTMLDivElement;

  state: State = {
    showURLInput: false,
    urlInputValue: ''
  };

  componentWillReceiveProps(newProps: Props) {
    const { editorState } = newProps;

    if (!newProps.editorEnabled) {
      return;
    }

    const selectionState = editorState.getSelection();

    if (selectionState.isCollapsed()) {
      if (this.state.showURLInput) {
        this.setState({
          showURLInput: false,
          urlInputValue: ''
        });
      }
      return;
    }
  }

  onKeyDown = (e: SyntheticKeyboardEvent<*>) => {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setLink(this.state.urlInputValue);
      this.hideLinkInput();
    } else if (e.which === 27) {
      this.hideLinkInput();
    }
  };

  onChange = ({ target }: SyntheticInputEvent<*>) => {
    this.setState({ urlInputValue: target.value });
  };

  handleLinkInput = (e?: SyntheticMouseEvent<*>, direct?: boolean) => {
    if (!direct && e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      this.props.focus();
      return;
    }
    const currentBlock = getCurrentBlock(editorState);
    let selectedEntity = '';
    let linkFound = false;
    currentBlock.findEntityRanges(
      character => {
        const entityKey = character.getEntity();
        selectedEntity = entityKey;
        return (
          entityKey !== null &&
          editorState
            .getCurrentContent()
            .getEntity(entityKey)
            .getType() === Entity.LINK
        );
      },
      (start, end) => {
        let selStart = selection.getAnchorOffset();
        let selEnd = selection.getFocusOffset();
        if (selection.getIsBackward()) {
          selStart = selection.getFocusOffset();
          selEnd = selection.getAnchorOffset();
        }
        if (start === selStart && end === selEnd) {
          linkFound = true;
          const { url } = editorState
            .getCurrentContent()
            .getEntity(selectedEntity)
            .getData();
          this.setState(
            {
              showURLInput: true,
              urlInputValue: url
            },
            () => {
              setTimeout(() => {
                this.urlinput.focus();
                this.urlinput.select();
              }, 10);
            }
          );
        }
      }
    );
    if (!linkFound) {
      this.setState(
        {
          showURLInput: true
        },
        () => {
          setTimeout(() => {
            this.urlinput.focus();
          }, 10);
        }
      );
    }
  };

  hideLinkInput = (e?: SyntheticMouseEvent<*>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setState(
      {
        showURLInput: false,
        urlInputValue: ''
      },
      this.props.focus
    );
  };

  render() {
    const { editorState, editorEnabled, editorRoot } = this.props;
    const { showURLInput, urlInputValue } = this.state;
    const selection = editorState.getSelection();
    const nativeSelection = getSelection(window);

    if (
      !editorRoot ||
      !nativeSelection.rangeCount ||
      !editorEnabled ||
      selection.isCollapsed()
    ) {
      return null;
    }

    if (this.toolbar) {
      const selectionBoundary = getSelectionRect(nativeSelection);
      console.log(selectionBoundary);
      console.log(this.toolbar);
      console.log(editorRoot);
      this.toolbar.style.top = `${selectionBoundary.top +
        window.scrollY -
        this.toolbar.offsetHeight}px`;
      this.toolbar.style.left = `${selectionBoundary.left +
        window.scrollX -
        this.toolbar.offsetWidth / 2 +
        selectionBoundary.width / 2}px`;
    }

    if (showURLInput) {
      let className = `md-editor-toolbar${isOpen
        ? ' md-editor-toolbar--isopen'
        : ''}`;
      className += ' md-editor-toolbar--linkinput';
      return (
        <div className={className}>
          <div
            className="md-RichEditor-controls md-RichEditor-show-link-input"
            style={{ display: 'block' }}
          >
            <span className="md-url-input-close" onClick={this.hideLinkInput}>
              &times;
            </span>
            <input
              ref={node => {
                this.urlinput = node;
              }}
              type="text"
              className="md-url-input"
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}
              placeholder="Press ENTER or ESC"
              value={urlInputValue}
            />
          </div>
        </div>
      );
    }

    return createPortal(
      <div
        className={styles.toolbar}
        ref={e => {
          this.toolbar = e;
        }}
      >
        {BLOCK_BUTTONS.map(button => (
          <ToolbarButton
            key={button.style}
            button={button}
            type="block"
            editorState={editorState}
            onToggle={this.props.toggleBlockType}
          />
        ))}
        {INLINE_BUTTONS.map(button => (
          <ToolbarButton
            key={button.style}
            type="inline"
            button={button}
            editorState={editorState}
            onToggle={this.props.toggleInlineStyle}
          />
        ))}
        {false && ( //TODO show this when Edit link
          <ToolbarButton
            button={find(INLINE_BUTTONS, ['style', HYPERLINK])}
            type="inline"
            editorState={editorState}
            onToggle={this.handleLinkInput}
          />
        )}
      </div>,
      editorRoot
    );
  }
}
