// @flow

import { Editor } from 'slate-react';
import { Html } from 'slate';
import { schema } from './constants';
import Portal from 'react-portal';
import React from 'react';
import rules from './serializer';

const parseHtml =
  typeof DOMParser === 'undefined' && require('parse5').parseFragment;
const html = new Html({ rules, parseHtml });

type Props = {
  value?: 'string'
};

type State = {
  value: 'string'
};

class CustomEditor extends React.Component {
  props: Props;

  state: State = {
    state: html.deserialize(this.props.value || '<p></p>'),
    schema
  };

  componentDidMount = () => {
    this.updateMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
  };

  hasMark = type => {
    const { state } = this.state;

    if (!state.activeMarks) {
      return false;
    }

    return state.activeMarks.some(mark => mark.type == type);
  };

  onChange = ({ state }) => {
    if (state.document != this.state.state.document) {
      this.props.onChange(html.serialize(state));
    }

    this.setState({ state });
  };

  onClickMark = (e, type) => {
    e.preventDefault();
    const change = this.state.state.change().toggleMark(type);
    this.onChange(change);
  };

  onOpen = portal => {
    this.setState({ menu: portal.firstChild });
  };

  renderMenu = () => {
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="menu hover-menu">
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
        </div>
      </Portal>
    );
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    const onMouseDown = e => this.onClickMark(e, type);

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">
          {icon}
        </span>
      </span>
    );
  };

  updateMenu = () => {
    const { menu, state } = this.state;
    if (!menu) return;

    if (state.isBlurred || state.isEmpty) {
      menu.removeAttribute('style');
      return;
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${rect.left +
      window.scrollX -
      menu.offsetWidth / 2 +
      rect.width / 2}px`;
  };

  render() {
    return (
      <div>
        {this.renderMenu()}
        <div className="editor">
          <Editor
            schema={schema}
            state={this.state.state}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default CustomEditor;
