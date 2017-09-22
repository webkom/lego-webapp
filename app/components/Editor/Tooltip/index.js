/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Portal from 'react-portal';
import TooltipButton from './TooltipButton';
import { Inline, Blocks } from '../constants';
import styles from './Tooltip.css';

export type Props = {
  editorState: object,
  disableBlocks: boolean,
  setInlineStyle: String => void,
  setBlockType: String => void,
  wrapperElement: object
};

export default class Tooltip extends Component {
  state = {
    menu: null
  };

  props: Props;

  componentDidMount = () => {
    this.updateMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
  };

  onOpen = portal => {
    this.setState({ menu: portal.firstChild });
  };

  updateMenu = () => {
    const { editorState } = this.props;
    const { menu } = this.state;
    if (!menu) return;

    if (editorState.isBlurred || editorState.isCollapsed) {
      menu.style.display = 'none';
      // menu.removeAttribute('style');
      return;
    }

    const selection = global.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    const rect = range.getBoundingClientRect();
    menu.style.display = 'initial';
    menu.style.top = `${rect.top + global.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${rect.left + global.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`;
  };

  hasStyle = type => {
    const { editorState } = this.props;
    return editorState.marks.some(mark => mark.type === type);
  };

  hasBlock = type => {
    const { editorState } = this.props;
    return editorState.blocks.some(node => node.type === type);
  };

  render() {
    const { setInlineStyle, setBlockType } = this.props;

    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className={styles.tooltip}>
          {[
            { type: Inline.Bold, icon: 'bold' },
            { type: Inline.Italic, icon: 'italic' },
            { type: Inline.Underline, icon: 'underline' },
            { type: Inline.Code, icon: 'embed2' },
            { type: Inline.Striketrough, icon: 'strikethrough' }
          ].map(({ type, icon }, i) => (
            <TooltipButton
              key={`${i}-${type}`}
              type={type}
              icon={icon}
              isActive={this.hasStyle(type)}
              onClick={setInlineStyle}
            />
          ))}
          {!this.props.disableBlocks && <span className={styles.tooltipSeperator} />}
          {!this.props.disableBlocks &&
            [
              { type: Blocks.H1, icon: 'font' },
              { type: Blocks.H2, icon: 'text-color' },
              { type: Blocks.Blockquote, icon: 'quotes-left' },
              { type: Blocks.Cite, icon: 'quotes-right' },
              { type: Blocks.UL, icon: 'list' },
              { type: Blocks.O, icon: 'list-numbered' }
            ].map(({ type, icon }, i) => (
              <TooltipButton
                key={`${i}-${type}`}
                type={type}
                icon={icon}
                isActive={this.hasBlock(type)}
                onClick={setBlockType}
              />
            ))}
        </div>
      </Portal>
    );
  }
}
