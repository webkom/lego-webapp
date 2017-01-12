/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import 'draft-js/dist/Draft.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import Editor from 'draft-js-plugins-editor';
import { RichUtils } from 'draft-js';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createMentionPlugin from 'draft-js-mention-plugin';
import { getMentions } from 'app/reducers/search';
import { mention } from 'app/actions/SearchActions';
import { Block, customStyleMap } from './constants';
import * as utils from './utils';
import Tooltip from './Tooltip';
import Toolbar from './Toolbar';
import RenderMap from './RenderMap';
import customRenderer from './CustomRenderer';
import styles from './Editor.css';

const mentionPlugin = createMentionPlugin();
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;
const { MentionSuggestions } = mentionPlugin;

export type Props = {
  content: string,
  autoFocus: boolean,
  placeholder?: string,
  onChange: () => void,
  onFocus: () => void,
  onBlur: () => void
};

class EditorComponent extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      editorState: utils.createEditorState(props.content),
      active: false
    };

    this.customRenderer = customRenderer(this.onChange, this.state.editorState);
  }

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
      this.props.onChange(utils.toHTML(editorState.getCurrentContent()))
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
      return true;
    }

    if (!e.altKey && !e.metaKey && !e.ctrlKey) {
      const selection = editorState.getSelection();
      const currentBlockKey = selection.getAnchorKey();
      const currentBlock = editorState.getCurrentContent().getBlockForKey(currentBlockKey);
      const blockType = currentBlock.getType();

      if (blockType.indexOf('atomic') === 0) {
        this.onChange(utils.addNewBlockAt(editorState, currentBlock.getKey()));
        return true;
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
            return true;
          default:
            return false;
        }
      }

      if (selection.isCollapsed() && currentBlock.getLength() === selection.getStartOffset()) {
        return false;
      }

      return false;
    }

    return false;
  }


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
          plugins={[emojiPlugin, mentionPlugin]}
          stripPastedStyles
          decorators={utils.customDecorators}
          ref={(node) => { this.editorRoot = node; }}
          handleReturn={this.handleReturn}
          editorState={editorState}
          customStyleMap={customStyleMap}
          blockRenderMap={RenderMap}
          blockRendererFn={this.customRenderer}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />

        {this.state.active &&
          <EmojiSuggestions />
        }

        {this.state.active &&
          <MentionSuggestions
            onSearchChange={this.props.onMention}
            suggestions={this.props.mentions}
          />
        }

        {blockLength === 0 && this.state.active && !this.props.simpleEditor ?
          <Toolbar
            editorState={editorState}
            editorRoot={this.editorRoot}
            active={this.state.active}
            onChange={this.onChange}
          /> : null
        }

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

const mapStateToProps = (state) => ({
  mentions: getMentions(state)
});

const mapDispatchToProps = (dispatch) => ({
  onMention: debounce((query) => dispatch(mention(query.value)), 300)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);
