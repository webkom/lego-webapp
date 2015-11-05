import '../styles/react-treeview.css';
import React, { Component, PropTypes } from 'react';
import TreeView from 'react-treeview';
import { Link } from 'react-router';
import { generateTreeStructure } from '../utils';

function generateTreeView(groups) {
  return groups.map(group => {
    if (group.children.length) {
      const nodeLabel = <Link to={`/admin/groups/${group.id}`}>{group.name}</Link>;
      return (
        <TreeView key={group.id} nodeLabel={nodeLabel} defaultCollapsed={false}>
          {generateTreeView(group.children)}
        </TreeView>
      );
    }

    return (
      <div key={group.id} className='info'>
        <Link to={`/admin/groups/${group.id}`}>{group.name}</Link>
      </div>
    );
  });
}

export default class GroupTree extends Component {

  static propTypes = {
    groups: PropTypes.array
  }

  render() {
    const { groups } = this.props;
    const tree = generateTreeStructure(groups);

    return (
      <div className='sidebar'>
        {generateTreeView(tree)}
      </div>
    );
  }
}
