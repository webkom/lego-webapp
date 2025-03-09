import { uniqBy } from 'lodash';
import { useMemo } from 'react';
import { ProfileSection } from '~/pages/users/@username/_components/ProfileSection';
import type { EntityId } from '@reduxjs/toolkit';
import type { CurrentUser, UserPermissionGroup } from '~/redux/models/User';

interface Props {
  permissionsPerGroup: CurrentUser['permissionsPerGroup'];
}

type TreeNodeGroup = UserPermissionGroup & {
  children: TreeNodeGroup[];
  parent?: EntityId;
  isMember?: boolean;
};

type GroupTreeData = { [key: EntityId]: TreeNodeGroup };

const TreeNodes = ({ groups }: { groups: TreeNodeGroup[] }) => {
  return groups.map((group) => {
    if (group.children.length) {
      return (
        <div key={group.id}>
          <TreeNodes groups={[{ ...group, children: [] }]} />
          <div
            style={{
              marginLeft: 10,
            }}
          >
            <TreeNodes groups={group.children} />
          </div>
        </div>
      );
    }

    return (
      <div key={group.id}>
        {group.isMember ? <b> {group.name}</b> : <i> {group.name}</i>}
      </div>
    );
  });
};

export const GroupTree = ({ permissionsPerGroup }: Props) => {
  const rootGroups = useMemo(() => {
    const tree: GroupTreeData = {};

    for (const group of permissionsPerGroup) {
      for (const index in group.parentPermissions) {
        const parent = group.parentPermissions[index];

        if (Number(index) === 0) {
          tree[parent.abakusGroup.id] = {
            ...parent.abakusGroup,
            children: [],
            parent: undefined,
          };
        } else {
          tree[parent.abakusGroup.id] = {
            ...parent.abakusGroup,
            children: [],
            parent: group.parentPermissions[Number(index) - 1].abakusGroup.id,
          };
        }
      }
    }

    for (const group of permissionsPerGroup) {
      tree[group.abakusGroup.id] = {
        ...group.abakusGroup,
        children: [],
        isMember: true,
        parent: group.parentPermissions.length
          ? group.parentPermissions[group.parentPermissions.length - 1]
              .abakusGroup.id
          : undefined,
      };
    }

    return permissionsPerGroup.reduce((roots: TreeNodeGroup[], val) => {
      const abakusGroup = val.abakusGroup;
      const id = abakusGroup.id;
      const node = tree[id];

      if (!node.parent) {
        roots = uniqBy(roots.concat(node), (a) => a.id);
      } else {
        const parent = tree[node.parent];
        parent.children = uniqBy(parent.children.concat(node), (a) => a.id);
      }

      for (const permGroup of val.parentPermissions) {
        const abakusGroup = permGroup.abakusGroup;
        const id = abakusGroup.id;
        const node = tree[id];

        if (!node.parent) {
          roots.push(node);
          roots = uniqBy(roots.concat(node), (a) => a.id);
        } else {
          const parent = tree[node.parent];
          parent.children = uniqBy(parent.children.concat(node), (a) => a.id);
        }
      }

      return roots;
    }, []);
  }, [permissionsPerGroup]);

  return (
    <ProfileSection
      title="Grupper"
      footer="Du er medlem av gruppene markert med fet tekst, og indirekte medlem av gruppene i kursiv."
    >
      <TreeNodes groups={rootGroups} />
    </ProfileSection>
  );
};
