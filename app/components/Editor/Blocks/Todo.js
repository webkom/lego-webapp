import React, { Component } from 'react';
import { EditorBlock } from 'draft-js';
import { updateDataOfBlock } from '../models';
import styles from './Todo.css';

export type Props = {
  block: Object,
  blockProps: Object
};

export default class TodoBlock extends Component {

  props: Props;

  updateData() {
    const { block, blockProps } = this.props;
    const { onChange, editorState } = blockProps;

    const data = block.getData();
    const checked = (data.has('checked') && data.get('checked') === true);
    const newData = data.set('checked', !checked);
    onChange(updateDataOfBlock(editorState, block, newData));
  }

  render() {
    const data = this.props.block.getData();
    const checked = data.get('checked') === true;

    return (
      <div className={styles.editorBlockTodo}>
        <input
          className={styles.todoCheckbox}
          type='checkbox'
          checked={checked}
          onChange={this.updateData}
        />
        <EditorBlock {...this.props} />
      </div>
    );
  }
}
