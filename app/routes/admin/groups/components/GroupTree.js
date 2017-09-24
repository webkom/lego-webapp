// @flow
import React from 'react';
import TreeView from 'react-treeview';
import { Link } from 'react-router';
import { generateTreeStructure } from 'app/utils';
import styles from './GroupTree.css';

function generateTreeView(groups, pathname) {
  return groups.map(group => {
    // Re-use the currently selected sub-tab:
    const href = pathname.replace(/\d+/, group.id);
    const nodeLabel = <Link to={href}>{group.name}</Link>;

    if (group.children.length) {
      return (
        <TreeView key={group.id} nodeLabel={nodeLabel} defaultCollapsed={false}>
          {generateTreeView(group.children, pathname)}
        </TreeView>
      );
    }

    return (
      <div key={group.id} className="GroupTree__sidebar__info">
        {nodeLabel}
      </div>
    );
  });
}

type Props = {
  groups: Array<Object>,
  pathname: string
};

const GroupTree = ({ groups, pathname }: Props) => {
  const tree = generateTreeStructure(groups);
  return <div className={styles.tree}>{generateTreeView(tree, pathname)}</div>;
};

export default GroupTree;
