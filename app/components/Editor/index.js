import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { RichUtils, EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { getMentions } from 'app/reducers/search';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { mention } from 'app/actions/SearchActions';
import createMentionPlugin from 'draft-js-mention-plugin';
import 'draft-js/dist/Draft.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import { toHTML } from './utils';
import Tooltip from './Tooltip';
import Toolbar from './Toolbar';
import RenderMap from './RenderMap';
import customRenderer from './CustomRenderer';
import KeyBindings from './KeyBindings';
import styles from './Editor.css';

const mentionPlugin = createMentionPlugin();
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;
const { MentionSuggestions } = mentionPlugin;

export type Props = {
  content: string,
  placeholder?: string,
  onChange: () => void
};

class EditorComponent extends Component {

  props: Props;

  state = {
    editorState: EditorState.createEmpty(),
    active: false
  }

  componentDidMount = () => {
    document.body.addEventListener('click', this.handleClick);
  }

  componentWillUnmount = () => {
    document.body.addEventListener('click', this.handleClick);
  }

  handleClick = (e) => {
    const editorWrapper = ReactDOM.findDOMNode(this.editorWrapper);

    if (!editorWrapper.contains(e.target)) {
      this.setState({ active: false });
    }
  }

  onChange = (editorState) => {
    this.setState(
      { editorState },
      () => this.props.onChange(toHTML(this.state.editorState.getCurrentContent()))
    );
  }

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  customRenderer = customRenderer(this.onChange, this.state.editorState);

  onFocus = (e) => {
    this.setState({ active: true });
    const selection = EditorState.moveSelectionToEnd(this.state.editorState);
    this.onChange(EditorState.forceSelection(selection, selection.getSelection()));
  }

  onKeyCommand = (command) => {
    console.log(command);
  }

  logData = () => {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
    console.log(this.state.editorState.getSelection().toJS());
  }

  render() {
    const { editorState } = this.state;
    const currentBlockKey = editorState.getSelection().getAnchorKey();
    const blockLength = editorState.getCurrentContent().getBlockForKey(currentBlockKey).getLength();

    return (
      <div>
        <div>
            <button onClick={this.logData}>Log State</button>
        </div>
        <div
          className={styles.editorRoot}
          ref={(node) => { this.editorWrapper = node; }}
          id='editor'
        >

            <Editor
              plugins={[emojiPlugin, mentionPlugin]}
              stripPastedStyles
              ref={(node) => { this.editorRoot = node; }}
              editorState={editorState}
              blockRenderMap={RenderMap}
              keyBindingFn={KeyBindings}
              blockRendererFn={this.customRenderer}
              placeholder={this.props.placeholder}
              handleKeyCommand={this.onKeyCommand}
              onChange={(e) => this.onChange(e)}
              onFocus={this.onFocus}
            />

            {this.state.active && <EmojiSuggestions />}
            {this.state.active &&
              <MentionSuggestions
                onSearchChange={this.props.onMention}
                suggestions={this.props.mentions}
              />
            }

            {blockLength === 0 && this.state.active ?
              <Toolbar
                editorState={editorState}
                editorRoot={this.editorRoot}
                active={this.state.active}
                onChange={(e) => this.onChange(e)}
              /> : null
            }

            {!editorState.getSelection().isCollapsed() && this.state.active ?
              <Tooltip
                editorState={editorState}
                editorRoot={this.editorRoot}
                toggleInlineStyle={this.toggleInlineStyle}
                toggleBlockType={this.toggleBlockType}
              /> : null
            }

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mentions: getMentions(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onMention: debounce((query) => dispatch(mention(query.value)), 300)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent);
