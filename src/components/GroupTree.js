import React, { Component, PropTypes } from 'react';
import TreeView from 'react-treeview';
import '../styles/react-treeview.css';
import { Link } from 'react-router';

function generateTreeView(groups) {
  return groups.map( group => {
    if (group.children && group.children.length) {
      const nodeLabel = <Link to={`/admin/groups/${group.id}`}>{group.name}</Link>;
      return (
        <TreeView key={group.id} nodeLabel={nodeLabel} defaultCollapsed={false}>
          {generateTreeView(group.children)}
        </TreeView>
      );
    }
    return <div key={group.id} className='info'><Link to={`/admin/groups/${group.id}`}>{group.name}</Link></div>;
  });
}

function generateTreeStructure(groups) {
  const tree = groups.reduce( (acc, group) => {
    group.children = [];
    acc[group.id] = group;
    return acc;
  }, {});
  let maxDepth = 0;
  for (const id in tree) {
    let depth = 0;
    let current = tree[id];
    while (current.parent) {
      depth += 1;
      current = tree[current.parent];
    }
    tree[id].depth = depth;
    maxDepth = maxDepth < depth ? depth : maxDepth;
  }
  for (let depth = maxDepth; depth >= 1; depth--) {
    for (const id in tree) {
      if (tree[id].depth === depth) {
        tree[tree[id].parent].children.push(tree[id]);
        delete tree[id];
      }
    }
  }
  const treeArray = [];
  for (const id in tree) {
    treeArray.push(tree[id]);
  }
  return treeArray;
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
    /*
        <TreeView key={1} nodeLabel={"Hello"} defaultCollapsed={false}>
          <TreeView key={2} nodeLabel={"Hello 2"} defaultCollapsed={false}/>
          <TreeView key={3} nodeLabel={"Hello 3"} defaultCollapsed={false}/>
        </TreeView>
    */
  }
}
