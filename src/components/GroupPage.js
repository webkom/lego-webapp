import React, { Component, PropTypes } from 'react';
import GroupTree from './GroupTree';

export default class GroupPage extends Component {
  static propTypes = {
    groups: PropTypes.array,
    children: PropTypes.any
  }

  render() {
    const { groups } = this.props;
    return (
      <div>
        <GroupTree groups={groups}/>
        {this.props.children}
      </div>
    );
  }
}
