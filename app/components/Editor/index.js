/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Editor, Html, resetKeyGenerator } from 'slate';
import { insertParagraph, getPlugins, getSchema } from './utils';
import rules from './serializer';
import Toolbar from './Toolbar';
import Tooltip from './Tooltip';
import styles from './Editor.css';
import { Blocks } from './constants';
import cx from 'classnames';

const parseHtml =
  typeof DOMParser === 'undefined' && require('parse5').parseFragment;
const html = new Html({ rules, parseHtml });

export type Props = {
  content?: string,
  uploadFile?: Object => void,
  autoFocus?: boolean,
  placeholder?: string,
  onChange?: func,
  isPublic?: boolean,
  onFocus?: func,
  onBlur?: func,
  disableBlocks?: boolean,
  readOnly?: boolean
};

export default class CustomEditor extends Component {
  props: Props;

  wrapperElement = undefined;

  lastSerializedState = undefined;

  constructor(props) {
    super(props);
    if (!props.value) {
      throw Error(
        'You must pass an initial value to the editor. You can pass "<p></p>" if there is no content.'
      );
    }
    this.state = {
      editorState: html.deserialize(props.value),
      focus: false
    };
    this.lastSerializedState = props.value;
    resetKeyGenerator();
  }

  onChange = editorState => {
    if (this.props.readOnly) {
      return;
    }
    const hasFocus = !editorState.isBlurred;
    let focus = this.state.focus;

    if (hasFocus && !focus) {
      this.onFocus();
      focus = true;
    } else if (!hasFocus && focus) {
      this.onBlur();
      focus = false;
    }

    this.setState({ editorState, focus });
  };

  onFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  componentWillReceiveProps = newProps => {
    if (newProps.value !== this.lastSerializedState) {
      this.setState({
        editorState: html.deserialize(newProps.value)
      });
      this.lastSerializedState = newProps.value;
    }
  };

  onContentChange = state => {
    const content = html.serialize(state);
    if (this.props.onChange) {
      this.props.onChange(content);
      this.lastSerializedState = content;
    }
  };

  onDocumentChange = (document, state) => {
    this.onContentChange(state);

    if (state.isCollapsed && state.startBlock.isVoid) {
      const transformed = insertParagraph(state);
      this.onChange(transformed);
    }
  };

  insertBlock = properties => {
    if (this.props.disableBlocks) {
      return;
    }
    const transformed = insertParagraph(
      this.state.editorState
        .transform()
        .setBlock(properties)
        .collapseToStartOfNextBlock()
        .apply({
          save: false
        })
    );

    this.onChange(transformed);
    this.onContentChange(transformed);
  };

  hasBlock = type => {
    const { editorState } = this.state;
    return editorState.blocks.some(node => node.type === type);
  };

  setBlockType = type => {
    if (this.props.disableBlocks) {
      return;
    }
    const { editorState } = this.state;
    const transfrom = editorState.transform();
    const isActive = this.hasBlock(type);
    const isList = this.hasBlock(Blocks.LI);

    if (type !== Blocks.OL && type !== Blocks.UL) {
      if (isList) {
        transfrom
          .setBlock(isActive ? Blocks.Paragraph : type)
          .unwrapBlock(Blocks.UL)
          .unwrapBlock(Blocks.OL);
      } else {
        transfrom.setBlock(isActive ? Blocks.Paragraph : type);
      }
    } else {
      const isType = editorState.blocks.some(
        block =>
          !!editorState.document.getClosest(block.key, par => par.type === type)
      );

      if (isList && isType) {
        transfrom
          .setBlock(Blocks.Paragraph)
          .unwrapBlock(Blocks.UL)
          .unwrapBlock(Blocks.OL);
      } else if (isList) {
        transfrom
          .unwrapBlock(type === Blocks.UL ? Blocks.OL : Blocks.UL)
          .wrapBlock(type);
      } else {
        transfrom.setBlock(Blocks.LI).wrapBlock(type);
      }
    }

    const newState = transfrom.apply({ save: false });
    this.onChange(newState);
    this.onContentChange(newState);
  };

  setBlockData = (key, data) => {
    const { editorState } = this.state;

    const transformed = editorState
      .transform()
      .setNodeByKey(key, { data })
      .apply({ save: false });

    this.onChange(transformed);
    this.onContentChange(transformed);
  };

  setInlineStyle = type => {
    const { editorState } = this.state;

    const transformed = editorState
      .transform()
      .toggleMark(type)
      .apply({ save: false });

    this.onChange(transformed);
    this.onContentChange(transformed);
  };

  render() {
    const { editorState } = this.state;
    const { className, uploadFile, placeholder, disableBlocks } = this.props;

    return (
      <div
        ref={c => {
          this.wrapperElement = c;
        }}
        className={cx(styles.EditorWrapper, className)}
      >
        <Editor
          readOnly={this.props.readOnly}
          state={editorState}
          placeholder={placeholder || 'Default placeholder'}
          onChange={this.onChange}
          plugins={getPlugins(!disableBlocks)}
          schema={getSchema(!disableBlocks)}
          onDocumentChange={this.onDocumentChange}
          className={styles.Editor}
        />

        {!this.props.disableBlocks &&
          !this.props.readOnly &&
          <Toolbar
            editorState={editorState}
            insertBlock={this.insertBlock}
            wrapperElement={this.wrapperElement}
            uploadFile={uploadFile}
            isPublic
            setBlockData={this.setBlockData}
          />}
        {!this.props.readOnly &&
          <Tooltip
            disableBlocks={this.props.disableBlocks}
            setBlockType={this.setBlockType}
            setInlineStyle={this.setInlineStyle}
            editorState={editorState}
            wrapperElement={this.wrapperElement}
          />}
      </div>
    );
  }
}
