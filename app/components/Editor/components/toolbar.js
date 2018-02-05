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

  componentDidUpdate() {
    if (!this.props.editorEnabled || this.state.showURLInput || !this.toolbar) {
      return;
    }
    const selectionState = this.props.editorState.getSelection();
    if (selectionState.isCollapsed()) {
      return;
    }
    // eslint-disable-next-line no-undef
    const nativeSelection = getSelection(window);
    if (!nativeSelection.rangeCount) {
      return;
    }
    const selectionBoundary = getSelectionRect(nativeSelection);

    // eslint-disable-next-line react/no-find-dom-node
    const toolbarNode = findDOMNode(this.toolbar);
    const toolbarBoundary = toolbarNode.getBoundingClientRect();

    // eslint-disable-next-line react/no-find-dom-node
    const parent = findDOMNode(this.props.editorRoot);
    const parentBoundary = parent.getBoundingClientRect();

    toolbarNode.style.top = `${selectionBoundary.top -
      parentBoundary.top -
      toolbarBoundary.height -
      8}px`;
    toolbarNode.style.width = `${toolbarBoundary.width}px`;
    const widthDiff = selectionBoundary.width - toolbarBoundary.width;
    if (widthDiff >= 0) {
      toolbarNode.style.left = `${widthDiff / 2}px`;
    } else {
      const left = selectionBoundary.left - parentBoundary.left;
      toolbarNode.style.left = `${left + widthDiff / 2}px`;
    }
  }

  onKeyDown = (e: SyntheticKeyboardEvent<*>) => {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setLink(this.state.urlInputValue);
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
    const { editorState, simpleEditor, editorEnabled, editorRoot } = this.props;
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

    return createPortal(
      <div
        className={styles.toolbar}
        ref={e => {
          this.toolbar = e;
        }}
      >
        {showURLInput && (
          <div className={styles.linkInput}>
            <input
              ref={node => {
                this.urlinput = node;
              }}
              type="text"
              className={styles.link}
              onKeyDown={this.onKeyDown}
              onBlur={() => {
                this.hideLinkInput();
              }}
              onChange={this.onChange}
              placeholder="Press ENTER or ESC"
              value={urlInputValue}
            />
          </div>
        )}
        {!showURLInput &&
          !simpleEditor &&
          BLOCK_BUTTONS.map(button => (
            <ToolbarButton
              key={button.style}
              button={button}
              type="block"
              editorState={editorState}
              onToggle={this.props.toggleBlockType}
            />
          ))}
        {!showURLInput &&
          INLINE_BUTTONS.map(button => (
            <ToolbarButton
              key={button.style}
              type="inline"
              handleLinkInput={this.handleLinkInput}
              button={button}
              editorState={editorState}
              onToggle={this.props.toggleInlineStyle}
            />
          ))}
      </div>,
      editorRoot
    );
  }
}
