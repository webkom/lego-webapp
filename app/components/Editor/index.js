// @flow

import * as React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  SelectionState,
  ContentBlock,
  genKey
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { OrderedMap } from 'immutable';
import createEditorState from './model/content';

import AddButton from './components/addbutton';
import Toolbar from './components/toolbar';
import LinkEditComponent from './components/LinkEditComponent';
import styles from './Editor.css';
import rendererFn from './components/customrenderer';
import RenderMap from './util/rendermap';
import keyBindingFn from './util/keybinding';
import {
  Block,
  Entity as E,
  HANDLED,
  NOT_HANDLED,
  KEY_COMMANDS
} from './util/constants';
import beforeInput, { StringToTypeMap } from './util/beforeinput';
import blockStyleFn from './util/blockStyleFn';
import {
  getCurrentBlock,
  resetBlockWithType,
  addNewBlockAt,
  isCursorBetweenLink
} from './model';

type State = {
  editorState: EditorState
};

type Props = {
  placeholder?: string,
  onChange?: string => void,
  simpleEditor?: boolean,
  spellCheck?: boolean,
  editorEnabled?: boolean
};

export default class CustomEditor extends React.Component<Props, State> {
  editorNode: HTMLElement;
  toolbar: HTMLElement;

  static defaultProps = {
    simpleEditor: false,
    editorEnabled: true,
    spellCheck: true,
    placeholder: 'Write your story...'
  };

  state: State = {
    editorState: createEditorState()
  };

  focus = () => {
    this.editorNode.focus();
  };

  onChange = (editorState: EditorState) => {
    console.log(editorState);
    this.setState({ editorState }, () => {
      if (this.props.onChange) {
        this.props.onChange('test');
      }
    });
  };

  getEditorState = () => this.state.editorState;

  blockRendererFn = rendererFn(this.onChange, this.getEditorState);

  /**
   * Implemented to provide nesting of upto 2 levels in ULs or OLs.
   */
  onTab(e: SyntheticKeyboardEvent<*>) {
    const { editorState } = this.state;
    const newEditorState = RichUtils.onTab(e, editorState, 2);
    if (newEditorState !== editorState) {
      this.onChange(newEditorState);
    }
  }

  onUpArrow = (e: SyntheticKeyboardEvent<*>) => {
    const { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const key = selection.getAnchorKey();
    const currentBlock = content.getBlockForKey(key);
    const firstBlock = content.getFirstBlock();

    if (firstBlock.getKey() === key) {
      if (firstBlock.getType().indexOf(Block.ATOMIC) === 0) {
        e.preventDefault();
        const newBlock = new ContentBlock({
          type: Block.UNSTYLED,
          key: genKey()
        });
        const newBlockMap = OrderedMap([[newBlock.getKey(), newBlock]]).concat(
          content.getBlockMap()
        );
        const newContent = content.merge({
          blockMap: newBlockMap,
          selectionAfter: selection.merge({
            anchorKey: newBlock.getKey(),
            focusKey: newBlock.getKey(),
            anchorOffset: 0,
            focusOffset: 0,
            isBackward: false
          })
        });
        this.onChange(
          EditorState.push(editorState, newContent, 'insert-characters')
        );
      }
    } else if (currentBlock.getType().indexOf(Block.ATOMIC) === 0) {
      const blockBefore = content.getBlockBefore(key);
      if (!blockBefore) {
        return;
      }
      e.preventDefault();
      const newSelection = selection.merge({
        anchorKey: blockBefore.getKey(),
        focusKey: blockBefore.getKey(),
        anchorOffset: blockBefore.getLength(),
        focusOffset: blockBefore.getLength(),
        isBackward: false
      });
      this.onChange(EditorState.forceSelection(editorState, newSelection));
    }
  };

  /*
  Adds a hyperlink on the selected text with some basic checks.
  */
  setLink(url: string) {
    let { editorState } = this.state;
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    let entityKey = null;
    let newUrl = url;
    if (url !== '') {
      if (url.indexOf('http') === -1) {
        if (url.indexOf('@') >= 0) {
          newUrl = `mailto:${newUrl}`;
        } else {
          newUrl = `http://${newUrl}`;
        }
      }
      const contentWithEntity = content.createEntity(E.LINK, 'MUTABLE', {
        url: newUrl
      });
      editorState = EditorState.push(
        editorState,
        contentWithEntity,
        'create-entity'
      );
      entityKey = contentWithEntity.getLastCreatedEntityKey();
    }
    this.onChange(
      RichUtils.toggleLink(editorState, selection, entityKey),
      this.focus
    );
  }

  /*
  Handles custom commands based on various key combinations. First checks
  for some built-in commands. If found, that command's function is apllied and returns.
  If not found, it checks whether parent component handles that command or not.
  Some of the internal commands are:

  - showlinkinput -> Opens up the link input tooltip if some text is selected.
  - add-new-block -> Adds a new block at the current cursor position.
  - changetype:block-type -> If the command starts with `changetype:` and
    then succeeded by the block type, the current block will be converted to that particular type.
  - toggleinline:inline-type -> If the command starts with `toggleinline:` and
    then succeeded by the inline type, the current selection's inline type will be
    togglled.
  */
  handleKeyCommand = (command: string) => {
    const { editorState } = this.state;

    if (command === KEY_COMMANDS.showLinkInput()) {
      if (this.toolbar) {
        // For some reason, scroll is jumping sometimes for the below code.
        // Debug and fix it later.
        const isCursorLink = isCursorBetweenLink(editorState);
        if (isCursorLink) {
          this.editLinkAfterSelection(
            isCursorLink.blockKey,
            isCursorLink.entityKey
          );
          return HANDLED;
        }
        this.toolbar.handleLinkInput(null, true);
        return HANDLED;
      }
      return NOT_HANDLED;
    } else if (command === KEY_COMMANDS.unlink()) {
      const isCursorLink = isCursorBetweenLink(editorState);
      if (isCursorLink) {
        this.removeLink(isCursorLink.blockKey, isCursorLink.entityKey);
        return HANDLED;
      }
    }
    /* else if (command === KEY_COMMANDS.addNewBlock()) {
      const { editorState } = this.props;
      this.onChange(addNewBlock(editorState, Block.BLOCKQUOTE));
      return HANDLED;
    } */
    const block = getCurrentBlock(editorState);
    const currentBlockType = block.getType();
    // if (command === KEY_COMMANDS.deleteBlock()) {
    //   if (currentBlockType.indexOf(Block.ATOMIC) === 0 && block.getText().length === 0) {
    //     this.onChange(resetBlockWithType(editorState, Block.UNSTYLED, { text: '' }));
    //     return HANDLED;
    //   }
    //   return NOT_HANDLED;
    // }
    if (command.indexOf(`${KEY_COMMANDS.changeType()}`) === 0) {
      let newBlockType = command.split(':')[1];
      // const currentBlockType = block.getType();
      if (currentBlockType === Block.ATOMIC) {
        return HANDLED;
      }
      if (
        currentBlockType === Block.BLOCKQUOTE &&
        newBlockType === Block.CAPTION
      ) {
        newBlockType = Block.BLOCKQUOTE_CAPTION;
      } else if (
        currentBlockType === Block.BLOCKQUOTE_CAPTION &&
        newBlockType === Block.CAPTION
      ) {
        newBlockType = Block.BLOCKQUOTE;
      }
      this.onChange(RichUtils.toggleBlockType(editorState, newBlockType));
      return HANDLED;
    } else if (command.indexOf(`${KEY_COMMANDS.toggleInline()}`) === 0) {
      const inline = command.split(':')[1];
      this.toggleInlineStyle(inline);
      return HANDLED;
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return HANDLED;
    }
    return NOT_HANDLED;
  };

  /*
  This function is responsible for emitting various commands based on various key combos.
  */
  handleBeforeInput = (str: string) =>
    beforeInput(this.state.editorState, str, this.onChange, StringToTypeMap);

  /*
  By default, it handles return key for inserting soft breaks (BRs in HTML) and
  also instead of inserting a new empty block after current empty block, it first check
  whether the current block is of a type other than `unstyled`. If yes, current block is
  simply converted to an unstyled empty block. If RETURN is pressed on an unstyled block
  default behavior is executed.
  */
  handleReturn = (e: SyntheticKeyboardEvent<*>) => {
    const { editorState } = this.state;

    if (isSoftNewlineEvent(e)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return HANDLED;
    }
    if (!e.altKey && !e.metaKey && !e.ctrlKey) {
      const currentBlock = getCurrentBlock(editorState);
      const blockType = currentBlock.getType();

      if (blockType.indexOf(Block.ATOMIC) === 0) {
        this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
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
            this.onChange(resetBlockWithType(editorState, Block.UNSTYLED));
            return HANDLED;
          default:
            return NOT_HANDLED;
        }
      }

      const selection = editorState.getSelection();

      if (
        selection.isCollapsed() &&
        currentBlock.getLength() === selection.getStartOffset()
      ) {
        if (
          [
            Block.UNSTYLED,
            Block.BLOCKQUOTE,
            Block.OL,
            Block.UL,
            Block.CODE,
            Block.TODO
          ].indexOf(blockType) < 0
        ) {
          this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
          return HANDLED;
        }
        return NOT_HANDLED;
      }
      return NOT_HANDLED;
    }
    return NOT_HANDLED;
  };

  /*
  The function documented in `draft-js` to be used to toggle block types (mainly
  for some key combinations handled by default inside draft-js).
  */
  toggleBlockType = (blockType: string) => {
    const type = RichUtils.getCurrentBlockType(this.state.editorState);

    if (type.indexOf(`${Block.ATOMIC}:`) === 0) {
      return;
    }

    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  /*
  The function documented in `draft-js` to be used to toggle inline styles of selection (mainly
  for some key combinations handled by default inside draft-js).
  */
  toggleInlineStyle = (inlineStyle: string) => {
    const { editorState } = this.state;

    this.onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  removeLink = (blockKey: string, entityKey: string) => {
    const { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    const oldSelection = editorState.getSelection();
    block.findEntityRanges(
      character => {
        const eKey = character.getEntity();
        return eKey === entityKey;
      },
      (start, end) => {
        const selection = new SelectionState({
          anchorKey: blockKey,
          focusKey: blockKey,
          anchorOffset: start,
          focusOffset: end
        });
        const newEditorState = EditorState.forceSelection(
          RichUtils.toggleLink(editorState, selection, null),
          oldSelection
        );
        this.onChange(newEditorState, this.focus);
      }
    );
  };

  editLinkAfterSelection = (blockKey: string, entityKey?: string) => {
    if (entityKey == null) {
      // TODO validate this check
      return;
    }

    const { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    block.findEntityRanges(
      character => {
        const eKey = character.getEntity();
        return eKey === entityKey;
      },
      (start, end) => {
        const selection = new SelectionState({
          anchorKey: blockKey,
          focusKey: blockKey,
          anchorOffset: start,
          focusOffset: end
        });
        const newEditorState = EditorState.forceSelection(
          editorState,
          selection
        );
        this.onChange(newEditorState);
        setTimeout(() => {
          if (this.toolbar) {
            this.toolbar.handleLinkInput(null, true);
          }
        }, 100);
      }
    );
  };

  /*
  Renders the `Editor`, `Toolbar` and the side `AddButton`.
  */
  render() {
    const { editorState } = this.state;
    const { editorEnabled, simpleEditor, placeholder, spellCheck } = this.props;
    const isCursorLink = isCursorBetweenLink(editorState);

    return (
      <div className={styles.editorRoot}>
        <div className={styles.editor}>
          <Editor
            ref={node => {
              this.editorNode = node;
            }}
            {...this.props}
            editorState={editorState}
            blockRendererFn={this.blockRendererFn}
            blockStyleFn={blockStyleFn}
            onChange={this.onChange}
            onTab={this.onTab}
            onUpArrow={this.onUpArrow}
            blockRenderMap={RenderMap}
            handleKeyCommand={this.handleKeyCommand}
            handleBeforeInput={this.handleBeforeInput}
            handleReturn={this.handleReturn}
            readOnly={!editorEnabled}
            keyBindingFn={keyBindingFn}
            placeholder={placeholder}
            spellCheck={editorEnabled && spellCheck}
          />
          {!simpleEditor && (
            <AddButton
              editorState={editorState}
              getEditorState={this.getEditorState}
              setEditorState={this.onChange}
              focus={this.focus}
            />
          )}
          <Toolbar
            ref={c => {
              this.toolbar = c;
            }}
            editorNode={this.editorNode}
            editorState={editorState}
            toggleBlockType={this.toggleBlockType}
            toggleInlineStyle={this.toggleInlineStyle}
            editorEnabled={editorEnabled}
            setLink={this.setLink}
            focus={this.focus}
          />
          {isCursorLink && (
            <LinkEditComponent
              {...isCursorLink}
              editorState={editorState}
              removeLink={this.removeLink}
              editLink={this.editLinkAfterSelection}
            />
          )}
        </div>
      </div>
    );
  }
}
