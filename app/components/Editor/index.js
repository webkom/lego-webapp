/* eslint-disable react/no-find-dom-node */
import 'draft-js/dist/Draft.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { RichUtils, Editor } from 'draft-js';
import { uploadFile } from 'app/actions/FileActions';
import { Block, customStyleMap, NOT_HANDLED, HANDLED } from './constants';
import * as utils from './utils';
import beforeInput, { StringToTypeMap } from './beforeInput';
import Tooltip from './Tooltip';
import Toolbar from './Toolbar';
import RenderMap from './RenderMap';
import customRenderer from './CustomRenderer';
import styles from './Editor.css';

export type Props = {
  content: string,
  autoFocus: boolean,
  placeholder?: string,
  onChange?: func,
  onFocus?: func,
  onBlur?: func
};

class EditorComponent extends Component {
  props: Props;

  static defaultProps = {
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {}
  }

  state = {
    editorState: utils.createEditorState(this.props.content),
    active: false
  };

  customRenderer = customRenderer(this.onChange, this.state.editorState);

  componentDidMount = () => {
    if (this.props.autoFocus) this.focus();
    document.body.addEventListener('click', this.handleClick);
  }

  componentWillUnmount = () => {
    document.body.addEventListener('click', this.handleClick);
  }

  handleClick = (e) => {
    const editorWrapper = ReactDOM.findDOMNode(this.editorWrapper);

    if (editorWrapper && !editorWrapper.contains(e.target)) {
      this.setState({ active: false });
    }

    if (editorWrapper && editorWrapper.contains(e.target)) {
      this.setState({ active: true });
    }
  }

  onChange = (editorState) => {
    this.setState(
      { editorState },
      () => {
        console.log(editorState.getCurrentContent().toJS().blockMap);
        // this.props.onChange(utils.toHTML(editorState.getCurrentContent()));
      }
    );
  }

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  toggleLink = (selection, entityKey) => {
    this.onChange(RichUtils.toggleLink(this.state.editorState, selection, entityKey));
    setTimeout(() => this.focus(), 1); // HACK for resetting focus after links
  }

  handleReturn = (e) => {
    const { editorState } = this.state;

    if (isSoftNewlineEvent(e)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return HANDLED;
    }

    if (!e.altKey && !e.metaKey && !e.ctrlKey) {
      const currentBlock = utils.getCurrentBlock(editorState);
      const blockType = currentBlock.getType();

      if (blockType === Block.ATOMIC) {
        this.onChange(utils.addNewBlockAt(editorState, currentBlock.getKey()));
        return HANDLED;
      }

      if (currentBlock.getLength() === 0) {
        switch (blockType) {
          case Block.UL:
          case Block.OL:
          case Block.BLOCKQUOTE:
          case Block.BLOCKQUOTE_CAPTION:
          case Block.CAPTION:
          case Block.TODO:
          case Block.H2:
          case Block.H3:
          case Block.H1:
            this.onChange(utils.resetBlockWithType(editorState, Block.UNSTYLED));
            return HANDLED;
          default:
            return NOT_HANDLED;
        }
      }

      const selection = editorState.getSelection();
      const continuousBlocks = [
        Block.UNSTYLED,
        Block.BLOCKQUOTE,
        Block.OL,
        Block.UL,
        Block.CODE,
        Block.TODO,
      ];

      if (selection.isCollapsed() && currentBlock.getLength() === selection.getStartOffset()) {
        if (continuousBlocks.indexOf(blockType) < 0) {
          this.onChange(utils.addNewBlockAt(editorState, currentBlock.getKey()));
          return HANDLED;
        }
        return NOT_HANDLED;
      }
      return NOT_HANDLED;
    }
    return NOT_HANDLED;
  }

  handleBeforeInput = (s) => beforeInput(this.state.editorState, s, this.onChange, StringToTypeMap);

  handleKeyCommand = (command) => {
    console.log(command);
  };

  onFocus = () => {
    this.setState({ active: true });
    this.props.onFocus();
  }

  onBlur = (e) => {
    this.props.onBlur(e);
  }

  focus = () => this.editorRoot.focus();

  render() {
    const { editorState } = this.state;
    const currentBlockKey = editorState.getSelection().getAnchorKey();
    const blockLength = editorState.getCurrentContent().getBlockForKey(currentBlockKey).getLength();

    return (
      <div
        className={styles.editorRoot}
        ref={(node) => { this.editorWrapper = node; }}
        id='editor'
      >

        <Editor
          stripPastedStyles
          decorators={utils.customDecorators}
          ref={(node) => { this.editorRoot = node; }}
          handleReturn={this.handleReturn}
          handleBeforeInput={this.handleBeforeInput}
          handleKeyCommand={this.handleKeyCommand}
          editorState={editorState}
          customStyleMap={customStyleMap}
          blockRenderMap={RenderMap}
          blockRendererFn={this.customRenderer}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />

        <Toolbar
          editorState={editorState}
          editorRoot={this.editorRoot}
          focus={this.focus}
          active={this.state.active}
          uploadFile={this.props.uploadFile}
          showToolbar={blockLength === 0 && this.state.active && !this.props.simpleEditor}
          onChange={this.onChange}
        />

        {!editorState.getSelection().isCollapsed() && this.state.active ?
          <Tooltip
            editorState={editorState}
            simpleEditor={this.props.simpleEditor}
            focus={this.focus}
            editorRoot={this.editorRoot}
            toggleLink={this.toggleLink}
            toggleInlineStyle={this.toggleInlineStyle}
            toggleBlockType={this.toggleBlockType}
          /> : null
        }

      </div>
    );
  }
}

const mapDispatchToProps = {
  uploadFile
};

export default connect(
  null,
  mapDispatchToProps
)(EditorComponent);
