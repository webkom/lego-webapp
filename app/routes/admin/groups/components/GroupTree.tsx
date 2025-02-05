import { Link } from 'react-router-dom';
import TreeView from 'react-treeview';
import { generateTreeStructure } from 'app/utils';
import './GroupTree.module.css';

// Returns the URL that a group in the tree should point to.
// Re-uses the selected tab if there is one.
function getUrl(group: Record<string, any>, pathname: string) {
  if (pathname.match(/\d+/)) {
    return pathname.replace(/\d+/, group.id);
  }

  return `/admin/groups/${group.id}/settings`;
}

function generateTreeView(groups, pathname) {
  return groups
    .slice()
    .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB))
    .map((group) => {
      const href = getUrl(group, pathname);
      const link = (
        <Link to={href}>
          {group.name}
          {typeof group.numberOfUsers === 'number' && (
            <>
              {' '}
              <i>({group.numberOfUsers})</i>
            </>
          )}
        </Link>
      );

      if (group.children.length) {
        return (
          <TreeView key={group.id} nodeLabel={link} defaultCollapsed={false}>
            {generateTreeView(group.children, pathname)}
          </TreeView>
        );
      }

      return (
        <div key={group.id} className="GroupTree__sidebar__info">
          {link}
        </div>
      );
    });
}

type Props = {
  groups: Array<Record<string, any>>;
  pathname: string;
};

function GroupTree({ groups, pathname }: Props) {
  const tree = generateTreeStructure(groups);
  return <div>{generateTreeView(tree, pathname)}</div>;
}

export default GroupTree;
